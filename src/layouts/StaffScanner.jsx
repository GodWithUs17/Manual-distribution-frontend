// import { useEffect, useState, useRef } from "react";
// import toast from 'react-hot-toast';
// import { Html5QrcodeScanner } from "html5-qrcode";
// import { CheckCircle, XCircle, Loader2, WifiOff, User, Book, Search, History, LogOut, Volume2, TrendingUp, Trash2 } from "lucide-react";
// import axios from "axios";

// // --- AUDIO UTILITY ---
// const playSuccessSound = () => {
//   try {
//     const AudioContext = window.AudioContext || window.webkitAudioContext;
//     const context = new AudioContext();
//     const oscillator = context.createOscillator();
//     const gainNode = context.createGain();

//     oscillator.type = "sine";
//     oscillator.frequency.setValueAtTime(880, context.currentTime); 
//     gainNode.gain.setValueAtTime(0.1, context.currentTime);
//     gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);

//     oscillator.connect(gainNode);
//     gainNode.connect(context.destination);

//     oscillator.start();
//     oscillator.stop(context.currentTime + 0.2);

//     if (navigator.vibrate) navigator.vibrate(100);
//   } catch (e) {
//     console.log("Feedback error:", e);
//   }
// };

// export default function StaffScanner() {
//   const [scanResult, setScanResult] = useState(null);
//   const [studentData, setStudentData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [isOnline, setIsOnline] = useState(navigator.onLine);
//   const [manualInput, setManualInput] = useState("");
//   const [scanHistory, setScanHistory] = useState([]);
//   const [sessionCount, setSessionCount] = useState(0); 
//   const [isScanning, setIsScanning] = useState(true);

//   const isProcessing = useRef(false); 
//   const API_BASE_URL = "http://localhost:5000/api/purchases";

//   // 1. Fetch History from Backend on Load
//   useEffect(() => {
//     const fetchHistory = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const res = await axios.get(`${API_BASE_URL}/staff-history`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         const formattedHistory = res.data.map(item => ({
//           name: item.fullName,
//           manual: item.manual?.title || "Manual",
//           time: new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//         }));

//         setScanHistory(formattedHistory);
//         setSessionCount(formattedHistory.length);
//       } catch (err) {
//         console.error("Could not load history", err);
//       }
//     };

//     fetchHistory();
//   }, []);

//   // 2. Internet Monitor
//   useEffect(() => {
//     const handleStatus = () => setIsOnline(navigator.onLine);
//     window.addEventListener('online', handleStatus);
//     window.addEventListener('offline', handleStatus);
//     return () => {
//       window.removeEventListener('online', handleStatus);
//       window.removeEventListener('offline', handleStatus);
//     };
//   }, []);

//   // 3. Welcome Toast
//   useEffect(() => {
//     const staffName = localStorage.getItem("userName") || "Staff Member";
//     toast.success(`Welcome back, ${staffName}!`, {
//       duration: 4000,
//       icon: '🔐',
//       style: { borderRadius: '1.5rem', background: '#001f3f', color: '#FFD700', fontWeight: 'bold', border: '2px solid #FFD700' },
//     });
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     window.location.href = "/login";
//   };

//   // --- NEW: CLEAR HISTORY HANDLER ---
//   const clearDisplayHistory = () => {
//     if (window.confirm("Clear these records from your screen? (Database records will remain safe)")) {
//       setScanHistory([]);
//       setSessionCount(0);
//       toast.success("Display History Cleared");
//     }
//   };

//   // 4. Scanner Logic
//   useEffect(() => {
//     if (!isScanning) return;
//     isProcessing.current = false;
//     const scanner = new Html5QrcodeScanner("reader", {
//       fps: 10,
//       qrbox: { width: 250, height: 250 },
//       aspectRatio: 1.0,
//       rememberLastUsedCamera: true,
//     });

//     scanner.render(async (token) => {
//       if (token && token !== "undefined" && !isProcessing.current) {
//         isProcessing.current = true; 
//         try {
//           setIsScanning(false); 
//           await scanner.clear(); 
//           handleInitialVerify(token);
//         } catch (err) {
//           handleInitialVerify(token);
//         }
//       }
//     });

//     return () => { scanner.clear().catch(() => {}); };
//   }, [isScanning]);

//   const handleInitialVerify = async (token) => {
//     if (!token || token === "undefined" || typeof token !== "string") {
//       isProcessing.current = false;
//       return;
//     }
//     const cleanToken = token.split('/').pop().trim();
//     setLoading(true);
//     setError(null);
//     setScanResult(cleanToken);

