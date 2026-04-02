import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios"
import { ShieldCheck, AlertCircle, ArrowLeft, CreditCard, Loader2, Landmark, FileCheck, Mail } from "lucide-react";

export default function Checkout() {
  const { manualId } = useParams();
  const navigate = useNavigate();

  const [manual, setManual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false); 
  const [showReview, setShowReview] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    matricNo: "",
    department: "",
    level: ""
  });

  const departments = [
    "Agricultural Economics",
    "Agricultural Extension and Rural Development",
    "Animal Nutrition and Biotechnology",
    "Animal Production and Health",
    "Crop and Environmental Protection",
    "Crop Production and Soil Science"
  ];

  useEffect(() => {
    const fetchManual = async () => {
      try {
        const res = await API.get("/manuals");
        const selected = res.data.find((m) => m.id === Number(manualId));
        if (!selected) {
          setErrorMessage("Manual not found");
          return;
        }
        setManual(selected);
      } catch (err) {
        setErrorMessage("Failed to load manual details");
      }
    };
    fetchManual();
  }, [manualId]);

  const handleChange = (e) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation check before showing review
    if (!form.fullName || !form.email || !form.matricNo || !form.department || !form.level) {
      setErrorMessage("Please complete all fields.");
      return;
    }

    setShowReview(true); 
  };

  const confirmAndPay = async () => {
    setShowReview(false);
    setLoading(true); 

    try {
      // CLEAN PAYLOAD: Ensures types match Backend/Prisma expectations
      const payload = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        matricNo: form.matricNo.trim(),
        department: form.department,
        level: parseInt(form.level, 10), // Convert to Int
        manualId: Number(manualId)       // Convert to Int
      };

      const res = await API.post("/purchases/initialize", payload);
      
      const backendRef = res.data.purchase.transactionRef;
      const pKey = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "").trim();
      
      const paystackArgs = {
        key: pKey,           
        email: payload.email,
        amount: Math.round(Number(manual.price) * 100),
        reference: backendRef, 
        callback: (response) => {
          setVerifying(true); 
          handleVerification(response, backendRef);
        },
        onClose: () => {
          if (!verifying) {
            setLoading(false);
            setErrorMessage("Transaction cancelled.");
          }
        },
      };

      const handler = window.PaystackPop.setup(paystackArgs);
      handler.openIframe();

    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.details || "Connection error";
      setErrorMessage(msg);
      setLoading(false);
    }
  };

  const handleVerification = async (paystackResponse, internalRef) => {
    try {
      await API.post("/purchases/verify", {
        reference: paystackResponse.reference,
        internalRef: internalRef 
      });

      navigate("/Receipt", { 
        state: { 
          matricNo: form.matricNo, 
          reference: paystackResponse.reference 
        } 
      });
    } catch (err) {
      setErrorMessage("Payment confirmed but verification failed. Contact Admin.");
      setLoading(false);
      setVerifying(false);
    }
  };

  if (!manual) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcf7]">
      <Loader2 className="animate-spin text-[#a16207]" size={30} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfcf7] py-12 px-4 relative font-sans">
      
      {/* PROCESSING OVERLAY */}
      {(loading || verifying) && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-[#a16207]/10 border-t-[#450a0a] rounded-full animate-spin"></div>
            {verifying ? (
              <FileCheck className="absolute inset-0 m-auto text-green-600 animate-bounce" size={32} />
            ) : (
              <ShieldCheck className="absolute inset-0 m-auto text-[#a16207]" size={32} />
            )}
          </div>
          <div className="text-center">
            <h2 className="font-black text-[#450a0a] uppercase italic tracking-tighter text-xl">
              {verifying ? "Generating Receipt" : "Securing Transaction"}
            </h2>
            <p className="text-[10px] text-[#a16207] font-black uppercase tracking-[0.4em] mt-2 animate-pulse">
              Please do not refresh the page
            </p>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-[#a16207]/5 overflow-hidden">
        {/* Header */}
        <div className="bg-[#450a0a] p-10 text-center text-white relative">
          <button onClick={() => navigate(-1)} className="absolute left-8 top-10 text-white/30 hover:text-white transition">
            <ArrowLeft size={20}/>
          </button>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Manual Allocation</h1>
        </div>

        <div className="p-10 space-y-8">
          {/* Price Card */}
          <div className="bg-[#fdfcf7] p-6 rounded-[2rem] border border-[#a16207]/10 flex justify-between items-center shadow-inner">
            <div className="flex items-center space-x-4">
               <div className="p-3 bg-white rounded-2xl shadow-sm text-[#a16207] border border-[#a16207]/5"><Landmark size={20}/></div>
               <h2 className="font-black text-[#450a0a] uppercase text-xs tracking-tight">{manual.title}</h2>
            </div>
            <div className="text-2xl font-black text-[#a16207]">₦{manual.price.toLocaleString()}</div>
          </div>

          {errorMessage && (
            <div className="p-5 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center space-x-3">
              <AlertCircle size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* FULL NAME */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#a16207] uppercase ml-1 tracking-[0.2em]">Full Legal Name</label>
              <input 
                name="fullName" 
                value={form.fullName} 
                onChange={handleChange} 
                disabled={loading || verifying}
                className="w-full bg-[#fdfcf7] border border-[#a16207]/5 p-5 rounded-2xl outline-none font-bold text-sm shadow-inner disabled:opacity-40" 
                required 
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#a16207] uppercase ml-1 tracking-[0.2em]">Institutional Email</label>
              <div className="relative">
                <input 
                  name="email" 
                  type="email"
                  value={form.email} 
                  onChange={handleChange} 
                  disabled={loading || verifying}
                  className="w-full bg-[#fdfcf7] border border-[#a16207]/5 p-5 pr-12 rounded-2xl outline-none font-bold text-sm shadow-inner disabled:opacity-40" 
                  placeholder="student@lautech.edu.ng"
                  required 
                />
                <Mail className="absolute right-5 top-5 text-[#a16207]/30" size={18} />
              </div>
            </div>

            {/* DEPARTMENT */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#a16207] uppercase ml-1 tracking-[0.2em]">Academic Department</label>
              <select 
                name="department" 
                value={form.department} 
                onChange={handleChange} 
                disabled={loading || verifying}
                className="w-full bg-[#fdfcf7] border border-[#a16207]/5 p-5 rounded-2xl outline-none font-black text-[10px] tracking-widest uppercase appearance-none shadow-inner disabled:opacity-40" 
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#a16207] uppercase ml-1 tracking-[0.2em]">Matric No.</label>
                <input 
                  name="matricNo" 
                  value={form.matricNo} 
                  onChange={handleChange} 
                  disabled={loading || verifying}
                  className="w-full bg-[#fdfcf7] border border-[#a16207]/5 p-5 rounded-2xl outline-none font-bold text-sm shadow-inner disabled:opacity-40" 
                  required 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#a16207] uppercase ml-1 tracking-[0.2em]">Level</label>
                <select 
                  name="level" 
                  value={form.level} 
                  onChange={handleChange} 
                  disabled={loading || verifying}
                  className="w-full bg-[#fdfcf7] border border-[#a16207]/5 p-5 rounded-2xl outline-none font-black text-[10px] tracking-widest uppercase appearance-none shadow-inner disabled:opacity-40" 
                  required
                >
                  <option value="">Level</option>
                  {[100, 200, 300, 400, 500].map(lvl => <option key={lvl} value={lvl}>{lvl}L</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || verifying}
              className="w-full py-6 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.4em] text-white bg-[#450a0a] transition-all shadow-xl disabled:bg-stone-200 active:scale-95"
            >
              <CreditCard size={18} className="text-[#a16207] mr-3 inline"/> 
              <span>Review & Pay</span>
            </button>
          </form>
        </div>
      </div>

      {/* REVIEW MODAL */}
      {showReview && (
        <div className="fixed inset-0 bg-[#450a0a]/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center mb-8 text-center">
               <div className="p-5 bg-[#fdfcf7] text-[#a16207] rounded-full mb-4 shadow-inner border border-[#a16207]/5"><ShieldCheck size={36}/></div>
               <h3 className="text-xl font-black text-[#450a0a] uppercase italic tracking-tighter">Confirm Details</h3>
               <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em] mt-2">Double check your credentials</p>
            </div>
            
            <div className="space-y-4 mb-10 bg-[#fdfcf7] p-8 rounded-[2rem] border border-[#a16207]/5 shadow-inner text-sm">
              <div className="border-b border-[#a16207]/5 pb-2">
                <span className="text-[8px] font-black uppercase text-[#a16207] tracking-widest block">Institutional Email</span>
                <strong className="text-[#450a0a]">{form.email}</strong>
              </div>
              <div className="border-b border-[#a16207]/5 pb-2">
                <span className="text-[8px] font-black uppercase text-[#a16207] tracking-widest block">Matric Number</span>
                <strong className="text-[#450a0a]">{form.matricNo}</strong>
              </div>
              <div>
                <span className="text-[8px] font-black uppercase text-[#a16207] tracking-widest block">Department</span>
                <strong className="text-[#450a0a] uppercase text-xs">{form.department}</strong>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowReview(false)} className="flex-1 py-5 text-[#a16207] font-black text-[10px] tracking-widest uppercase border border-[#a16207]/20 rounded-2xl hover:bg-[#fdfcf7] transition-all">Edit</button>
              <button onClick={confirmAndPay} className="flex-1 py-5 bg-[#450a0a] text-white font-black text-[10px] tracking-widest uppercase rounded-2xl shadow-xl active:scale-95 transition-all">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { ShieldCheck, AlertCircle, ArrowLeft, CreditCard, Loader2, Landmark, FileCheck, Mail } from "lucide-react";

// export default function Checkout() {
//   const { manualId } = useParams();
//   const navigate = useNavigate();

//   const [manual, setManual] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [verifying, setVerifying] = useState(false); 
//   const [showReview, setShowReview] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const [form, setForm] = useState({
//     fullName: "",
//     email: "",
//     matricNo: "",
//     department: "",
//     level: ""
//   });

//   const departments = [
//     "Agricultural Economics",
//     "Agricultural Extension and Rural Development",
//     "Animal Nutrition and Biotechnology",
//     "Animal Production and Health",
//     "Crop and Environmental Protection",
//     "Crop Production and Soil Science"
//   ];

//   useEffect(() => {
//     const fetchManual = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/manuals");
//         const selected = res.data.find((m) => m.id === Number(manualId));
//         if (!selected) {
//           setErrorMessage("Manual not found");
//           return;
//         }
//         setManual(selected);
//       } catch (err) {
//         setErrorMessage("Failed to load manual");
//       }
//     };
//     fetchManual();
//   }, [manualId]);

//   const handleChange = (e) => {
//     setErrorMessage("");
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setShowReview(true); 
//   };

//   const confirmAndPay = async () => {
//     setShowReview(false);
//     setLoading(true); 

//     try {
//       const levelNumber = parseInt(form.level, 10);
//       const payload = { ...form, level: levelNumber, manualId: Number(manualId) };

//       const res = await axios.post("http://localhost:5000/api/purchases/initialize", payload);
//       const backendRef = res.data.purchase.transactionRef;
//       const pKey = (import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "").trim();
      
//       const paystackArgs = {
//         key: pKey,           
//         email: form.email.trim(),
//         amount: Math.round(Number(manual.price) * 100),
//         reference: backendRef, 
//         callback: (response) => {
//           setVerifying(true); 
//           handleVerification(response, backendRef);
//         },
//         onClose: () => {
//           if (!verifying) {
//             setLoading(false);
//             setErrorMessage("Transaction cancelled.");
//           }
//         },
//       };

//       const handler = window.PaystackPop.setup(paystackArgs);
//       handler.openIframe();

//     } catch (err) {
//       setErrorMessage(err.response?.data?.error || "Connection error");
//       setLoading(false);
//     }
//   };

//   const handleVerification = async (paystackResponse, internalRef) => {
//     try {
//       await axios.post("http://localhost:5000/api/purchases/verify", {
//         reference: paystackResponse.reference,
//         internalRef: internalRef 
//       });

//       navigate("/Receipt", { 
//         state: { matricNo: form.matricNo, reference: paystackResponse.reference } 
//       });
//     } catch (err) {
//       setErrorMessage("Payment confirmed but receipt failed. Contact Admin.");
//       setLoading(false);
//       setVerifying(false);
//     }
//   };

//   if (!manual) return (
//     <div className="min-h-screen flex items-center justify-center bg-[#fdfcf7]">
//       <Loader2 className="animate-spin text-[#a16207]" size={30} />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#fdfcf7] py-12 px-4 relative">
      
//       {/* PROCESSING OVERLAY */}
//       {(loading || verifying) && (
//         <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center space-y-6">
//           <div className="relative">
//             <div className="w-24 h-24 border-4 border-[#a16207]/10 border-t-[#450a0a] rounded-full animate-spin"></div>
//             {verifying ? (
//               <FileCheck className="absolute inset-0 m-auto text-green-600 animate-bounce" size={32} />
//             ) : (
//               <ShieldCheck className="absolute inset-0 m-auto text-[#a16207]" size={32} />
//             )}
//           </div>
//           <div className="text-center">
//             <h2 className="font-black text-[#450a0a] uppercase italic tracking-tighter text-xl">
//               {verifying ? "Generating Receipt" : "Securing Transaction"}
//             </h2>
//             <p className="text-[10px] text-[#a16207] font-black uppercase tracking-[0.4em] mt-2">
//               Please do not refresh the page
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="max-w-xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-[#a16207]/5 overflow-hidden">
//         <div className="bg-[#450a0a] p-10 text-center text-white relative">
//           <button onClick={() => navigate(-1)} className="absolute left-8 top-10 text-white/30 hover:text-white transition">
//             <ArrowLeft size={20}/>
//           </button>
//           <h1 className="text-2xl font-black italic tracking-tighter uppercase">Manual Allocation</h1>
//         </div>

//         <div className="p-10 space-y-8">
//           {/* Price Card */}
//           <div className="bg-[#fdfcf7] p-6 rounded-[2rem] border border-[#a16207]/10 flex justify-between items-center shadow-inner">
//             <div className="flex items-center space-x-4">
//                <div className="p-3 bg-white rounded-2xl shadow-sm text-[#a16207] border border-[#a16207]/5"><Landmark size={20}/></div>
//                <div>
//                   <h2 className="font-black text-[#450a0a] uppercase text-xs tracking-tight">{manual.title}</h2>
//                </div>
//             </div>
//             <div className="text-2xl font-black text-[#a16207]">₦{manual.price.toLocaleString()}</div>
//           </div>

//           {errorMessage && (
//             <div className="p-5 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center space-x-3">
//               <AlertCircle size={18} />
//               <p className="text-[10px] font-black uppercase">{errorMessage}</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* FULL NAME */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-black text-[#a16207] uppercase ml-1 tracking-[0.2em]">Full Legal Name</label>
//               <input 
//                 name="fullName" 
//                 value={form.fullName} 
//                 onChange={handleChange} 
//                 disabled={loading || verifying}
//                 className="w-full bg-[#fdfcf7] border border-[#a16207]/5 p-5 rounded-2xl outline-none font-bold text-sm shadow-inner disabled:opacity-40" 
//                 required 
//               />
//             </div>

//             {/* RESTORED EMAIL FIELD */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-black text-[#a16207] uppercase ml-1 tracking-[0.2em]">Institutional Email</label>
//               <div className="relative">
//                 <input 
//                   name="email" 
//                   type="email"
//                   value={form.email} 
//                   onChange={handleChange} 
//                   disabled={loading || verifying}
//                   className="w-full bg-[#fdfcf7] border border-[#a16207]/5 p-5 pr-12 rounded-2xl outline-none font-bold text-sm shadow-inner disabled:opacity-40" 
//                   placeholder="student@lautech.edu.ng"
//                   required 
//                 />
//                 <Mail className="absolute right-5 top-5 text-[#a16207]/30" size={18} />
//               </div>
//             </div>

//             {/* DEPARTMENT */}
//             <div className="space-y-1.5">
//               <label className="text-[10px] font-black text-[#a16207] uppercase ml-1 tracking-[0.2em]">Academic Department</label>
//               <select 
//                 name="department" 
//                 value={form.department} 
//                 onChange={handleChange} 
//                 disabled={loading || verifying}
//                 className="w-full bg-[#fdfcf7] border border-[#a16207]/5 p-5 rounded-2xl outline-none font-black text-[10px] tracking-widest uppercase appearance-none shadow-inner disabled:opacity-40" 
//                 required
//               >
//                 <option value="">Select Department</option>
//                 {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
//               </select>
//             </div>

//             <div className="grid grid-cols-2 gap-5">
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-[#a16207] uppercase ml-1 tracking-[0.2em]">Matric No.</label>
//                 <input 
//                   name="matricNo" 
//                   value={form.matricNo} 
//                   onChange={handleChange} 
//                   disabled={loading || verifying}
//                   className="w-full bg-[#fdfcf7] border border-[#a16207]/5 p-5 rounded-2xl outline-none font-bold text-sm shadow-inner disabled:opacity-40" 
//                   required 
//                 />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-[10px] font-black text-[#a16207] uppercase ml-1 tracking-[0.2em]">Level</label>
//                 <select 
//                   name="level" 
//                   value={form.level} 
//                   onChange={handleChange} 
//                   disabled={loading || verifying}
//                   className="w-full bg-[#fdfcf7] border border-[#a16207]/5 p-5 rounded-2xl outline-none font-black text-[10px] tracking-widest uppercase appearance-none shadow-inner disabled:opacity-40" 
//                   required
//                 >
//                   <option value="">Level</option>
//                   {[100, 200, 300, 400, 500].map(lvl => <option key={lvl} value={lvl}>{lvl}L</option>)}
//                 </select>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading || verifying}
//               className="w-full py-6 rounded-[1.8rem] font-black text-[11px] uppercase tracking-[0.4em] text-white bg-[#450a0a] transition-all shadow-xl disabled:bg-stone-200"
//             >
//               <CreditCard size={18} className="text-[#a16207] mr-3 inline"/> 
//               <span>Initialize Payment</span>
//             </button>
//           </form>
//         </div>
//       </div>

//       {/* REVIEW MODAL */}
// {showReview && (
//   <div className="fixed inset-0 bg-[#450a0a]/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
//     <div className="bg-white w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
      
//       {/* Modal Header */}
//       <div className="flex flex-col items-center mb-8 text-center">
//          <div className="p-5 bg-[#fdfcf7] text-[#a16207] rounded-full mb-4 shadow-inner border border-[#a16207]/5">
//            <ShieldCheck size={36}/>
//          </div>
//          <h3 className="text-xl font-black text-[#450a0a] uppercase italic tracking-tighter">Verify Credentials</h3>
//          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em] mt-2">Check details before final submission</p>
//       </div>
      
//       {/* Details List */}
//       <div className="space-y-4 mb-10 bg-[#fdfcf7] p-8 rounded-[2rem] border border-[#a16207]/5 shadow-inner">
//         <div className="flex flex-col space-y-1 border-b border-[#a16207]/5 pb-3">
//           <span className="text-[8px] font-black uppercase text-[#a16207] tracking-widest">Full Name</span>
//           <span className="text-[10px] font-black text-[#450a0a] uppercase">{form.fullName}</span>
//         </div>

//         <div className="flex flex-col space-y-1 border-b border-[#a16207]/5 pb-3">
//           <span className="text-[8px] font-black uppercase text-[#a16207] tracking-widest">Institutional Email</span>
//           <span className="text-[10px] font-black text-[#450a0a]">{form.email}</span>
//         </div>

//         <div className="flex flex-col space-y-1 border-b border-[#a16207]/5 pb-3">
//           <span className="text-[8px] font-black uppercase text-[#a16207] tracking-widest">Department</span>
//           <span className="text-[10px] font-black text-[#450a0a] uppercase">{form.department}</span>
//         </div>

//         <div className="flex justify-between">
//           <div className="flex flex-col">
//             <span className="text-[8px] font-black uppercase text-[#a16207] tracking-widest">Matric No.</span>
//             <span className="text-[11px] font-black text-[#450a0a]">{form.matricNo}</span>
//           </div>
//           <div className="flex flex-col text-right">
//             <span className="text-[8px] font-black uppercase text-[#a16207] tracking-widest">Level</span>
//             <span className="text-[11px] font-black text-[#450a0a]">{form.level}L</span>
//           </div>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex gap-4">
//         <button 
//           onClick={() => setShowReview(false)} 
//           className="flex-1 py-5 text-[#a16207] font-black text-[10px] tracking-widest uppercase border border-[#a16207]/20 rounded-2xl hover:bg-[#fdfcf7] transition-all"
//         >
//           Edit
//         </button>
//         <button 
//           onClick={confirmAndPay} 
//           className="flex-1 py-5 bg-[#450a0a] text-white font-black text-[10px] tracking-widest uppercase rounded-2xl shadow-xl active:scale-95 transition-all"
//         >
//           Proceed
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// }