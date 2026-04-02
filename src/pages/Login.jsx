import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Loader2, BookOpen, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      
      // 1. Destructure data from the response
      const { token, user } = res.data;

      // 2. Save credentials to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userName", user.name);
      // Optional: Save the whole user object for easy access later
      localStorage.setItem("user", JSON.stringify(user));

      // 3. ROLE-BASED REDIRECTION
      if (user.role === "staff") {
        // Direct staff ONLY to the scanner page
        navigate("/scanner"); 
      } else if (user.role === "admin" || user.role === "super_admin") {
        // Direct admins to the main dashboard
        navigate("/dashboard");
      } else {
        // Default for students/others
        navigate("/manuals");
      }

    } catch (err) {
      // Using a more professional error display than alert
      const errorMsg = err.response?.data?.message || "Invalid credentials";
      alert(errorMsg); 
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col font-sans">
      
      {/* --- LAUTECH BRANDED HEADER --- */}
      <nav className="w-full p-6 flex justify-between items-center bg-white border-b-4 border-[#D4AF37] sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#4D0000] rounded-xl flex items-center justify-center text-[#D4AF37] shadow-lg">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-[#4D0000] leading-none uppercase">LAUTECH APH</h1>
            <p className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-widest mt-1">Manual Inventory System</p>
          </div>
        </div>
        <div className="hidden md:block">
          <span className="text-[10px] font-black text-[#4D0000]/40 uppercase tracking-[0.2em]">Excellence, Integrity and Service</span>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        
        {/* LAUTECH Themed Decorative Blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#4D0000]/5 rounded-full blur-[100px] -z-10" />

        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(77,0,0,0.08)] border border-[#D4AF37]/20 p-8 md:p-10 relative">
            
            {/* Gold Accent Bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1.5 bg-[#D4AF37] rounded-b-full" />

            <div className="mb-8 text-center pt-4">
              <h2 className="text-2xl font-black text-[#4D0000] tracking-tight italic">Staff Portal</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Sign in to authorize session</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#4D0000]/60 uppercase ml-1 tracking-widest">University Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                  <input 
                    type="email"
                    className="w-full pl-12 pr-4 py-4 bg-[#FFFDF9] rounded-2xl outline-none border border-transparent focus:border-[#D4AF37]/30 focus:bg-white font-bold text-sm transition-all shadow-inner" 
                    placeholder="e.g. eoguntoke@lautech.edu.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#4D0000]/60 uppercase ml-1 tracking-widest">Portal Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-4 bg-[#FFFDF9] rounded-2xl outline-none border border-transparent focus:border-[#D4AF37]/30 focus:bg-white font-bold text-sm transition-all shadow-inner" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4D0000] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#4D0000] text-[#D4AF37] rounded-2xl py-4.5 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#4D0000]/20 hover:bg-[#330000] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 mt-4 min-h-[56px]"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "LOGIN TO PORTAL"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link 
                to="/forgot-password" 
                className="text-[9px] font-black text-gray-300 hover:text-[#4D0000] uppercase tracking-widest transition-colors underline decoration-[#D4AF37] underline-offset-4"
              >
                Technical Support & Password Recovery
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="p-8 text-center bg-white border-t border-gray-100">
        <p className="text-[10px] font-bold text-[#4D0000]/50 uppercase tracking-[0.3em]">
          Ladoke Akintola University of Technology &copy; 2026
        </p>
      </footer>
    </div>
  );
}