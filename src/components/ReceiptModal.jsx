import React, { useState } from 'react';
import axios from 'axios';

const ReceiptModal = ({ isOpen, onClose }) => {
  const [matricNo, setMatricNo] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios({
        url: `${import.meta.env.VITE_API_URL}/purchases/download-receipt`,
        method: 'GET',
        params: { 
          matricNo: matricNo.trim(), 
          courseCode: courseCode.trim() 
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${courseCode}_Receipt.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      onClose(); // Close modal after success
    } catch (err) {
      alert("No paid record found. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-[#001f3f] p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Receipt Retrieval</h3>
            <p className="text-xs text-blue-200">Download your official PDF</p>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleDownload} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Matric Number</label>
            <input 
              type="text" 
              placeholder="e.g. 2023010446"
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
              value={matricNo}
              onChange={(e) => setMatricNo(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Course Code</label>
            <input 
              type="text" 
              placeholder="e.g. ANS 305"
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 outline-none"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-[#001f3f] text-white font-bold py-4 rounded-xl hover:opacity-95 transition-all disabled:bg-gray-400"
          >
            {loading ? "Searching Database..." : "Download Receipt"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReceiptModal;