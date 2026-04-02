import { useState } from "react";
import { Mail, ArrowLeft, Loader2, ShieldQuestion, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Hits your router.post('/forgot-password', forgotPassword)
      await API.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || "User not found with that email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col font-sans">
      
      {/* --- LAUTECH HEADER --- */}
      <nav className="w-full p-6 flex justify-between items-center bg-white border-b-4 border-[#D4AF37] sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#4D0000] rounded-xl flex items-center justify-center text-[#D4AF37] shadow-lg">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-[#4D0000] leading-none uppercase">LAUTECH APH</h1>
            <p className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest mt-1">Recovery Service</p>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(77,0,0,0.08)] border border-[#D4AF37]/20 p-8 md:p-10 relative overflow-hidden">
            
            {/* Gold Accent */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#D4AF37]" />

            {!submitted ? (
              <>
                <div className="mb-8 text-center pt-4">
                  <div className="w-16 h-16 bg-[#FDF8E8] rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldQuestion className="text-[#D4AF37]" size={32} />
                  </div>
                  <h2 className="text-2xl font-black text-[#4D0000] tracking-tight">Recover Access</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                    Enter your official email to reset
                  </p>
                </div>

                <form onSubmit={handleResetRequest} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-[#4D0000]/60 uppercase ml-1 tracking-widest">
                      University Email
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                      <input 
                        type="email"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-[#FFFDF9] rounded-2xl outline-none border border-transparent focus:border-[#D4AF37]/30 focus:bg-white font-bold text-sm transition-all shadow-inner" 
                        placeholder="e.g. name@lautech.edu.ng"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#4D0000] text-[#D4AF37] rounded-2xl py-4.5 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#4D0000]/20 hover:bg-[#330000] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 min-h-[56px]"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : "SEND RECOVERY LINK"}
                  </button>
                </form>
              </>
            ) : (
              /* --- SUCCESS STATE --- */
              <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail size={40} />
                </div>
                <h2 className="text-xl font-black text-[#4D0000]">Check Your Inbox</h2>
                <p className="text-sm font-bold text-gray-500 mt-3 leading-relaxed">
                  We've sent a recovery key to <br/>
                  <span className="text-[#4D0000]">{email}</span>
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-[10px] font-black text-[#D4AF37] uppercase tracking-widest hover:text-[#4D0000] transition-colors"
                >
                  Didn't receive it? Try again
                </button>
              </div>
            )}

            {/* Back to Login Link */}
            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <button 
                onClick={() => navigate("/login")}
                className="flex items-center justify-center gap-2 mx-auto text-[10px] font-black text-[#4D0000]/40 hover:text-[#4D0000] uppercase tracking-widest transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Return to Login</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="p-8 text-center bg-white border-t border-gray-100 mt-auto">
        <p className="text-[10px] font-bold text-[#4D0000]/50 uppercase tracking-[0.3em]">
          LAUTECH IT DEPT &copy; 2026
        </p>
      </footer>
    </div>
  );
}