//     try {
//       const res = await axios.get(`${API_BASE_URL}/verify/${cleanToken}`);
//       if (res.data.status === 'VALID' || res.data.purchase) {
//         setStudentData(res.data.purchase);
//         playSuccessSound();
//       } else {
//         setError("Record not found.");
//         isProcessing.current = false;
//       }
//     } catch (err) {
//       setError(err.response?.data?.error || "Server connection failed");
//       isProcessing.current = false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmCollection = async () => {
//     setLoading(true);
//     const token = localStorage.getItem('token'); 

//     try {
//       await axios.post(
//         `${API_BASE_URL}/collect`, 
//         { reference: scanResult }, 
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
      
//       const newEntry = {
//         name: studentData.fullName,
//         manual: studentData.manual?.title || "Manual",
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       };
      
//       setScanHistory(prev => [newEntry, ...prev].slice(0, 10)); 
//       setSessionCount(prev => prev + 1);
//       setSuccess(true);
//       setError(null);

//       playSuccessSound();
//       toast.success(`Manual Issued Successfully!`, { style: { borderRadius: '1rem', fontWeight: 'bold' } });

//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to update database.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const reset = () => {
//     isProcessing.current = false;
//     setScanResult(null);
//     setStudentData(null);
//     setError(null);
//     setSuccess(false);
//     setManualInput("");
//     setIsScanning(true);
//   };

//   return (
//     <div className="min-h-screen bg-[#001f3f] p-4 flex flex-col items-center font-sans">
//       <style>{`
//         #reader video { width: 100% !important; object-fit: cover !important; border-radius: 1.5rem; }
//         #reader { border: none !important; }
//         #reader__dashboard_section_csr button { background: #001f3f !important; color: white !important; border-radius: 8px !important; padding: 10px !important; }
//       `}</style>

//       {/* HEADER */}
//       <div className="w-full max-w-md flex justify-between items-center mb-6">
//         <div className="flex flex-col">
//             <h1 className="text-[#FFD700] font-black text-2xl tracking-tighter uppercase leading-none">LAUTECH VERIFIER</h1>
//             <span className="text-[8px] text-blue-300 font-bold uppercase tracking-[0.3em] mt-1">Cloud Sync Active</span>
//         </div>
//         <button onClick={handleLogout} className="bg-red-500/10 text-red-400 p-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-red-500/20">
//           <LogOut size={16} /> Logout
//         </button>
//       </div>

//       {/* SESSION STATS CARD */}
//       <div className="w-full max-w-md bg-gradient-to-r from-[#FFD700] to-[#daa520] p-[1px] rounded-3xl mb-6 shadow-xl">
//         <div className="bg-[#001f3f] rounded-[calc(1.5rem-1px)] p-4 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//                 <div className="bg-[#FFD700]/10 p-2 rounded-lg"><TrendingUp size={20} className="text-[#FFD700]" /></div>
//                 <p className="text-white font-bold text-sm tracking-tight">Today's Collections</p>
//             </div>
//             <span className="text-2xl font-black text-[#FFD700]">{sessionCount}</span>
//         </div>
//       </div>

//       <div className="w-full max-w-md bg-white rounded-[2.5rem] p-6 shadow-2xl min-h-[400px] flex flex-col justify-center">
//         {!scanResult && !loading && (
//           <div className="relative mb-6">
//             <input 
//               type="text" 
//               placeholder="Type Reference Manually..." 
//               className="w-full bg-gray-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#FFD700]"
//               value={manualInput}
//               onChange={(e) => setManualInput(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleInitialVerify(manualInput)}
//             />
//             <Search className="absolute left-4 top-4 text-gray-400" size={18} />
//           </div>
//         )}

//         {!scanResult && isOnline && isScanning && (
//           <div id="reader" className="overflow-hidden rounded-2xl border-4 border-dashed border-[#FFD700]/20"></div>
//         )}

//         {loading && (
//           <div className="py-10 text-center animate-pulse">
//             <Loader2 className="animate-spin mx-auto text-[#001f3f] mb-4" size={50} />
//             <p className="font-bold text-gray-400 text-xs tracking-widest uppercase">Syncing with server...</p>
//           </div>
//         )}
        
