// import { useNavigate, useLocation } from "react-router-dom";
// import { Search } from "lucide-react";
// import lautechLogo from "../assets/lauuuu.avif";
// import aphLogo from "../assets/aph logo.jpg";




// interface HeaderProps {
//   searchQuery: string;
//   setSearchQuery: (value: string) => void;
// }

// export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   return (
//     <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-lautech-creamDark shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex flex-col md:flex-row items-center justify-between py-4 md:h-20 gap-4">

//           {/* Logo */}
//           <div className="flex items-center gap-3 cursor-pointer w-full md:w-auto" onClick={() => navigate("/")}>
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 <img src={lautechLogo} alt="LAUTECH Logo" className="h-10 md:h-12 w-auto object-contain" />
//                 <div className="h-10 w-px bg-gray-300 mx-1 "></div>
//                 <img src={aphLogo} alt="APH Department Logo" className="h-8 w-8 md:h-10 md:w-10 object-contain rounded-full border border-lautech-green hidden sm:block" />
//               </div>

//               <div className="block">
//                 <h1 className="text-sm md:text-lg font-serif font-bold text-lautech-navy leading-tight">
//                   LAUTECH
//                 </h1>
//                 <p className="text-[10px] md:text-xs text-lautech-green font-bold tracking-wide uppercase">
//                   Animal Production and Health
//                 </p>
//               </div>
//           </div>



//             {/* Center: Search */}
//             {(location.pathname === "/" || location.pathname.includes("/manuals")) &&
//             <div className="relative max-w-md w-full mx-8">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input 
//                 type="text" 
//                 placeholder="Search by course code or title (e.g., AGE 301)..." 
//                 className="w-full pl-10 pr-4 py-2.5 bg-lautech-cream border border-lautech-creamDark rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-lautech-gold/50 focus:border-lautech-gold transition-all" 
//                 value={searchQuery} 
//                 onChange={e => setSearchQuery(e.target.value)} />
//               </div>}

        




//           {/* Right */}
//           <div className="hidden">
//             <button
//               onClick={() => navigate("/manuals")}
//               className="text-sm px-4 py-2 border rounded"
//             >
//               Manuals
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );

  
// }


import { useNavigate, useLocation } from "react-router-dom";
import { Search, FileText } from "lucide-react"; // Added FileText icon
import lautechLogo from "../assets/lauuuu.avif";
import aphLogo from "../assets/aph logo.jpg";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onOpenReceipt: () => void; // 👈 NEW: Add this to props
}

export default function Header({ searchQuery, setSearchQuery, onOpenReceipt }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-lautech-creamDark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 md:h-20 gap-4">

          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer w-full md:w-auto" onClick={() => navigate("/")}>
            <div className="flex items-center gap-2 flex-shrink-0">
              <img src={lautechLogo} alt="LAUTECH Logo" className="h-10 md:h-12 w-auto object-contain" />
              <div className="h-10 w-px bg-gray-300 mx-1 "></div>
              <img src={aphLogo} alt="APH Department Logo" className="h-8 w-8 md:h-10 md:w-10 object-contain rounded-full border border-lautech-green hidden sm:block" />
            </div>

            <div className="block">
              <h1 className="text-sm md:text-lg font-serif font-bold text-lautech-navy leading-tight">
                LAUTECH
              </h1>
              <p className="text-[10px] md:text-xs text-lautech-green font-bold tracking-wide uppercase">
                Animal Production and Health
              </p>
            </div>
          </div>

          {/* Center: Search */}
          {(location.pathname === "/" || location.pathname.includes("/manuals")) &&
            <div className="relative max-w-md w-full mx-4 md:mx-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search manuals..." 
                className="w-full pl-10 pr-4 py-2 bg-lautech-cream border border-lautech-creamDark rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-lautech-gold/50 transition-all" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
              />
            </div>
          }

          {/* Right Section: The Button */}
          <div className="flex items-center">
            <button
              onClick={onOpenReceipt} // 👈 Use the prop here
              className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-lautech-navy border-2 border-lautech-navy px-3 md:px-5 py-2 rounded-full hover:bg-lautech-navy hover:text-white transition-all duration-300 uppercase tracking-tighter"
            >
              <FileText className="h-3 w-3 md:h-4 md:w-4" />
              <span>Get Receipt</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
} 