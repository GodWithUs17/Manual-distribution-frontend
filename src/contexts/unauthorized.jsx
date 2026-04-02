const Unauthorized = () => (
  <div className="min-h-screen bg-[#fdfcf7] flex flex-col items-center justify-center p-4 text-center">
    <h1 className="text-4xl font-black text-[#450a0a] mb-2">ACCESS DENIED</h1>
    <p className="text-stone-600 font-bold mb-6">You do not have permission to view this page.</p>
    <a href="/login" className="bg-[#450a0a] text-white px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest">
      Back to Login
    </a>
  </div>
);

export default Unauthorized