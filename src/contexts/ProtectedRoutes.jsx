import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // 1. Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')); 
  const token = localStorage.getItem('token');

  // --- MOVE LOGS HERE ---
  // This helps you see exactly why a login might be failing
  console.log("User from Storage:", user);
  console.log("User Token:", token ? "Exists" : "Missing");
  console.log("Allowed Roles for this route:", allowedRoles);

  // 2. If no token, they aren't logged in at all
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If their role (staff, admin, etc.) isn't in the allowed list
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. If everything is fine, show the page
  return children;
};


export default ProtectedRoute;