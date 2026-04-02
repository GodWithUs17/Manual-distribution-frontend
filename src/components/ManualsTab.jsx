// import React, { useState, useEffect } from "react";
// import { Plus, X, Edit, Save, Book, Hash, Banknote, Image as ImageIcon, Trash2, Eye, EyeOff, ShoppingBag, Search } from "lucide-react";
// import axios from "axios";

// export default function ManualsTab({ manuals, refresh, editingId, setEditingId }) {
//   const [showForm, setShowForm] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState(""); // NEW: Search state
//   const [formData, setFormData] = useState({
//     title: "",
//     courseCode: "",
//     price: "",
//     image: null,
//     preview: null,
//     isActive: true
//   });

//   // Filter manuals based on search term
//   const filteredManuals = manuals.filter(m => 
//     m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
//     (m.courseCode && m.courseCode.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   useEffect(() => {
//     if (editingId) {
//       const manualToEdit = manuals.find(m => m.id === editingId);
//       if (manualToEdit) {
//         setFormData({
//           title: manualToEdit.title,
//           courseCode: manualToEdit.courseCode || "",
//           price: manualToEdit.price,
//           isActive: manualToEdit.isActive,
//           image: null,
//           preview: manualToEdit.imageURL || null
//         });
//         setShowForm(true);
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//       }
//     }
//   }, [editingId, manuals]);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, image: file, preview: URL.createObjectURL(file) });
//     }
//   };

//   const handleClose = () => {
//     if (formData.preview && !editingId) URL.revokeObjectURL(formData.preview);
//     setShowForm(false);
//     setFormData({ title: "", courseCode: "", price: "", image: null, preview: null, isActive: true });
//     setEditingId(null);
//   };

//   const handleToggle = async (id) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.patch(`http://localhost:5000/api/manuals/${id}/toggle`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       refresh();
//     } catch (err) {
//       alert("Status update failed");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure? This will permanently remove the manual.")) return;
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`http://localhost:5000/api/manuals/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       refresh();
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const dataToSend = new FormData();
//     dataToSend.append('title', formData.title);
//     dataToSend.append('courseCode', formData.courseCode);
//     dataToSend.append('price', formData.price);
//     dataToSend.append('isActive', formData.isActive);
//     if (formData.image) dataToSend.append('image', formData.image);

//     const token = localStorage.getItem('token');
//     try {
//       if (editingId) {
//         await axios.patch(`http://localhost:5000/api/manuals/${editingId}`, dataToSend, {
//           headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
//         });
//       } else {
//         await axios.post("http://localhost:5000/api/manuals", dataToSend, {
//           headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
//         });
//       }
//       handleClose();
//       refresh();
//     } catch (err) {
//       alert("Operation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6 max-w-6xl mx-auto pb-10 px-4">
      
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
//         <div>
//           <h2 className="font-black text-gray-900 text-lg tracking-tight">Inventory Management</h2>
//           <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-0.5">Control Course Materials</p>
//         </div>
        
//         {/* NEW: SEARCH INPUT */}
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
//           <input 
//             type="text"
//             placeholder="Search by title or course code..."
//             className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none outline-none font-bold text-xs focus:ring-2 ring-black/5 transition"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         {!showForm && (
//           <button onClick={() => setShowForm(true)} className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest hover:bg-gray-800 transition active:scale-95 shadow-lg">
//             <Plus size={14} />
//             <span>ADD MANUAL</span>
//           </button>
//         )}
//       </div>

