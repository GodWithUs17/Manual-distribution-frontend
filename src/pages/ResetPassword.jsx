import { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, Loader2, GraduationCap, ShieldAlert } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";

export default function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      // Hits your router.post('/reset-password', resetPassword)
      await API.post("/auth/reset-password", { 
        token, 
        newPassword: password 
      });
      setSuccess(true);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Token expired or invalid. Please request a new link.");
    } finally {
      setLoading(false);
    }
  };

  // If there's no token in the URL, show an error state
  if (!token) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-red-100 text-center max-w-sm">
          <ShieldAlert className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="font-black text-[#4D0000] text-xl">Invalid Access</h2>
          <p className="text-xs text-gray-400 mt-2 uppercase font-bold tracking-widest">No security token found</p>
          <button onClick={() => navigate("/login")} className="mt-6 text-[#D4AF37] font-black text-[10px] uppercase tracking-widest underline">Return to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col font-sans">
      <nav className="w-full p-6 flex justify-between items-center bg-white border-b-4 border-[#D4AF37] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#4D0000] rounded-xl flex items-center justify-center text-[#D4AF37] shadow-lg">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-[#4D0000] leading-none uppercase">LAUTECH APH</h1>
            <p className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest mt-1">Security Update</p>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(77,0,0,0.08)] border border-[#D4AF37]/20 p-8 md:p-10 relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D4AF37]" />

            {!success ? (
              <>
                <div className="mb-8 text-center pt-4">
                  <h2 className="text-2xl font-black text-[#4D0000] tracking-tight">Set New Password</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Create a strong security key</p>
                </div>

                <form onSubmit={handleReset} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#4D0000]/60 uppercase ml-1 tracking-widest">New Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37]" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-12 pr-12 py-4 bg-[#FFFDF9] rounded-2xl outline-none border border-transparent focus:border-[#D4AF37]/30 focus:bg-white font-bold text-sm transition-all" 
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#4D0000]/60 uppercase ml-1 tracking-widest">Confirm Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37]" size={18} />
                      <input 
                        type={showPassword ? "text" : "password"}
                        className="w-full pl-12 pr-4 py-4 bg-[#FFFDF9] rounded-2xl outline-none border border-transparent focus:border-[#D4AF37]/30 focus:bg-white font-bold text-sm transition-all" 
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#4D0000] text-[#D4AF37] rounded-2xl py-4.5 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#4D0000]/20 hover:bg-[#330000] transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-4 min-h-[56px]"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : "UPDATE SECURITY KEY"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-xl font-black text-[#4D0000]">Update Successful</h2>
                <p className="text-xs font-bold text-gray-500 mt-3 tracking-widest uppercase">Redirecting to Login...</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <footer className="p-8 text-center bg-white border-t border-gray-100 mt-auto">
        <p className="text-[10px] font-bold text-[#4D0000]/50 uppercase tracking-[0.3em]">LAUTECH PORTAL SECURITY &copy; 2026</p>
      </footer>
    </div>
  );
}