// import { useState, useEffect } from "react";
// import API from "../api/axios";
// import Swal from "sweetalert2";
// import toast from "react-hot-toast";
// import SalesTab from "../components/SalesTab";
// import StaffTab from "../components/StaffTab";
// import ManualsTab from "../components/ManualsTab";
// import { Users, ShoppingCart, Menu, X, BookOpen, Activity, LogOut } from "lucide-react";

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState("sales");
//   const [purchases, setPurchases] = useState([]);
//   const [staff, setStaff] = useState([]);
//   const [manuals, setManuals] = useState([]);
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const handleLogout = () => {
//     Swal.fire({
//       title: "Confirm Logout?",
//       text: "You will need to login again to access the dashboard.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#450a0a", // Maroon from your portal
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Logout",
//       background: "#fdfcf7", // Cream from your portal
//       color: "#450a0a",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         localStorage.clear();
//         window.location.href = "/login";
//       }
//     });
//   };

//   useEffect(() => {
//     if (activeTab === "sales") fetchSales();
//     if (activeTab === "staff") fetchStaff();
//     if (activeTab === "manuals") fetchManuals();
//   }, [activeTab]);

//   const fetchSales = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/purchases/all");
//       const salesData = res.data.purchases || (Array.isArray(res.data) ? res.data : []);
//       setPurchases(salesData);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       setPurchases([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStaff = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/admin/staff");
//       let incomingData = Array.isArray(res.data.staff) ? res.data.staff : (Array.isArray(res.data) ? res.data : []);
//       setStaff(incomingData);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchManuals = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/manuals");
//       const manualsData = res.data.manuals || (Array.isArray(res.data) ? res.data : []);
//       setManuals(manualsData);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//       setManuals([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownloadCSV = async (manualId, level) => {
//     try {
//       let url = `/api/admin/download-purchases?`;
//       if (manualId && manualId !== "All") url += `manualId=${manualId}&`;
//       if (level && level !== "All") url += `level=${level}`;
//       url = url.replace(/[&?]$/, "");

//       const response = await API.get(url, {
//         responseType: 'blob', 
//       });

//       const blobURL = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement('a');
//       link.href = blobURL;
//       link.setAttribute('download', `Inventory_Report.xlsx`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(blobURL);
      
//       toast.success("Inventory Exported Successfully!");
//     } catch (error) {
//       toast.error("Download Failed.");
//     }
//   };

//   const switchTab = (tab) => {
//     setActiveTab(tab);
//     setIsSidebarOpen(false);
//   };

//   return (
//     <div className="flex min-h-screen bg-[#fdfcf7] relative font-sans">
//       {isSidebarOpen && (
//         <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
//       )}

//       {/* SIDEBAR - Keep dark for contrast or go Maroon */}
//       <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#450a0a] text-[#fdfcf7] p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block border-r border-[#a16207]/20`}>
//         <div className="flex justify-between items-center mb-10 border-b border-[#a16207]/30 pb-4">
//           <div>
//             <h2 className="text-xl font-black tracking-tighter italic leading-tight">LAUTECH APH</h2>
//             <p className="text-[10px] font-bold text-[#a16207] tracking-[0.2em] uppercase">Inventory System</p>
//           </div>
//           <button className="md:hidden text-[#fdfcf7]" onClick={() => setIsSidebarOpen(false)}>
//             <X size={24} />
//           </button>
//         </div>
        
//         <nav className="space-y-4 flex-1">
//           <button onClick={() => switchTab("sales")} className={`flex items-center space-x-3 w-full p-4 rounded-xl transition-all duration-200 ${activeTab === "sales" ? "bg-[#fdfcf7] text-[#450a0a] shadow-xl scale-105" : "hover:bg-white/10 text-stone-300"}`}>
//             <ShoppingCart size={20} /> <span className="font-black text-xs uppercase tracking-widest">Distribution</span>
//           </button>
//           <button onClick={() => switchTab("manuals")} className={`flex items-center space-x-3 w-full p-4 rounded-xl transition-all duration-200 ${activeTab === "manuals" ? "bg-[#fdfcf7] text-[#450a0a] shadow-xl scale-105" : "hover:bg-white/10 text-stone-300"}`}>
//             <BookOpen size={20} /> <span className="font-black text-xs uppercase tracking-widest">Manuals</span>
//           </button>
//           <button onClick={() => switchTab("staff")} className={`flex items-center space-x-3 w-full p-4 rounded-xl transition-all duration-200 ${activeTab === "staff" ? "bg-[#fdfcf7] text-[#450a0a] shadow-xl scale-105" : "hover:bg-white/10 text-stone-300"}`}>
//             <Users size={20} /> <span className="font-black text-xs uppercase tracking-widest">Staff</span>
//           </button>
//         </nav>

//         <div className="pt-6 border-t border-[#a16207]/30">
//           <button 
//             onClick={handleLogout}
//             className="flex items-center space-x-3 w-full p-4 rounded-xl transition bg-black/20 text-red-400 hover:bg-red-500 hover:text-white group"
//           >
//             <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
//             <span className="font-black text-xs uppercase tracking-widest">Sign Out</span>
//           </button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT */}
//       <main className="flex-1 w-full min-w-0">
//         <header className="flex justify-between items-center p-6 md:p-10 bg-white/50 backdrop-blur-md border-b border-[#a16207]/10">
//           <div className="flex items-center space-x-4">
//             <button className="md:hidden p-3 bg-[#450a0a] text-white rounded-xl shadow-lg" onClick={() => setIsSidebarOpen(true)}>
//               <Menu size={20} />
//             </button>
//             <div>
//                <p className="text-[10px] font-black text-[#a16207] tracking-[0.3em] uppercase mb-1">Administrative Dashboard</p>
//                <h1 className="text-2xl md:text-4xl font-black text-[#450a0a] tracking-tighter">
//                 {activeTab === "sales" && "Sales Analytics"}
//                 {activeTab === "manuals" && "Inventory Management"}
//                 {activeTab === "staff" && "Team Directory"}
//               </h1>
//             </div>
//           </div>
          
//           <div className="hidden lg:flex items-center space-x-3 bg-[#450a0a] px-5 py-2.5 rounded-full shadow-lg shadow-[#450a0a]/20">
//             <Activity size={16} className="text-[#a16207] animate-pulse" />
//             <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Systems Operational</span>
//           </div>
//         </header>

//         <section className="p-6 md:p-10">
//           {loading ? (
//             <div className="flex flex-col justify-center items-center h-96 space-y-4">
//               <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-[#450a0a] border-r-4 border-transparent"></div>
//               <p className="text-[10px] font-black text-[#a16207] uppercase tracking-[0.3em] animate-pulse">Syncing Data...</p>
//             </div>
//           ) : (
//             <div className="bg-white/40 rounded-3xl p-2 shadow-inner border border-[#a16207]/5">
//                {activeTab === "sales" && <SalesTab purchases={purchases} onDownload={handleDownloadCSV} />}
//                {activeTab === "manuals" && <ManualsTab manuals={manuals} refresh={fetchManuals} editingId={editingId} setEditingId={setEditingId} />}
//                {activeTab === "staff" && <StaffTab staff={staff} refresh={fetchStaff} />}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import API from "../api/axios";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import SalesTab from "../components/SalesTab";
import StaffTab from "../components/StaffTab";
import ManualsTab from "../components/ManualsTab";
import { Users, ShoppingCart, Menu, X, BookOpen, Activity, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("sales");
  const [purchases, setPurchases] = useState([]);
  const [staff, setStaff] = useState([]);
  const [manuals, setManuals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Confirm Logout?",
      text: "You will need to login again to access the dashboard.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#450a0a", 
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
      background: "#fdfcf7", 
      color: "#450a0a",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        window.location.href = "/login";
      }
    });
  };

  useEffect(() => {
    if (activeTab === "sales") fetchSales();
    if (activeTab === "staff") fetchStaff();
    if (activeTab === "manuals") fetchManuals();
  }, [activeTab]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await API.get("/purchases/all");
      const salesData = res.data.purchases || (Array.isArray(res.data) ? res.data : []);
      setPurchases(salesData);
    } catch (err) {
      console.error("Fetch Error:", err);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/staff");
      let incomingData = Array.isArray(res.data.staff) ? res.data.staff : (Array.isArray(res.data) ? res.data : []);
      setStaff(incomingData);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchManuals = async () => {
    setLoading(true);
    try {
      const res = await API.get("/manuals");
      const manualsData = res.data.manuals || (Array.isArray(res.data) ? res.data : []);
      setManuals(manualsData);
    } catch (err) {
      console.error("Fetch Error:", err);
      setManuals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async (manualId, level) => {
    try {
      // 1. Build URL without redundant /api prefix
      let url = `/admin/download-purchases?`;
      if (manualId && manualId !== "All") url += `manualId=${manualId}&`;
      if (level && level !== "All") url += `level=${level}`;
      url = url.replace(/[&?]$/, "");

      // 2. Perform request (Interceptor handles token)
      const response = await API.get(url, {
        responseType: 'blob', 
      });

      // 3. Create download link
      const blobURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = blobURL;
      link.setAttribute('download', `Inventory_Report_${new Date().toLocaleDateString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobURL);
      
      toast.success("Inventory Exported Successfully!");
    } catch (error) {
      console.error("Download Error:", error);
      toast.error("Download Failed.");
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#fdfcf7] relative font-sans">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#450a0a] text-[#fdfcf7] p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block border-r border-[#a16207]/20`}>
        <div className="flex justify-between items-center mb-10 border-b border-[#a16207]/30 pb-4">
          <div>
            <h2 className="text-xl font-black tracking-tighter italic leading-tight">LAUTECH APH</h2>
            <p className="text-[10px] font-bold text-[#a16207] tracking-[0.2em] uppercase">Inventory System</p>
          </div>
          <button className="md:hidden text-[#fdfcf7]" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="space-y-4 flex-1">
          <button onClick={() => switchTab("sales")} className={`flex items-center space-x-3 w-full p-4 rounded-xl transition-all duration-200 ${activeTab === "sales" ? "bg-[#fdfcf7] text-[#450a0a] shadow-xl scale-105" : "hover:bg-white/10 text-stone-300"}`}>
            <ShoppingCart size={20} /> <span className="font-black text-xs uppercase tracking-widest">Distribution</span>
          </button>
          <button onClick={() => switchTab("manuals")} className={`flex items-center space-x-3 w-full p-4 rounded-xl transition-all duration-200 ${activeTab === "manuals" ? "bg-[#fdfcf7] text-[#450a0a] shadow-xl scale-105" : "hover:bg-white/10 text-stone-300"}`}>
            <BookOpen size={20} /> <span className="font-black text-xs uppercase tracking-widest">Manuals</span>
          </button>
          <button onClick={() => switchTab("staff")} className={`flex items-center space-x-3 w-full p-4 rounded-xl transition-all duration-200 ${activeTab === "staff" ? "bg-[#fdfcf7] text-[#450a0a] shadow-xl scale-105" : "hover:bg-white/10 text-stone-300"}`}>
            <Users size={20} /> <span className="font-black text-xs uppercase tracking-widest">Staff</span>
          </button>
        </nav>

        <div className="pt-6 border-t border-[#a16207]/30">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full p-4 rounded-xl transition bg-black/20 text-red-400 hover:bg-red-500 hover:text-white group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="font-black text-xs uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full min-w-0">
        <header className="flex justify-between items-center p-6 md:p-10 bg-white/50 backdrop-blur-md border-b border-[#a16207]/10">
          <div className="flex items-center space-x-4">
            <button className="md:hidden p-3 bg-[#450a0a] text-white rounded-xl shadow-lg" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
               <p className="text-[10px] font-black text-[#a16207] tracking-[0.3em] uppercase mb-1">Administrative Dashboard</p>
               <h1 className="text-2xl md:text-4xl font-black text-[#450a0a] tracking-tighter">
                {activeTab === "sales" && "Sales Analytics"}
                {activeTab === "manuals" && "Inventory Management"}
                {activeTab === "staff" && "Team Directory"}
              </h1>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-3 bg-[#450a0a] px-5 py-2.5 rounded-full shadow-lg shadow-[#450a0a]/20">
            <Activity size={16} className="text-[#a16207] animate-pulse" />
            <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">Systems Operational</span>
          </div>
        </header>

        <section className="p-6 md:p-10">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-96 space-y-4">
              <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-[#450a0a] border-r-4 border-transparent"></div>
              <p className="text-[10px] font-black text-[#a16207] uppercase tracking-[0.3em] animate-pulse">Syncing Data...</p>
            </div>
          ) : (
            <div className="bg-white/40 rounded-3xl p-2 shadow-inner border border-[#a16207]/5">
               {activeTab === "sales" && <SalesTab purchases={purchases} onDownload={handleDownloadCSV} />}
               {activeTab === "manuals" && <ManualsTab manuals={manuals} refresh={fetchManuals} editingId={editingId} setEditingId={setEditingId} />}
               {activeTab === "staff" && <StaffTab staff={staff} refresh={fetchStaff} />}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}