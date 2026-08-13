import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Users, Zap, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full group-hover:bg-blue-500/40 transition-all" />
              <Logo className="w-9 h-9 relative z-10 drop-shadow-2xl" />
            </div>
            <div className="flex flex-col -gap-1">
              <span className="text-lg font-black tracking-tighter text-white group-hover:text-blue-400 transition-colors uppercase">Prompt</span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase -mt-1">Buddy</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Home</Link>
            <Link to="/community" className="text-sm font-medium text-white/70 hover:text-white transition-colors">Community</Link>
            <Link to="/how-it-works" className="text-sm font-medium text-white/70 hover:text-white transition-colors">How it Works</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-full transition-all hover:scale-105 active:scale-95">
              Find My Buddy
            </Link>
          </div>

          <button className="md:hidden p-2 text-white/70" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#050505] border-b border-white/10 px-4 py-6 flex flex-col gap-4"
        >
          <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium">Home</Link>
          <Link to="/community" onClick={() => setIsOpen(false)} className="text-lg font-medium">Community</Link>
          <Link to="/register" onClick={() => setIsOpen(false)} className="w-full py-3 bg-blue-600 text-center rounded-xl font-bold">
            Find My Buddy
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
