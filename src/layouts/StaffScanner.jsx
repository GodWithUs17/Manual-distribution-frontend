import { useEffect, useState, useRef } from "react";
import toast from 'react-hot-toast';
import { Html5Qrcode } from "html5-qrcode";
import { CheckCircle, XCircle, Loader2, WifiOff, User, Book, Search, History, LogOut, Volume2, TrendingUp, Trash2, Camera, Image as ImageIcon, StopCircle } from "lucide-react";
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
  const qrScannerRef = useRef(null);

  // 1. Fetch History
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

  // 2. Network Status
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  // 3. Scanner Logic
  useEffect(() => {
    if (!isScanning || scanResult) return;
    
    const html5QrCode = new Html5Qrcode("reader");
    qrScannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          (token) => {
            if (token && !isProcessing.current) {
              isProcessing.current = true;
              stopAndVerify(token);
            }
          }
        );
      } catch (err) {
        console.error("Scanner error:", err);
      }
    };

    startScanner();

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(e => console.log("Stop error", e));
      }
    };
  }, [isScanning, scanResult]);

  const stopAndVerify = async (token) => {
    if (qrScannerRef.current?.isScanning) {
      await qrScannerRef.current.stop();
    }
    setIsScanning(false);
    handleInitialVerify(token);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const html5QrCode = new Html5Qrcode("reader");
    setLoading(true);
    try {
      const result = await html5QrCode.scanFile(file, true);
      handleInitialVerify(result);
    } catch (err) {
      toast.error("No valid QR code found in image");
    } finally {
      setLoading(false);
    }
  };

  const handleInitialVerify = async (token) => {
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
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const confirmCollection = async () => {
    setLoading(true);
    try {
      await API.post("/purchases/collect", { reference: scanResult });
      setScanHistory(prev => [{
        name: studentData.fullName,
        manual: studentData.manual?.title || "Manual",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }, ...prev].slice(0, 10));
      setSessionCount(prev => prev + 1);
      setSuccess(true);
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

  return (
    <div className="min-h-screen bg-[#fdfcf7] p-4 flex flex-col items-center font-sans">
      <style>{`
        #reader video { width: 100% !important; object-fit: cover !important; border-radius: 1.5rem; }
        #reader { border: none !important; }
      `}</style>

      {/* HEADER */}
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <h1 className="text-[#450a0a] font-black text-xl tracking-tighter uppercase leading-none">LAUTECH APH</h1>
          <span className="text-[9px] text-[#a16207] font-bold uppercase tracking-[0.2em] mt-1 italic">Inventory Control</span>
        </div>
        <button onClick={handleLogout} className="bg-red-50 text-red-700 p-2 px-3 rounded-xl flex items-center gap-2 text-[10px] font-bold uppercase border border-red-100">
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* STATS CARD */}
      <div className="w-full max-w-md bg-white border border-[#e5e1d3] rounded-2xl p-4 mb-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
              <div className="bg-[#fefce8] p-2 rounded-lg border border-[#fef08a]"><TrendingUp size={18} className="text-[#a16207]" /></div>
              <p className="text-stone-600 font-bold text-xs uppercase tracking-tight">Today's Registry</p>
          </div>
          <span className="text-xl font-black text-[#450a0a]">{sessionCount}</span>
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-md bg-white rounded-[2rem] p-6 shadow-xl border border-[#e5e1d3] min-h-[420px] flex flex-col justify-center">
        
        {/* INPUT BOX */}
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

        {/* SCANNER VIEW */}
        {!scanResult && isScanning && isOnline && (
          <div className="space-y-4">
            <div id="reader" className="overflow-hidden rounded-2xl border-2 border-stone-100 bg-stone-50"></div>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsScanning(false)}
                className="flex items-center justify-center gap-2 bg-stone-100 text-stone-600 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-stone-200"
              >
                <StopCircle size={14} /> Stop
              </button>
              
              <label className="flex items-center justify-center gap-2 bg-[#fefce8] text-[#a16207] py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest border border-[#fef08a] cursor-pointer">
                <ImageIcon size={14} /> Gallery
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        )}

        {/* START CAMERA FALLBACK */}
        {!isScanning && !scanResult && !loading && !success && (
          <div className="text-center space-y-4">
            <div className="bg-stone-50 py-12 rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center">
               <Camera size={40} className="text-stone-300 mb-2" />
               <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Camera is Paused</p>
            </div>
            <button 
              onClick={() => setIsScanning(true)}
              className="w-full bg-[#450a0a] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg"
            >
              Restart Scanner
            </button>
            <label className="block w-full text-center py-2 text-[#a16207] text-[10px] font-bold uppercase tracking-widest cursor-pointer">
               Or Upload Image
               <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        )}

        {/* LOADING STATE */}
        {loading && (
          <div className="py-10 text-center">
            <Loader2 className="animate-spin mx-auto text-[#450a0a] mb-4" size={40} />
            <p className="font-bold text-stone-400 text-[10px] tracking-widest uppercase">Verifying Reference...</p>
          </div>
        )}
        
        {/* ERROR STATE */}
        {error && !loading && (
          <div className="text-center py-6 animate-in fade-in zoom-in">
            <XCircle className="mx-auto text-red-600 mb-4" size={60} />
            <h2 className="text-lg font-black text-stone-900 uppercase tracking-tight">Invalid Record</h2>
            <p className="text-red-600 font-bold my-4 bg-red-50 p-3 rounded-xl text-xs border border-red-100">{error}</p>
            <button onClick={reset} className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest">Try Again</button>
          </div>
        )}

        {/* SUCCESS COLLECTION STATE */}
        {success && (
          <div className="text-center py-6 animate-in zoom-in duration-300">
            <CheckCircle className="mx-auto text-emerald-600 mb-4" size={60} />
            <h2 className="text-xl font-black text-stone-900 tracking-tighter uppercase">AUTHORIZED</h2>
            <p className="text-stone-400 mb-6 font-bold uppercase text-[9px] tracking-widest">{studentData?.fullName}</p>
            <button onClick={reset} className="w-full bg-[#450a0a] text-white py-4 rounded-xl font-bold text-xs shadow-lg uppercase tracking-widest">Next Scan</button>
          </div>
        )}

        {/* STUDENT DATA VERIFICATION VIEW */}
        {studentData && !success && !error && !loading && (
          <div className="animate-in slide-in-from-bottom-4">
             <div className="bg-[#fefce8]/50 p-5 rounded-2xl mb-6 space-y-4 border border-[#fef9c3]">
                <div className="flex items-center gap-4">
                  <div className="bg-[#450a0a] p-2 rounded-lg text-white"><User size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-[#a16207] uppercase tracking-widest">Student</p>
                    <p className="font-bold text-stone-800 text-sm uppercase leading-tight">{studentData.fullName}</p>
                    <p className="text-[10px] text-stone-500 font-medium tracking-tight">{studentData.matricNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 border-t border-amber-200/40 pt-4">
                  <div className="bg-amber-600 p-2 rounded-lg text-white"><Book size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-[#a16207] uppercase tracking-widest">Manual Type</p>
                    <p className="font-bold text-stone-800 text-sm uppercase leading-tight">{studentData.manual?.title || "Manual"}</p>
                  </div>
                </div>
             </div>
             <button onClick={confirmCollection} className="w-full bg-[#450a0a] text-white py-4 rounded-xl font-black text-xs shadow-xl uppercase tracking-[0.15em] flex items-center justify-center gap-3">
                <Volume2 size={18} /> CONFIRM ISSUE
             </button>
             <button onClick={reset} className="w-full mt-4 text-stone-400 text-[10px] font-bold uppercase tracking-widest">Cancel</button>
          </div>
        )}
      </div>

      {/* HISTORY LOG */}
      {scanHistory.length > 0 && (
        <div className="w-full max-w-md mt-8">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 text-[#a16207]">
              <History size={14}/>
              <h3 className="font-black text-[9px] uppercase tracking-[0.25em]">Recent Issues</h3>
            </div>
            <button onClick={clearDisplayHistory} className="text-[9px] font-black uppercase text-stone-400 hover:text-red-500 flex items-center gap-1">
              <Trash2 size={12} /> Clear
            </button>
          </div>
          <div className="space-y-2">
            {scanHistory.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-xl flex justify-between items-center border border-[#e5e1d3] shadow-sm animate-in slide-in-from-right duration-300" style={{ animationDelay: `${index * 50}ms` }}>
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
