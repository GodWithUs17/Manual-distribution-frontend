import React, { useState } from "react";
import axios from "axios";
import { X, UserPlus, Loader2 } from "lucide-react";

export default function AddStaffModal({ isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:5000/api/admin/staff/create", formData);
      setFormData({ name: "", email: "", password: "" }); // Reset form
      onRefresh(); // Reload the staff list in the background
      onClose();   // Close modal
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create staff account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-black p-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <UserPlus size={20} />
            <h2 className="text-xl font-bold">Register New Staff</h2>
          </div>
          <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-black transition"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-black transition"
              placeholder="staff@lautech.edu.ng"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Temporary Password</label>
            <input 
              type="password" 
              required
              className="w-full border p-3 rounded-xl outline-none focus:ring-2 focus:ring-black transition"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <p className="text-[10px] text-gray-400 mt-1">Staff can change this later via Forgot Password.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition flex justify-center items-center space-x-2 disabled:bg-gray-400"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Confirm Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}