//         {error && !loading && (
//           <div className="text-center py-6">
//             <XCircle className="mx-auto text-red-500 mb-4" size={70} />
//             <h2 className="text-xl font-black text-gray-900 uppercase">DENIED</h2>
//             <p className="text-red-500 font-bold my-4 bg-red-50 p-3 rounded-xl text-sm italic">{error}</p>
//             <button onClick={reset} className="w-full bg-black text-white py-4 rounded-2xl font-black tracking-wider shadow-lg">Try Another</button>
//           </div>
//         )}

//         {success && (
//           <div className="text-center py-6 animate-in zoom-in duration-300">
//             <CheckCircle className="mx-auto text-green-500 mb-4" size={70} />
//             <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">COLLECTED!</h2>
//             <p className="text-gray-500 mb-6 font-bold uppercase text-[10px] tracking-widest">{studentData?.fullName}</p>
//             <button onClick={reset} className="w-full bg-[#001f3f] text-[#FFD700] py-4 rounded-2xl font-black shadow-lg uppercase">SCAN NEXT</button>
//           </div>
//         )}

//         {studentData && !success && !error && !loading && (
//           <div className="animate-in slide-in-from-bottom-4 duration-300">
//              <div className="bg-blue-50 p-6 rounded-3xl mb-6 space-y-4 border border-blue-100">
//                 <div className="flex items-center gap-4">
//                   <div className="bg-[#001f3f] p-2 rounded-lg text-white"><User size={20} /></div>
//                   <div>
//                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Student Name</p>
//                     <p className="font-bold text-gray-800 leading-tight">{studentData.fullName}</p>
//                     <p className="text-[10px] text-gray-500 font-bold">{studentData.matricNo}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="bg-[#FFD700] p-2 rounded-lg text-[#001f3f]"><Book size={20} /></div>
//                   <div>
//                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Manual</p>
//                     <p className="font-bold text-gray-800 leading-tight">{studentData.manual?.title || "Manual"}</p>
//                     <p className="text-[10px] text-gray-500 font-bold italic uppercase">{studentData.department} - {studentData.level}L</p>
//                   </div>
//                 </div>
//              </div>
             
//              <button onClick={confirmCollection} className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-3">
//                 <Volume2 size={20} /> CONFIRM COLLECTION
//              </button>
//              <button onClick={reset} className="w-full mt-4 text-gray-400 text-xs font-black uppercase tracking-widest">Cancel Scan</button>
//           </div>
//         )}
//       </div>

//       {/* PERSISTENT HISTORY */}
//       {scanHistory.length > 0 && (
//         <div className="w-full max-w-md mt-8">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2 text-[#FFD700]">
//               <History size={18}/>
//               <h3 className="font-black text-sm uppercase tracking-widest">Recent Activity</h3>
//             </div>
//             {/* NEW CLEAR BUTTON */}
//             <button 
//               onClick={clearDisplayHistory}
//               className="text-[10px] font-black uppercase tracking-tighter text-blue-300/50 hover:text-red-400 transition-colors flex items-center gap-1 p-1"
//             >
//               <Trash2 size={12} /> Clear List
//             </button>
//           </div>
          
//           <div className="space-y-3">
//             {scanHistory.map((item, index) => (
//               <div key={index} className="bg-[#002a54] p-4 rounded-2xl flex justify-between items-center border border-white/10 shadow-lg animate-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 100}ms` }}>
//                 <div>
//                   <p className="text-white font-bold text-sm leading-tight">{item.name}</p>
//                   <p className="text-[#FFD700] text-[10px] font-bold uppercase tracking-wider">{item.manual}</p>
//                 </div>
//                 <p className="text-blue-300 text-[10px] font-bold">{item.time}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {!isOnline && (
//         <div className="mt-8 bg-red-600 text-white px-8 py-3 rounded-full font-black animate-bounce shadow-2xl flex items-center gap-3">
//           <WifiOff size={20}/> SYSTEM OFFLINE
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useState, useRef } from "react";
import toast from 'react-hot-toast';
import { Html5QrcodeScanner } from "html5-qrcode";
import { CheckCircle, XCircle, Loader2, WifiOff, User, Book, Search, History, LogOut, Volume2, TrendingUp, Trash2 } from "lucide-react";
import axios from "axios";
import API from "../api/axios";

// --- AUDIO UTILITY ---
const playSuccessSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, context.currentTime); 
    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
    if (navigator.vibrate) navigator.vibrate(100);
  } catch (e) {
    console.log("Feedback error:", e);
  }
};

