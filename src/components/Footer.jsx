import lautechLogo from "../assets/lauuuu.avif";
import { MessageCircle } from "lucide-react"; // Assuming you use lucide-react

export default function Footer() {
  return (
    <footer className="bg-lautech-navy text-lautech-cream py-16 mt-auto border-t border-lautech-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-12">
        
        {/* --- BRAND SECTION --- */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img src={lautechLogo} alt="LAUTECH" className="h-10 w-auto opacity-90" />
            <div className="h-8 w-px bg-lautech-gold/30"></div>
            <span className="font-serif font-bold text-lg text-white">
              APH Department
            </span>
          </div>
          <p className="text-sm text-lautech-cream/70 leading-relaxed max-w-xs">
            The official manual distribution portal for the Department of
            Animal Production and Health, Ladoke Akintola University of
            Technology.
          </p>
        </div>

        {/* --- COLLECTION POINTS --- */}
        <div>
          <h4 className="font-serif font-bold mb-6 text-lautech-gold uppercase tracking-wider text-sm">
            Collection Points
          </h4>
          <ul className="space-y-3 text-sm text-lautech-cream/70">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lautech-gold mt-1.5"></span>
              APH Department Secretariat
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lautech-gold mt-1.5"></span>
              Faculty of Agriculture Complex
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-lautech-gold mt-1.5"></span>
              LAUTECH Farm Office
            </li>
          </ul>
        </div>

        {/* --- STUDENT SUPPORT (UPDATED) --- */}
        <div>
          <h4 className="font-serif font-bold mb-6 text-lautech-gold uppercase tracking-wider text-sm">
            Student Support
          </h4>
          <div className="space-y-4">
            <p className="text-sm text-lautech-cream/70">
              Having trouble with your order? Reach out to us directly.
            </p>
            
            {/* WHATSAPP BUTTON */}
            <a 
              href="https://wa.me/2349022266417?text=Hello%20APH%20Support,%20I%20have%20a%20question%20about%20my%20manual%20purchase."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-lautech-gold/10 hover:bg-lautech-gold/20 text-lautech-gold border border-lautech-gold/30 px-4 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <MessageCircle size={16} />
              Message Student Support
            </a>

            <div className="pt-2">
              <p className="text-[11px] uppercase text-lautech-gold/80 font-bold tracking-widest mb-1">Email Address</p>
              <p className="text-sm text-white font-medium">
                support@aph.lautech.edu.ng
              </p>
            </div>
            
            <p className="text-[12px] text-lautech-cream/70 italic">
              Office Hours: Mon-Fri, 8am - 4pm
            </p>
          </div>
        </div>
      </div>

      {/* --- COPYRIGHT --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-center text-xs text-lautech-cream/40">
        &copy; {new Date().getFullYear()} Ladoke Akintola University of
        Technology. All rights reserved.
      </div>
    </footer>
  );
}