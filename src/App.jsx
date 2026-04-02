import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./contexts/ProtectedRoutes";
import "../src/index.css"; // Import Tailwind CSS

// Import your pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Manuals from "./pages/Manuals";
import Checkout from "./pages/Checkout";
import Receipt from "./pages/Receipt";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./layouts/AdminDashboard";
import StaffScanner from "./layouts/StaffScanner";
import { Toaster } from 'react-hot-toast';
import Unauthorized from "./contexts/unauthorized";



export default function App() {
  return (
    <>
    <Toaster position="top-center" />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
          <AdminDashboard />
        </ProtectedRoute>
        } />

        <Route path="/manuals" element={<Manuals />} />
        <Route path="/checkout/:manualId" element={<Checkout />} />
        <Route path="/receipt" element={<Receipt />} />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/scanner" 
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin', 'super_admin']}>
              <StaffScanner />
            </ProtectedRoute>
          } />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<div className="p-10 text-center">Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
    </>
  );
}