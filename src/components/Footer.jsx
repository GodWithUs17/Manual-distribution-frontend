import lautechLogo from "../assets/lauuuu.avif";
export default function Footer() {
  return (
    <footer className="bg-lautech-navy text-lautech-cream py-16 mt-auto border-t border-lautech-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src={lautechLogo} alt="LAUTECH" className="h-10 w-auto opacity-90 brightness-0 invert" />
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
          <div>
            <h4 className="font-serif font-bold mb-6 text-lautech-gold uppercase tracking-wider text-sm">
              Student Support
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-lautech-cream/70">
                Having trouble with your order?
              </p>
              <p className="text-sm text-white font-medium">
                support@aph.lautech.edu.ng
              </p>
              <p className="text-sm text-lautech-cream/70 mt-4">
                Office Hours: Mon-Fri, 8am - 4pm
              </p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-center text-xs text-lautech-cream/40">
          &copy; {new Date().getFullYear()} Ladoke Akintola University of
          Technology. All rights reserved.
        </div>
      </footer>
    );
}