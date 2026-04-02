import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Ensure your logo is in src/assets and named correctly
import logo from "../assets/lauuuu.avif"; 

export default function Receipt() {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptRef = useRef();

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Get data passed from the Payment page
  const { matricNo, reference } = location.state || {};

  useEffect(() => {
    const fetchReceiptData = async () => {
      if (!matricNo || !reference) {
        setError("Missing receipt information. Please pay first.");
        setLoading(false);
        return;
      }
      try {
        const res = await API.post("/purchases/receipt", {
          matricNo,
          reference
        });
        setReceipt(res.data.receipt);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load receipt");
      } finally {
        setLoading(false);
      }
    };
    fetchReceiptData();
  }, [matricNo, reference]);

  // Logic to capture the div and turn it into a high-quality A6 PDF
  const generatePDFObject = async () => {
    const element = receiptRef.current;
    
    const canvas = await html2canvas(element, { 
        scale: 4, // Ultra-sharp resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowHeight: element.scrollHeight, 
        windowWidth: element.scrollWidth 
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const pdf = new jsPDF("p", "mm", "a6"); 
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Map the canvas image perfectly to the A6 page
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    return pdf;
  };

  const handleDownloadPDF = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const pdf = await generatePDFObject();
      pdf.save(`LAUTECH_Receipt_${matricNo.replace(/\//g, "_")}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      alert("Download failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSharePDF = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const pdf = await generatePDFObject();
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], `LAUTECH_Receipt.pdf`, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'LAUTECH Manual Receipt',
          text: `Digital Receipt for ${receipt.manual}`,
        });
      } else {
        pdf.save(`LAUTECH_Receipt.pdf`);
        alert("Sharing not supported on this browser. File downloaded instead.");
      }
    } catch (err) {
      console.error("Share failed", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#003366] mb-4"></div>
      <p className="text-[#003366] font-bold">Generating Official Receipt...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
        <p className="text-red-500 font-bold mb-4">⚠️ {error}</p>
        <button onClick={() => navigate("/")} className="bg-[#003366] text-white px-6 py-2 rounded-lg font-bold">Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
      <div className="max-w-sm mx-auto">
        
        {/* --- THE RECEIPT (A6 SIZE) --- */}
        <div 
          ref={receiptRef} 
          className="relative bg-white p-6 shadow-2xl border flex flex-col"
          style={{ 
            width: '105mm',    
            height: '148mm',   
            margin: '0 auto',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          {/* DIAGONAL "PAID" WATERMARK */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <h1 className="text-red-600 font-black text-8xl opacity-[0.06] -rotate-45 uppercase tracking-widest">
              PAID
            </h1>
          </div>

          {/* LOGO WATERMARK */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            <img src={logo} alt="" className="w-64" />
          </div>

          {/* S/N (Top Right) */}
          <div className="text-right text-[9px] font-black text-gray-400 mb-2">
            S/N: LAU-2026-{String(receipt.id || '000').padStart(4, '0')}
          </div>

          {/* HEADER */}
          <div className="text-center mb-4 relative z-10">
            <img src={logo} alt="LAUTECH" className="w-12 mx-auto mb-2" />
            <h1 className="text-[#003366] text-[12px] font-black leading-tight uppercase">
              Ladoke Akintola University <br /> of Technology
            </h1>
            <div className="h-[1.5px] bg-[#003366] w-10 mx-auto my-2"></div>
            <p className="text-[10px] font-black text-[#003366] mb-1">
              2025/2026 ACADEMIC SESSION
            </p>
            <p className="text-[8px] font-bold text-gray-500 underline uppercase tracking-tight">
              Official Digital Manual Receipt
            </p>
          </div>

          {/* DATA ROWS */}
          <div className="flex-grow space-y-4 text-left relative z-10 mt-4">
            <div className="flex flex-col border-l-2 border-gray-100 pl-3">
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Student Name</span>
              <span className="text-[11px] font-bold text-black uppercase">{receipt.fullName}</span>
            </div>
            <div className="flex flex-col border-l-2 border-gray-100 pl-3">
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Matric Number</span>
              <span className="text-[11px] font-bold text-black uppercase">{matricNo}</span>
            </div>
            <div className="flex flex-col border-l-2 border-gray-100 pl-3">
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">Manual Ordered</span>
              <span className="text-[10px] font-bold text-black uppercase">{receipt.courseCode} — {receipt.manual}</span>
            </div>

            {/* LEVEL & AMOUNT */}
            <div className="flex justify-between items-end border-t border-dashed pt-3 mt-4">
              <div>
                <span className="text-[8px] text-gray-400 font-bold block uppercase tracking-wider">Level</span>
                <span className="text-[11px] font-bold text-black">{receipt.level}L</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-gray-400 font-bold block uppercase tracking-wider">Amount Paid</span>
                <span className="text-sm font-black text-green-700">₦{Number(receipt.amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* FOOTER (QR, REF, & DATE) */}
          <div className="mt-auto pt-4 flex flex-col items-center border-t border-gray-50 relative z-10">
            <div className="border-[1.5px] border-[#003366] p-1 rounded-lg bg-white mb-2 shadow-sm">
              <img src={receipt.qrCode} alt="QR" className="w-20 h-20" />
            </div>
            <p className="text-[8px] font-bold text-[#003366] tracking-widest uppercase">Verified Digital Stamp</p>
            
            <p className="text-[7px] text-gray-500 mt-2 font-mono font-bold tracking-tighter">
              REF: {reference}
            </p>
            <p className="text-[6px] text-gray-400 mt-0.5 uppercase">
              Printed on: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} | {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* INTERACTIVE BUTTONS */}
        <div className="mt-8 flex flex-col gap-3 no-print">
          <button 
            onClick={handleDownloadPDF} 
            disabled={isProcessing}
            className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                isProcessing ? "bg-gray-400" : downloadSuccess ? "bg-green-600 text-white" : "bg-[#003366] text-white hover:bg-opacity-90"
            }`}
          >
            {isProcessing ? "⌛ Processing..." : downloadSuccess ? "✅ Receipt Saved" : "📥 Download Receipt (PDF)"}
          </button>

          <button 
            onClick={handleSharePDF}
            disabled={isProcessing}
            className="w-full py-4 border-2 border-[#003366] text-[#003366] rounded-2xl font-bold flex items-center justify-center gap-2 bg-white hover:bg-blue-50 transition-all"
          >
            📲 Share to WhatsApp
          </button>

          <button onClick={() => navigate("/")} className="w-full py-3 text-gray-500 font-bold text-sm">
            Back to Dashboard
          </button>
        </div>
       
        {/* --- COLLECTION GUIDE --- */}
        <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-[#003366] font-black text-[10px] mb-4 tracking-widest flex items-center gap-2">
            <span className="text-base">📍</span> NEXT STEPS
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
                <div className="bg-blue-100 text-[#003366] rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</div>
                <p className="text-[11px] text-gray-600">Go to your <b>Departmental General Office</b>.</p>
            </div>
            <div className="flex gap-3">
                <div className="bg-blue-100 text-[#003366] rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</div>
                <p className="text-[11px] text-gray-600">Present this <b>QR Code</b> to the staff for scanning.</p>
            </div>
            <div className="flex gap-3 text-red-600 font-bold italic">
                <div className="bg-red-100 text-red-600 rounded-full h-5 w-5 flex items-center justify-center text-[10px] flex-shrink-0">!</div>
                <p className="text-[11px]">Keep your QR code secret until you collect your book.</p>
            </div>
          </div>
        </div>

        {/* --- SUPPORT --- */}
        <div className="mt-8 text-center pb-10">
          <p className="text-[10px] text-gray-400 mb-2 uppercase font-bold tracking-widest">Payment Issue?</p>
          <a 
            href={`https://wa.me/2348123456789?text=Hello%20Support,%20I%20have%20an%20issue%20with%20my%20receipt.%20Ref:${reference}`}
            className="text-[#003366] font-bold text-xs underline underline-offset-4"
          >
            💬 Message Student Support
          </a>
        </div>

      </div>
    </div>
  );
}