//       {/* FORM CARD (SAME AS BEFORE) */}
//       {showForm && (
//         <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl max-w-xl mx-auto animate-in zoom-in-95 duration-300">
//            {/* ... existing form code ... */}
//            <div className="flex justify-between items-start mb-8">
//             <h3 className="font-black text-2xl text-gray-900">{editingId ? "Update Manual" : "New Manual"}</h3>
//             <button onClick={handleClose} className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"><X size={20}/></button>
//           </div>
          
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <label className="text-[10px] font-black text-gray-300 uppercase ml-1">Manual Cover</label>
//               <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition cursor-pointer relative">
//                 {formData.preview ? (
//                   <img src={formData.preview} className="h-40 w-full object-contain rounded-lg mb-2" alt="Preview" />
//                 ) : (
//                   <ImageIcon size={40} className="text-gray-200 mb-2" />
//                 )}
//                 <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
//                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to {formData.preview ? "Change" : "Upload"} Photo</span>
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className="text-[10px] font-black text-gray-300 uppercase ml-1">Manual Title</label>
//               <div className="relative">
//                 <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
//                 <input className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm border-none" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Intro to Genetics" required />
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-gray-300 uppercase ml-1">Course Code</label>
//                 <div className="relative">
//                   <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
//                   <input className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm border-none" value={formData.courseCode} onChange={(e) => setFormData({...formData, courseCode: e.target.value})} placeholder="APH 201" />
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <label className="text-[10px] font-black text-gray-300 uppercase ml-1">Price (₦)</label>
//                 <div className="relative">
//                   <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
//                   <input type="number" className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm border-none" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="3000" required />
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-4 mt-6">
//               <button type="button" onClick={handleClose} className="flex-1 bg-gray-100 text-gray-500 rounded-2xl py-5 font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition">Discard</button>
//               <button type="submit" disabled={loading} className="flex-[2] bg-black text-white rounded-2xl py-5 font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition">
//                 <Save size={16} />
//                 <span>{loading ? "SAVING..." : "SAVE CHANGES"}</span>
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* TABLE */}
//       <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
//               <tr>
//                 <th className="p-6">Manual Details</th>
//                 <th className="p-6 text-center">Price</th>
//                 <th className="p-6 text-center">Sales</th>
//                 <th className="p-6 text-center">Status</th>
//                 <th className="p-6 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-50">
//               {filteredManuals.length > 0 ? (
//                 filteredManuals.map((m) => (
//                   <tr key={m.id} className={`hover:bg-gray-50/50 transition-colors ${!m.isActive ? "bg-gray-50/30 opacity-80" : ""}`}>
//                     <td className="p-6 flex items-center space-x-4">
//                       <div className="relative">
//                         <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border flex-shrink-0">
//                           {m.imageURL ? <img src={m.imageURL} className="w-full h-full object-cover" alt="cover" /> : <Book size={20} className="m-auto mt-3 text-gray-300" />}
//                         </div>
//                         <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${m.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
//                       </div>
//                       <div>
//                         <div className={`font-black text-sm ${m.isActive ? "text-gray-900" : "text-gray-400"}`}>{m.title}</div>
//                         <div className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">{m.courseCode || "No Code"}</div>
//                       </div>
//                     </td>
//                     <td className="p-6 text-center font-black text-gray-700 text-sm">₦{m.price.toLocaleString()}</td>
//                     <td className="p-6 text-center">
//                       <div className="inline-flex items-center space-x-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg">
//                         <ShoppingBag size={12} />
//                         <span className="font-black text-xs">{m._count?.purchases || 0}</span>
//                       </div>
//                     </td>
//                     <td className="p-6 text-center">
//                       <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${m.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
//                         {m.isActive ? "VISIBLE" : "HIDDEN"}
//                       </span>
//                     </td>
//                     <td className="p-6 text-right space-x-1">
//                       <button onClick={() => handleToggle(m.id)} className={`p-3 rounded-xl transition-all ${m.isActive ? "text-orange-500 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}`}>
//                         {m.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
//                       </button>
//                       <button onClick={() => setEditingId(m.id)} className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit size={16} /></button>
//                       <button onClick={() => handleDelete(m.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-xl hover:text-red-600 transition-all"><Trash2 size={16} /></button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="p-10 text-center text-gray-400 font-bold text-xs uppercase tracking-widest">No manuals found matches your search.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Plus, X, Edit, Save, Book, Hash, Banknote, Image as ImageIcon, Trash2, Eye, EyeOff, ShoppingBag, Search } from "lucide-react";
import API from "../api/axios"
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function ManualsTab({ manuals, refresh, editingId, setEditingId }) {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    courseCode: "",
    price: "",
    image: null,
    preview: null,
    isActive: true
  });

  const filteredManuals = manuals.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.courseCode && m.courseCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (editingId) {
      const manualToEdit = manuals.find(m => m.id === editingId);
      if (manualToEdit) {
        setFormData({
          title: manualToEdit.title,
          courseCode: manualToEdit.courseCode || "",
          price: manualToEdit.price,
          isActive: manualToEdit.isActive,
          image: null,
          preview: manualToEdit.imageURL || null
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [editingId, manuals]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file, preview: URL.createObjectURL(file) });
    }
  };

  const handleClose = () => {
    if (formData.preview && !editingId) URL.revokeObjectURL(formData.preview);
    setShowForm(false);
    setFormData({ title: "", courseCode: "", price: "", image: null, preview: null, isActive: true });
    setEditingId(null);
  };

  const handleToggle = async (id) => {
    try {
      await API.patch(`/manuals/${id}/toggle`);
      toast.success("Visibility Updated");
      refresh();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Manual?",
      text: "This will permanently remove the manual from the store.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#450a0a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete It",
      background: "#fdfcf7",
      color: "#450a0a",
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/manuals/${id}`);
        toast.success("Manual Removed");
        refresh();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('courseCode', formData.courseCode);
    dataToSend.append('price', formData.price);
    dataToSend.append('isActive', formData.isActive);
    if (formData.image) dataToSend.append('image', formData.image);

    try {
      if (editingId) {
        await API.patch(`/manuals/${editingId}`, dataToSend);
        toast.success("Manual Updated Successfully");
      } else {
        await API.post("/manuals", dataToSend);
        toast.success("New Manual Added to Inventory");
      }
      handleClose();
      refresh();
    } catch (err) {
      toast.error("Operation failed. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      
      {/* SEARCH & ACTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border border-[#a16207]/10 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a16207]/40" size={18} />
          <input 
            type="text"
            placeholder="Search manuals..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#fdfcf7] rounded-2xl border border-[#a16207]/5 outline-none font-bold text-xs focus:ring-2 ring-[#450a0a]/5 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center justify-center space-x-2 bg-[#450a0a] text-white px-8 py-3.5 rounded-2xl font-black text-[10px] tracking-widest hover:shadow-xl hover:shadow-[#450a0a]/20 transition active:scale-95">
            <Plus size={16} />
            <span>ADD NEW MANUAL</span>
          </button>
        )}
      </div>

      {/* FORM CARD */}
      {showForm && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-[#a16207]/10 shadow-2xl max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center mb-8 border-b border-[#a16207]/10 pb-4">
            <h3 className="font-black text-2xl text-[#450a0a] tracking-tighter uppercase italic">{editingId ? "Update Record" : "New Entry"}</h3>
            <button onClick={handleClose} className="p-2 bg-[#fdfcf7] text-[#a16207] hover:text-red-500 rounded-full transition-colors"><X size={20}/></button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#a16207] uppercase tracking-widest ml-1">Manual Cover Art</label>
              <div className="flex flex-col items-center p-6 border-2 border-dashed border-[#a16207]/20 rounded-3xl bg-[#fdfcf7] hover:bg-white transition cursor-pointer relative group">
                {formData.preview ? (
                  <img src={formData.preview} className="h-44 w-full object-contain rounded-xl mb-2" alt="Preview" />
                ) : (
                  <ImageIcon size={48} className="text-[#a16207]/20 mb-2 group-hover:scale-110 transition-transform" />
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <span className="text-[10px] font-black text-[#a16207]/60 uppercase tracking-widest">Click to {formData.preview ? "Change" : "Upload"} File</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-[#a16207] uppercase tracking-widest ml-1">Full Manual Title</label>
              <div className="relative">
                <Book className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a16207]/30" size={18} />
                <input className="w-full pl-12 pr-4 py-4 bg-[#fdfcf7] rounded-2xl outline-none font-bold text-sm border border-[#a16207]/5 focus:border-[#450a0a]" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Intro to Ruminant Nutrition" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#a16207] uppercase tracking-widest ml-1">Course Code</label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a16207]/30" size={18} />
                  <input className="w-full pl-12 pr-4 py-4 bg-[#fdfcf7] rounded-2xl outline-none font-bold text-sm border border-[#a16207]/5" value={formData.courseCode} onChange={(e) => setFormData({...formData, courseCode: e.target.value})} placeholder="APH 311" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#a16207] uppercase tracking-widest ml-1">Unit Price (₦)</label>
                <div className="relative">
                  <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a16207]/30" size={18} />
                  <input type="number" className="w-full pl-12 pr-4 py-4 bg-[#fdfcf7] rounded-2xl outline-none font-bold text-sm border border-[#a16207]/5" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="3500" required />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={handleClose} className="flex-1 bg-[#fdfcf7] text-[#a16207] rounded-2xl py-5 font-black text-[10px] uppercase tracking-widest hover:bg-[#a16207]/5 transition">Discard</button>
              <button type="submit" disabled={loading} className="flex-[2] bg-[#450a0a] text-white rounded-2xl py-5 font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2 active:scale-95 transition disabled:opacity-50">
                <Save size={18} />
                <span>{loading ? "PROCESSING..." : "SAVE TO REPOSITORY"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* INVENTORY TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-[#a16207]/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#fdfcf7] text-[10px] font-black text-[#a16207] uppercase tracking-[0.2em]">
              <tr>
                <th className="p-8">Publication Details</th>
                <th className="p-8 text-center">Market Price</th>
                <th className="p-8 text-center">Sold Units</th>
                <th className="p-8 text-center">Status</th>
                <th className="p-8 text-right">Repository Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#a16207]/5">
              {filteredManuals.length > 0 ? (
                filteredManuals.map((m) => (
                  <tr key={m.id} className={`hover:bg-[#fdfcf7]/50 transition-colors ${!m.isActive ? "bg-gray-50/50 grayscale-[0.5]" : ""}`}>
                    <td className="p-8">
                      <div className="flex items-center space-x-5">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-[#fdfcf7] overflow-hidden border border-[#a16207]/10 flex-shrink-0 shadow-sm">
                            {m.imageURL ? <img src={m.imageURL} className="w-full h-full object-cover" alt="cover" /> : <Book size={24} className="m-auto mt-3.5 text-[#a16207]/20" />}
                          </div>
                          <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-4 border-white ${m.isActive ? "bg-green-500" : "bg-red-500"}`}></div>
                        </div>
                        <div>
                          <div className={`font-black text-sm tracking-tight ${m.isActive ? "text-[#450a0a]" : "text-gray-400"}`}>{m.title}</div>
                          <div className="text-[10px] font-black text-[#a16207] uppercase tracking-widest">{m.courseCode || "UNCODED"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 text-center font-black text-[#450a0a] text-sm">₦{m.price.toLocaleString()}</td>
                    <td className="p-8 text-center">
                      <div className="inline-flex items-center space-x-2 bg-[#450a0a]/5 text-[#450a0a] px-4 py-1.5 rounded-full border border-[#450a0a]/5">
                        <ShoppingBag size={12} className="text-[#a16207]" />
                        <span className="font-black text-xs">{m._count?.purchases || 0}</span>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] shadow-sm ${m.isActive ? "bg-[#450a0a] text-[#fdfcf7]" : "bg-gray-200 text-gray-500"}`}>
                        {m.isActive ? "ACTIVE" : "ARCHIVED"}
                      </span>
                    </td>
                    <td className="p-8 text-right space-x-1">
                      <button onClick={() => handleToggle(m.id)} title="Toggle Visibility" className={`p-3 rounded-2xl transition-all ${m.isActive ? "text-orange-500 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}`}>
                        {m.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button onClick={() => setEditingId(m.id)} title="Edit Manual" className="p-3 text-[#a16207] hover:bg-[#a16207]/5 rounded-2xl transition-all"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(m.id)} title="Delete Manual" className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-2xl transition-all"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-20 text-center">
                     <div className="flex flex-col items-center space-y-3 opacity-30">
                        <Search size={40} className="text-[#a16207]" />
                        <p className="font-black text-[10px] text-[#a16207] uppercase tracking-[0.4em]">Inventory Match Not Found</p>
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