export default function StaffScanner() {
  const [scanResult, setScanResult] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [manualInput, setManualInput] = useState("");
  const [scanHistory, setScanHistory] = useState([]);
  const [sessionCount, setSessionCount] = useState(0); 
  const [isScanning, setIsScanning] = useState(true);

  const isProcessing = useRef(false); 
  

  useEffect(() => {
    const fetchHistory = async () => {
      try {

        const res = await API.get("/purchases/staff-history");

        const formattedHistory = res.data.map(item => ({
          name: item.fullName,
          manual: item.manual?.title || "Manual",
          time: new Date(item.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setScanHistory(formattedHistory);
        setSessionCount(formattedHistory.length);
      } catch (err) {
        console.error("Could not load history", err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  useEffect(() => {
    const staffName = localStorage.getItem("userName") || "Staff Member";
    toast.success(`Welcome back, ${staffName}!`, {
      duration: 4000,
      icon: '🔐',
      style: { borderRadius: '1rem', background: '#450a0a', color: '#facc15', fontWeight: 'bold' },
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const clearDisplayHistory = () => {
    if (window.confirm("Clear these records from your screen?")) {
      setScanHistory([]);
      setSessionCount(0);
      toast.success("Display History Cleared");
    }
  };

  useEffect(() => {
    if (!isScanning) return;
    isProcessing.current = false;
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      rememberLastUsedCamera: true,
    });

    scanner.render(async (token) => {
      if (token && token !== "undefined" && !isProcessing.current) {
        isProcessing.current = true; 
        try {
          setIsScanning(false); 
          await scanner.clear(); 
          handleInitialVerify(token);
        } catch (err) {
          handleInitialVerify(token);
        }
      }
    });

    return () => { scanner.clear().catch(() => {}); };
  }, [isScanning]);

  const handleInitialVerify = async (token) => {
    if (!token || token === "undefined" || typeof token !== "string") {
      isProcessing.current = false;
      return;
    }
    const cleanToken = token.split('/').pop().trim();
    setLoading(true);
    setError(null);
    setScanResult(cleanToken);

    try {
      const res = await API.get(`/purchases/verify/${cleanToken}`);
      if (res.data.status === 'VALID' || res.data.purchase) {
        setStudentData(res.data.purchase);
        playSuccessSound();
      } else {
        setError("Record not found.");
        isProcessing.current = false;
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server connection failed");
      isProcessing.current = false;
    } finally {
      setLoading(false);
    }
  };

  const confirmCollection = async () => {
    setLoading(true);
    try {
      await API.post("/purchases/collect", { reference: scanResult });

      const newEntry = {
        name: studentData.fullName,
        manual: studentData.manual?.title || "Manual",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setScanHistory(prev => [newEntry, ...prev].slice(0, 10)); 
      setSessionCount(prev => prev + 1);
      setSuccess(true);
      setError(null);
      playSuccessSound();
      toast.success(`Manual Issued Successfully!`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update database.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    isProcessing.current = false;
    setScanResult(null);
    setStudentData(null);
    setError(null);
    setSuccess(false);
    setManualInput("");
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf7] p-4 flex flex-col items-center font-sans">
      <style>{`
        #reader video { width: 100% !important; object-fit: cover !important; border-radius: 1.5rem; }
        #reader { border: none !important; }
        #reader__dashboard_section_csr button { background: #450a0a !important; color: white !important; border-radius: 8px !important; padding: 8px 12px !important; font-size: 12px !important; }
      `}</style>

      {/* HEADER */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <div className="flex flex-col">
            <h1 className="text-[#450a0a] font-black text-xl tracking-tighter uppercase leading-none">LAUTECH APH</h1>
            <span className="text-[9px] text-[#a16207] font-bold uppercase tracking-[0.2em] mt-1 italic">Inventory Control</span>
        </div>
        <button onClick={handleLogout} className="bg-red-50 text-red-700 p-2 px-3 rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase border border-red-100">
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* STATS CARD - Clean White/Gold */}
      <div className="w-full max-w-md bg-white border border-[#e5e1d3] rounded-2xl p-4 mb-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="bg-[#fefce8] p-2 rounded-lg border border-[#fef08a]"><TrendingUp size={18} className="text-[#a16207]" /></div>
              <p className="text-stone-600 font-bold text-xs uppercase tracking-tight">Today's Registry</p>
          </div>
          <span className="text-xl font-black text-[#450a0a]">{sessionCount}</span>
      </div>

      {/* MAIN SCANNER CONTAINER */}
      <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-xl border border-[#e5e1d3] min-h-[400px] flex flex-col justify-center">
        {!scanResult && !loading && (
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="Enter Reference ID..." 
              className="w-full bg-[#fdfcf7] border border-[#e5e1d3] rounded-xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-[#a16207] text-[#450a0a]"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInitialVerify(manualInput)}
            />
            <Search className="absolute left-4 top-4 text-stone-400" size={18} />
          </div>
        )}

        {!scanResult && isOnline && isScanning && (
          <div id="reader" className="overflow-hidden rounded-2xl border-2 border-stone-100 bg-stone-50"></div>
        )}

        {loading && (
          <div className="py-10 text-center">
            <Loader2 className="animate-spin mx-auto text-[#450a0a] mb-4" size={40} />
            <p className="font-bold text-stone-400 text-[10px] tracking-widest uppercase">Fetching Records...</p>
          </div>
        )}
        
        {error && !loading && (
          <div className="text-center py-6">
            <XCircle className="mx-auto text-red-600 mb-4" size={60} />
            <h2 className="text-lg font-black text-stone-900 uppercase tracking-tight">Access Denied</h2>
            <p className="text-red-600 font-bold my-4 bg-red-50 p-3 rounded-xl text-xs italic border border-red-100">{error}</p>
            <button onClick={reset} className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest">Retry Scan</button>
          </div>
        )}

        {success && (
          <div className="text-center py-6 animate-in zoom-in duration-300">
            <CheckCircle className="mx-auto text-emerald-600 mb-4" size={60} />
            <h2 className="text-xl font-black text-stone-900 tracking-tighter uppercase">AUTHORIZED</h2>
            <p className="text-stone-400 mb-6 font-bold uppercase text-[9px] tracking-widest">{studentData?.fullName}</p>
            <button onClick={reset} className="w-full bg-[#450a0a] text-white py-4 rounded-xl font-bold text-xs shadow-lg uppercase tracking-widest">Scan Next Student</button>
          </div>
        )}

        {studentData && !success && !error && !loading && (
          <div className="animate-in slide-in-from-bottom-4">
             <div className="bg-[#fefce8]/50 p-5 rounded-2xl mb-6 space-y-4 border border-[#fef9c3]">
                <div className="flex items-center gap-4">
                  <div className="bg-[#450a0a] p-2 rounded-lg text-white"><User size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-[#a16207] uppercase tracking-widest">Full Name</p>
                    <p className="font-bold text-stone-800 text-sm uppercase leading-tight">{studentData.fullName}</p>
                    <p className="text-[10px] text-stone-500 font-medium tracking-tight">{studentData.matricNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-t border-amber-200/40 pt-4">
                  <div className="bg-amber-600 p-2 rounded-lg text-white"><Book size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-[#a16207] uppercase tracking-widest">Target Manual</p>
                    <p className="font-bold text-stone-800 text-sm uppercase leading-tight">{studentData.manual?.title || "Manual"}</p>
                    <p className="text-[10px] text-stone-500 font-medium italic">{studentData.department} | {studentData.level}L</p>
                  </div>
                </div>
             </div>
             
             <button onClick={confirmCollection} className="w-full bg-[#450a0a] text-white py-4 rounded-xl font-black text-xs shadow-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.15em]">
                <Volume2 size={18} /> CONFIRM ISSUE
             </button>
             <button onClick={reset} className="w-full mt-4 text-stone-400 text-[10px] font-bold uppercase tracking-widest">Abort Process</button>
          </div>
        )}
      </div>

      {/* REGISTRY HISTORY - Creamy List */}
      {scanHistory.length > 0 && (
        <div className="w-full max-w-md mt-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 text-[#a16207]">
              <History size={14}/>
              <h3 className="font-black text-[9px] uppercase tracking-[0.25em]">Session Log</h3>
            </div>
            <button onClick={clearDisplayHistory} className="text-[9px] font-black uppercase text-stone-400 hover:text-red-500 flex items-center gap-1">
              <Trash2 size={12} /> Clear
            </button>
          </div>
          
          <div className="space-y-2">
            {scanHistory.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-xl flex justify-between items-center border border-[#e5e1d3] shadow-sm">
                <div>
                  <p className="text-stone-800 font-bold text-[11px] uppercase tracking-tight">{item.name}</p>
                  <p className="text-[#a16207] text-[9px] font-bold uppercase truncate max-w-[180px]">{item.manual}</p>
                </div>
                <p className="text-stone-400 text-[9px] font-medium">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isOnline && (
        <div className="fixed bottom-6 bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-2xl flex items-center gap-2 text-[10px] tracking-widest">
          <WifiOff size={14}/> OFFLINE MODE
        </div>
      )}
    </div>
  );
}
