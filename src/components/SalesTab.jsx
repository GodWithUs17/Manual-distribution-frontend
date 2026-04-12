import React, { useState } from "react";
import { Download, Search, Filter, Layers, Wallet, Users, GraduationCap } from "lucide-react";

export default function SalesTab({ purchases, onDownload }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedManualId, setSelectedManualId] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  // 1. Get unique list of manuals from the purchases data
  const manualsList = Array.from(
    new Map(purchases.map((p) => [p.manual.id, p.manual])).values()
  );

  // 2. The Filter Logic
  const filtered = purchases.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.matricNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesManual =
      selectedManualId === "All" || p.manualId === Number(selectedManualId);
    
    const matchesLevel =
      selectedLevel === "All" || p.level === Number(selectedLevel);

    return matchesSearch && matchesManual && matchesLevel;
  });

  // 3. Calculate Total Revenue for the CURRENTLY FILTERED group
  const totalRevenue = filtered.reduce((acc, curr) => acc + curr.manual.price, 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* --- ANALYTICS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Total Revenue Card */}
        <div className="bg-white p-7 rounded-[2rem] border border-[#a16207]/10 shadow-sm flex items-center space-x-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#a16207]/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-110" />
          <div className="p-4 bg-[#fdfcf7] text-[#a16207] rounded-2xl border border-[#a16207]/10 shadow-inner">
            <Wallet size={28} />
          </div>
          <div>
            <p className="text-[#a16207] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Generated Revenue</p>
            <h3 className="text-3xl font-black text-[#450a0a] tracking-tighter">
              ₦{totalRevenue.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Records Found Card */}
        <div className="bg-white p-7 rounded-[2rem] border border-[#a16207]/10 shadow-sm flex items-center space-x-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#a16207]/5 rounded-bl-full -mr-10 -mt-10 transition-all group-hover:scale-110" />
          <div className="p-4 bg-[#fdfcf7] text-[#a16207] rounded-2xl border border-[#a16207]/10 shadow-inner">
            <Users size={28} />
          </div>
          <div>
            <p className="text-[#a16207] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Student Records</p>
            <h3 className="text-3xl font-black text-[#450a0a] tracking-tighter">{filtered.length}</h3>
          </div>
        </div>

        {/* Export Action Card */}
        <button 
          onClick={() => onDownload(selectedManualId, selectedLevel)} 
          className="flex flex-col justify-center items-center bg-[#450a0a] text-white p-6 rounded-[2rem] hover:shadow-2xl hover:shadow-[#450a0a]/30 transition-all active:scale-95 group border-4 border-[#fdfcf7] shadow-xl"
        >
          <div className="flex items-center space-x-3 mb-1">
             <Download size={20} className="text-[#a16207] group-hover:translate-y-1 transition-transform" /> 
             <span className="font-black text-[10px] tracking-[0.3em] uppercase">Export Ledger</span>
          </div>
          <p className="text-[10px] text-white/50 font-bold">Microsoft Excel (.xlsx)</p>
        </button>
      </div>

      {/* --- ADVANCED FILTER CONSOLE --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/80 backdrop-blur-md p-5 rounded-[2.5rem] border border-[#a16207]/10 shadow-sm">
        {/* Search Input */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a16207]/30 group-focus-within:text-[#450a0a] transition-colors" size={18} />
          <input 
            className="w-full pl-14 pr-4 py-4 bg-[#fdfcf7] rounded-2xl outline-none border border-[#a16207]/5 focus:border-[#a16207]/30 font-bold text-xs transition shadow-inner"
            placeholder="Search Name or Matric Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Manual Selector */}
        <div className="relative">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a16207]/30" size={18} />
          <select 
            className="w-full pl-14 pr-10 py-4 bg-[#fdfcf7] rounded-2xl outline-none appearance-none font-black text-[10px] uppercase tracking-widest text-[#450a0a] border border-[#a16207]/5 cursor-pointer shadow-inner"
            value={selectedManualId}
            onChange={(e) => setSelectedManualId(e.target.value)}
          >
            <option value="All">All Manuals</option>
            {manualsList.map(m => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
        </div>

        {/* Level Selector */}
        <div className="relative">
          <GraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a16207]/30" size={18} />
          <select 
            className="w-full pl-14 pr-10 py-4 bg-[#fdfcf7] rounded-2xl outline-none appearance-none font-black text-[10px] uppercase tracking-widest text-[#450a0a] border border-[#a16207]/5 cursor-pointer shadow-inner"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="All">All Academic Levels</option>
            {[100, 200, 300, 400, 500].map(lvl => (
              <option key={lvl} value={lvl}>{lvl} Level</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- DISTRIBUTION TABLE --- */}
      <div className="bg-white rounded-[2.5rem] border border-[#a16207]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-[#fdfcf7] text-[#a16207] text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#a16207]/10">
              <tr>
                <th className="p-8">Student Identification</th>
                <th className="p-8">Matric Number</th>
                <th className="p-8">Level</th>
                <th className="p-8">Manual Allocated</th>
                <th className="p-8 text-right">Status</th>
                <th className="p-8 text-right">Issued By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#a16207]/5">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#fdfcf7]/50 transition-colors group">
                  <td className="p-8">
                    <div className="font-black text-[#450a0a] tracking-tight text-sm uppercase italic">{p.fullName}</div>
                    <div className="text-[10px] text-[#a16207] uppercase font-black tracking-widest mt-1 opacity-60">{p.department || "Dept of Agricultural Sciences"}</div>
                  </td>
                  <td className="p-8 font-mono text-xs font-black text-stone-500 tracking-tighter">{p.matricNo}</td>
                  <td className="p-8">
                     <span className="flex items-center space-x-1.5 font-black text-[#450a0a] text-xs">
                        <Layers size={14} className="text-[#a16207]" />
                        <span>{p.level}L</span>
                     </span>
                  </td>
                  <td className="p-8">
                     <div className="font-black text-[#450a0a] text-[11px] uppercase tracking-tight max-w-[200px] leading-tight">
                        {p.manual.title}
                     </div>
                  </td>
                  <td className="p-8 text-right">
                    <span className={`px-5 py-2 rounded-full text-[9px] font-black tracking-[0.2em] shadow-sm border ${p.status === 'paid' ? 'bg-[#450a0a] text-[#fdfcf7] border-[#450a0a]' : 'bg-white text-stone-400 border-stone-100'}`}>
                      {p.status === 'paid' ? "PAID" : "PENDING"}
                    </span>
                  </td>

                  <td className="p-8 text-right">
                    <div className="text-[10px] font-black text-[#450a0a] uppercase tracking-tighter opacity-80">
                      {/* If it's collected, show the name. If not, show a dash. */}
                      {p.collected ? (p.issuedBy || "Staff") : "—"}
                    </div>
                    {p.collectedAt && (
                      <div className="text-[8px] text-[#a16207] font-black opacity-50 mt-1">
                        {new Date(p.collectedAt).toLocaleDateString()}
                      </div>
                      )}
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="p-24 text-center">
               <div className="flex flex-col items-center space-y-4 opacity-20">
                  <Search size={48} className="text-[#a16207]" />
                  <p className="font-black text-[10px] text-[#a16207] uppercase tracking-[0.5em]">No Distribution Records Match This Query</p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}