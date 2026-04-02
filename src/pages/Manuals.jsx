
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, BookOpen, GraduationCap } from "lucide-react"; // Nice academic icons
import API from "../api/axios";

export default function Manuals() {
  const [manuals, setManuals] = useState([]);
  const [filteredManuals, setFilteredManuals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchManuals();
  }, []);

  const fetchManuals = async () => {
    try {
      const res = await API.get("/manuals");
      setManuals(res.data);
      setFilteredManuals(res.data);
    } catch (err) {
      setError("Failed to fetch manuals. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Search Logic
  useEffect(() => {
    const results = manuals.filter(manual =>
      manual.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manual.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredManuals(results);
  }, [searchTerm, manuals]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-bounce font-black text-[#001f3f]">LAUTECH MANUALS...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 gap-9">
      {/* LAUTECH HEADER BRANDING */}
      <div className="bg-[#001f3f] text-white py-12 px-6 border-b-8 border-[#FFD700] mb-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight flex items-center justify-center md:justify-start gap-3">
              <GraduationCap size={40} className="text-[#FFD700]" />
              LAUTECH <span className="text-[#FFD700]">E-MANUALS</span>
            </h1>
            <p className="text-blue-200 mt-2 font-medium italic">
              "Excellence, Integrity and Service" — Official Departmental Manuals
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by Course Code (e.g. MTH101)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-gray-900 pl-12 pr-4 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-[#FFD700]/50 transition-all font-bold"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 -mt-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-2xl border border-red-200 text-center font-bold">
            {error}
          </div>
        )}

        {/* Manuals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredManuals.map((manual) => (
            <div
              key={manual.id}
              className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
            >
              {/* Image with Course Code Badge */}
              <div className="relative h-56">
                <img
                  src={manual.imageURL || "https://images.unsplash.com/photo-1544640808-32ca72ac7f67?auto=format&fit=crop&q=80&w=400"}
                  alt={manual.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001f3f]/80 to-transparent opacity-60" />
                <div className="absolute top-4 right-4 bg-[#FFD700] text-[#001f3f] text-xs font-black px-4 py-2 rounded-full shadow-lg">
                  {manual.courseCode}
                </div>
              </div>

              {/* Content Block */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-[#001f3f] mb-2">
                  <BookOpen size={16} />
                  <span className="text-[10px] font-black uppercase tracking-tighter">Academic Material</span>
                </div>
                
                <h2 className="font-black text-xl text-gray-900 mb-4 h-14 line-clamp-2">
                  {manual.title}
                </h2>

                <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase block">Price</span>
                    <p className="text-2xl font-black text-[#001f3f]">₦{manual.price}</p>
                  </div>
                  
                  <Link 
                    to={`/checkout/${manual.id}`} 
                    className="bg-[#001f3f] text-[#FFD700] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95 shadow-lg"
                  >
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredManuals.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold">No manuals found for "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}