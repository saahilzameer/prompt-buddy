import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./views/LandingPage";
import Registration from "./views/Registration";
import Dashboard from "./views/Dashboard";
import Admin from "./views/Admin";
import SuperAdmin from "./views/SuperAdmin";
import Navbar from "./components/Navbar";
import { motion, AnimatePresence } from "motion/react";
import { ToastProvider } from "./context/ToastContext";
import NotificationListener from "./components/NotificationListener";

export default function App() {
  return (
    <Router>
      <ToastProvider>
        <NotificationListener />
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
        <Navbar />
        <main className="pt-16">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/super-admin" element={<SuperAdmin />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
      </ToastProvider>
    </Router>
  );
}
