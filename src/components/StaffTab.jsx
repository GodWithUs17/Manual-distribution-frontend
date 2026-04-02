import React, { useState, useEffect } from "react";
import { UserPlus, Shield, Mail, Lock, User, X, ChevronDown, Award, Save, Clock, Trash2, Search, Filter, ShieldCheck, ShieldAlert } from "lucide-react";
import axios from "axios";
import API from "../api/axios"
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function StaffTab({ staff, refresh }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); 
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        setCurrentUser(payload);
      } catch (e) {
        console.error("Failed to parse token");
      }
    }
  }, []);

  const filteredStaff = staff?.filter(s => {
    const matchesSearch = 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === "all" ? true :
      statusFilter === "active" ? s.isActive === true :
      s.isActive === false;

    return matchesSearch && matchesStatus;
  }) || [];

  const handleCreateStaff = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    // Using the 'API' instance instead of raw axios
    await API.post("/admin/create-staff", formData);
    
    toast.success(`${formData.role.replace('_', ' ').toUpperCase()} Account Created`);
    setFormData({ name: "", email: "", password: "", role: "staff" });
    setShowForm(false);
    refresh(); 
  } catch (err) {
    toast.error(err.response?.data?.message || "Error creating account.");
  } finally {
    setLoading(false);
  }
};


  const handleToggleStatus = async (userId, isActive) => {
  // Prevent self-restriction
  if (userId === currentUser?.id) {
    return toast.error("You cannot restrict your own administrative access.");
  }

  const action = isActive ? "disable" : "enable";
  
  const result = await Swal.fire({
    title: `${isActive ? 'Restrict' : 'Authorize'} User?`,
    text: `This will ${isActive ? 'block' : 'grant'} login access for this user.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: isActive ? "#d33" : "#450a0a",
    confirmButtonText: `Yes, ${action}`,
    background: "#fdfcf7",
    color: "#450a0a"
  });

  if (result.isConfirmed) {
    try {
      // Cleaner URL using the API instance
      await API.patch(`/admin/staff/${userId}/${action}`);
      toast.success(`User access ${action}d`);
      refresh();
    } catch (err) {
      toast.error("Status update failed.");
    }
  }
};

  // const handleDeleteUser = async (userId) => {
  //   const result = await Swal.fire({
  //     title: "Permanent Removal?",
  //     text: "This action cannot be undone. The staff profile will be purged.",
  //     icon: "error",
  //     showCancelButton: true,
  //     confirmButtonColor: "#d33",
  //     confirmButtonText: "Delete Permanently",
  //     background: "#fdfcf7",
  //     color: "#450a0a"
  //   });

  //   if (result.isConfirmed) {
  //     const token = localStorage.getItem("token");
  //     try {
  //       await axios.delete(`http://localhost:5000/api/admin/staff/${userId}`, {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       toast.success("Staff profile deleted");
  //       refresh();
  //     } catch (err) {
  //       toast.error("Deletion failed.");
  //     }
  //   }
  // };

  const handleDeleteUser = async (userId) => {
  if (userId === currentUser?.id) {
    return toast.error("Safety Protocol: You cannot delete your own account.");
  }

  const result = await Swal.fire({
    title: "Permanent Removal?",
    text: "This action cannot be undone. The staff profile will be purged.",
    icon: "error",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Delete Permanently",
    background: "#fdfcf7",
    color: "#450a0a"
  });

  if (result.isConfirmed) {
    try {
      await API.delete(`/admin/staff/${userId}`);
      toast.success("Staff profile deleted");
      refresh();
    } catch (err) {
      toast.error("Deletion failed.");
    }
  }
};

  const formatLastLogin = (date) => {
    if (!date) return "Never Active";
    const lastLoginDate = new Date(date);
    const now = new Date();
    const diffInMinutes = Math.floor((now - lastLoginDate) / 60000);
    if (diffInMinutes >= 0 && diffInMinutes < 5) return "Online Now";

    return lastLoginDate.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* --- MANAGEMENT CONTROL PANEL --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-[2.5rem] border border-[#a16207]/10 shadow-sm">
        <div className="shrink-0 pl-2">
          <h2 className="font-black text-[#450a0a] text-xl tracking-tighter uppercase italic">Personnel Registry</h2>
          <p className="text-[#a16207] text-[10px] font-black uppercase tracking-[0.2em] mt-1">Institutional Access Control</p>
        </div>

        <div className="flex flex-col md:flex-row flex-1 gap-3 max-w-3xl">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a16207]/30" size={18} />
            <input 
              type="text"
              placeholder="Search by name, email, or role..."
              className="w-full pl-14 pr-4 py-4 bg-[#fdfcf7] rounded-2xl border border-[#a16207]/5 outline-none font-bold text-xs focus:ring-2 ring-[#450a0a]/5 transition shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative min-w-[200px]">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a16207]/30" size={16} />
            <select 
              className="w-full pl-12 pr-10 py-4 bg-[#fdfcf7] rounded-2xl border border-[#a16207]/5 outline-none font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer text-[#450a0a] shadow-inner"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Filter: All Status</option>
              <option value="active">Verified Only</option>
              <option value="inactive">Restricted Only</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#a16207]/40 pointer-events-none" size={14} />
          </div>
        </div>

        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center justify-center space-x-3 bg-[#450a0a] text-white px-8 py-4 rounded-2xl font-black text-[10px] tracking-[0.2em] hover:shadow-xl hover:shadow-[#450a0a]/20 transition-all active:scale-95 shadow-lg">
            <UserPlus size={18} />
            <span>ENROLL STAFF</span>
          </button>
        )}
      </div>

      {/* --- ENROLLMENT FORM --- */}
      {showForm && (
        <div className="bg-white p-10 rounded-[3rem] border border-[#a16207]/10 shadow-2xl max-w-xl mx-auto animate-in zoom-in-95 fade-in duration-300">
          <div className="flex justify-between items-start mb-10 border-b border-[#a16207]/10 pb-6">
            <div>
              <h3 className="font-black text-2xl text-[#450a0a] uppercase italic tracking-tighter">New Personnel Profile</h3>
              <p className="text-[#a16207] text-[10px] font-black uppercase tracking-widest mt-1">Assign Institutional Privileges</p>
            </div>
            <button onClick={() => setShowForm(false)} className="p-2.5 bg-[#fdfcf7] text-[#a16207] hover:text-red-600 rounded-full transition-all border border-[#a16207]/5"><X size={24}/></button>
          </div>
          
          <form onSubmit={handleCreateStaff} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#a16207] uppercase tracking-[0.2em] ml-1">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a16207]/30" size={20} />
                <input className="w-full pl-14 pr-4 py-5 bg-[#fdfcf7] rounded-2xl outline-none font-bold text-sm border border-[#a16207]/5 focus:border-[#450a0a] transition shadow-inner" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Dr. Emmanuel Oguntoke" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#a16207] uppercase tracking-[0.2em] ml-1">Official Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a16207]/30" size={20} />
                <input className="w-full pl-14 pr-4 py-5 bg-[#fdfcf7] rounded-2xl outline-none font-bold text-sm border border-[#a16207]/5 focus:border-[#450a0a] transition shadow-inner" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="staff@lautech.edu.ng" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#a16207] uppercase tracking-[0.2em] ml-1">Security Key</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a16207]/30" size={20} />
                  <input className="w-full pl-14 pr-4 py-5 bg-[#fdfcf7] rounded-2xl outline-none font-bold text-sm border border-[#a16207]/5 focus:border-[#450a0a] transition shadow-inner" type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#a16207] uppercase tracking-[0.2em] ml-1">Authority Rank</label>
                <div className="relative">
                  <Award className="absolute left-5 top-1/2 -translate-y-1/2 text-[#a16207]/30" size={20} />
                  <select className="w-full pl-14 pr-10 py-5 bg-[#fdfcf7] rounded-2xl outline-none appearance-none font-black text-[10px] uppercase tracking-widest text-[#450a0a] border border-[#a16207]/5 cursor-pointer shadow-inner" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="staff">Staff Member</option>
                    <option value="admin">Dept. Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#a16207]/40 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#450a0a] text-white rounded-[1.5rem] py-6 font-black text-[11px] uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-[#450a0a]/30 transition-all shadow-lg mt-6 flex items-center justify-center space-x-3 active:scale-95 disabled:opacity-50">
              {loading ? "AUTHENTICATING..." : <><Save size={20}/> <span>VALIDATE & ENROLL</span></>}
            </button>
          </form>
        </div>
      )}

      {/* --- PERSONNEL TABLE --- */}
      <div className="bg-white rounded-[2.5rem] border border-[#a16207]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-[#fdfcf7] text-[10px] font-black text-[#a16207] uppercase tracking-[0.2em] border-b border-[#a16207]/10">
              <tr>
                <th className="p-8">Personnel Information</th>
                <th className="p-8">Contact Point</th>
                <th className="p-8 text-center">Rank</th>
                <th className="p-8">Last System Sync</th>
                <th className="p-8 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#a16207]/5">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((s) => (
                  <tr key={s.id} className="group hover:bg-[#fdfcf7]/40 transition-colors">
                    <td className="p-8">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-[1.1rem] flex items-center justify-center text-sm font-black shadow-sm border border-[#a16207]/10 ${s.isActive ? 'bg-[#450a0a] text-white' : 'bg-stone-100 text-stone-400'}`}>
                          {s.name ? s.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="font-black text-[#450a0a] text-sm tracking-tight uppercase italic">{s.name}</div>
                          <div className="flex items-center mt-1">
                            {s.isActive ? <ShieldCheck size={10} className="text-green-600 mr-1" /> : <ShieldAlert size={10} className="text-red-400 mr-1" />}
                            <span className={`text-[9px] font-black uppercase tracking-widest ${s.isActive ? 'text-green-600' : 'text-red-400'}`}>
                              {s.isActive ? 'Verified Access' : 'Restricted'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 text-stone-500 font-bold text-xs">{s.email}</td>
                    <td className="p-8 text-center">
                      <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                        s.role === 'super_admin' ? 'bg-[#450a0a] text-white border-[#450a0a]' : 
                        s.role === 'admin' ? 'bg-[#a16207]/10 text-[#a16207] border-[#a16207]/10' : 'bg-[#fdfcf7] text-stone-500 border-stone-100'
                      }`}>
                        {s.role ? s.role.replace('_', ' ') : 'staff'}
                      </span>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center text-[#a16207] text-[10px] font-black tracking-widest opacity-60">
                        <Clock size={14} className="mr-2" />
                        {formatLastLogin(s.lastLogin)}
                      </div>
                    </td>
                    <td className="p-8 text-right space-x-1">
                      <button 
                        onClick={() => handleToggleStatus(s.id, s.isActive)} 
                        title={s.isActive ? "Revoke Access" : "Grant Access"}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] transition-all border ${s.isActive ? "text-orange-600 bg-orange-50 border-orange-100" : "text-green-700 bg-green-50 border-green-100"}`}
                      >
                        {s.isActive ? "Restrict" : "Verify"}
                      </button>
                      {currentUser?.role === 'super_admin' && (
                        <button 
                          onClick={() => handleDeleteUser(s.id)} 
                          title="Purge Record"
                          className="p-3 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-24 text-center">
                     <div className="flex flex-col items-center space-y-4 opacity-20">
                        <ShieldAlert size={48} className="text-[#a16207]" />
                        <p className="font-black text-[10px] text-[#a16207] uppercase tracking-[0.5em]">Personnel Record Not Located</p>
                     </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}