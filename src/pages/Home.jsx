import { useEffect, useState } from "react";
import API from "../api/axios";
import Header from "../components/header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [manuals, setManuals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // 1. Fetch from your backend on mount
  useEffect(() => {
    const fetchManuals = async () => {
      try {
        const res = await API.get("/manuals");
        setManuals(res.data);
      } catch (err) {
        setError("Failed to fetch manuals");
      } finally {
        setLoading(false);
      }
    };
    fetchManuals();
  }, []);

  // // 2. Filter logic: Matches title or courseCode
  // const filteredManuals = manuals.filter((manual) =>
  //   manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   manual.courseCode?.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const filteredManuals = manuals.filter((manual) => {
  const matchesSearch = manual.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        manual.courseCode?.toLowerCase().includes(searchQuery.toLowerCase());
  
  // Only return if it matches search AND isActive is true
  return matchesSearch && manual.isActive !== false;
});

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-6 pb-12">
              <div className="inline-block p-2 px-4 bg-lautech-green/5 rounded-full border border-lautech-green/10 mb-2">
                <span className="text-xs font-bold text-lautech-green tracking-wider uppercase">
                  2025/2026 Academic Session
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-lautech-navy leading-tight">
                Academic Manuals & Resources
              </h2>
              <p className="text-lg text-gray-600 font-light leading-relaxed">
                Secure your required Animal Production and Health course
                materials for the upcoming semester. Browse available manuals or
                search by title.
              </p>
            </div>

        {/* 3. Handle Loading and Errors */}
        {loading && <p className="text-center py-10">Loading manuals...</p>}
        {error && <p className="text-center text-red-500 py-10">{error}</p>}

        {/* 4. Display Results */}
        {!loading && !error && (
          <section>
            {filteredManuals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredManuals.map((manual, index) => (
                <div key={manual.id} className="bg-white rounded-xl shadow-lg border border-[#E8D5B5] overflow-hidden flex flex-col group transition-all  hover:shadow-2xl hover:-translate-y-2  duration-300 b">
                  
                  {/* 1. Top Section (Green/Blue Header) with Backend Image */}
                  <div className={`${index % 2 === 0 ? 'bg-[#002147]' : 'bg-emerald-600'} p-6 text-white min-h-[180px] relative flex gap-4`}>
                    
                    {/* The Image from your Backend */}
                    <div className="flex-shrink-0 w-32 h-30 bg-white/20 rounded shadow-md overflow-hidden border border-white/30">
                      <img 
                        src={manual.imageURL || "/placeholder-manual.png"} 
                        alt={manual.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/80 to-transparent opacity-60" />
                          <div className="absolute top-4 right-4 bg-[#FFD700] text-[#001f3f] text-xs font-black px-4 py-2 rounded-full shadow-lg">
                            {manual.courseCode}
                          </div>
                      </div>
            
                    {/* Text next to Image */}
                    <div className="flex flex-col justify-center">
                      <p className="text-[9px] uppercase tracking-widest font-bold opacity-80 mb-2 ">
                        Animal Production & Health
                      </p>
                      <h2 className="text-lg font-bold leading-tight mb-1 line-clamp-2">
                        {manual.title}
                      </h2>
                      <p className="text-xs opacity-90 italic">
                        {manual.author || "Dept. Faculty"}
                      </p>
                    </div>
                    
                    {/* Subtle Background Pattern (Optional to match the "Hexagon" look in your image) */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                  </div>
            
                  {/* 2. Bottom Section (Pricing & Description) */}
                  <div className="p-6 flex flex-col flex-grow bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <span className="bg-gray-100 text-[10px] px-3 py-1 rounded-full font-bold text-gray-600 tracking-wider">
                        MANUAL
                      </span>
                      <span className="text-xl font-bold text-blue-900">
                        ₦{Number(manual.price).toLocaleString()}
                      </span>
                    </div>
            
                    <p className="text-[15px] text-gray-500 line-clamp-2 mb-6 flex-grow">
                      {manual.description || `Official department manual for ${manual.courseCode || 'this course'}.`}
                    </p>
            
                    {/* 3. Add to Cart Button */}
                    <button  onClick={() => navigate(`/checkout/${manual.id}`)}  className="w-full bg-[#1b5e20] hover:bg-[#154d1a] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Buy Manual
                    </button>
                  </div>
                </div>
              ))}
          </div>) : (
              /* The "No Results" state from your image */
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center max-w-4xl mx-auto">
                <p className="text-gray-500 text-lg mb-6">
                  No manuals found matching "{searchQuery}"
                </p>
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="px-8 py-2.5 border-2 border-blue-900 text-blue-900 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition-all"
                >
                  Clear Search
                </button>
              </div>
            )}
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}