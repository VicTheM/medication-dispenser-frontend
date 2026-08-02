import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute } from "./components/Shared";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/caregiver/Dashboard";
import PatientDetail from "./pages/caregiver/PatientDetail";
import Knowledge from "./pages/caregiver/Knowledge";
import Portal from "./pages/patient/Portal";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/app" element={<ProtectedRoute role="caregiver"><Dashboard /></ProtectedRoute>} />
            <Route path="/app/knowledge" element={<ProtectedRoute role="caregiver"><Knowledge /></ProtectedRoute>} />
            <Route path="/app/patients/:patientId" element={<ProtectedRoute role="caregiver"><PatientDetail /></ProtectedRoute>} />

            <Route path="/portal" element={<ProtectedRoute role="patient"><Portal /></ProtectedRoute>} />
            <Route path="/portal/history" element={<ProtectedRoute role="patient"><Portal /></ProtectedRoute>} />
            <Route path="/portal/notifications" element={<ProtectedRoute role="patient"><Portal /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
