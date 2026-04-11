import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import API from "../api/axios"; // Adjust based on your folder structure

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  // Paystack sends the reference in the URL as ?reference=xxxx
  const reference = searchParams.get("reference");

  useEffect(() => {
    const completeTransaction = async () => {
      if (!reference) {
        setStatus("error");
        return;
      }

      try {
        // 1. Tell your backend to verify the reference
        const res = await API.post("/purchases/verify", { reference });

        // 2. If backend confirms, navigate to your existing Receipt page
        // We pass the data in 'state' just like your old code did
        navigate("/receipt", { 
          state: { 
            matricNo: res.data.purchase.matricNo, 
            reference: reference 
          },
          replace: true // This prevents the user from clicking 'back' to the verify page
        });
      } catch (err) {
        console.error("Verification error", err);
        setStatus("error");
      }
    };

    completeTransaction();
  }, [reference, navigate]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfcf7] p-4 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h1 className="text-xl font-bold text-slate-800">Verification Failed</h1>
        <p className="text-slate-600 mt-2">We couldn't verify your payment. If you were debited, please contact the department with your reference: <strong>{reference}</strong></p>
        <button onClick={() => navigate("/")} className="mt-6 bg-[#a16207] text-white px-6 py-2 rounded-md">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfcf7]">
      <Loader2 className="animate-spin text-[#a16207] mb-4" size={40} />
      <h2 className="text-[#a16207] font-semibold text-lg">Finalizing your receipt...</h2>
      <p className="text-slate-500 text-sm">Please do not close this window.</p>
    </div>
  );
};

export default VerifyPayment;