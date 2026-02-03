import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Sparkles } from 'lucide-react'
import Summarizer from './components/Summarizer'

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'} font-sans selection:bg-primary selection:text-white`}>
      {/* Background Wallpaper */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <img
          src="/wallpaper.png"
          alt="Wallpaper"
          className="w-full h-full object-cover scale-105 transition-transform duration-[2s]"
        />
        {/* Dynamic Overlay for contrast */}
        <div className={`absolute inset-0 transition-colors duration-700 ${isDark ? 'bg-black/40 backdrop-blur-[2px]' : 'bg-white/10'}`}></div>
      </div>

      {/* Floating Theme Toggle and Branding */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsDark(!isDark)}
          className={`p-3 rounded-full shadow-lg backdrop-blur-md border transition-all ${isDark
            ? 'bg-white/10 border-white/20 text-yellow-400 hover:bg-white/20'
            : 'bg-white/95 border-white text-[#007AFF] hover:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]'
            }`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
      </div>

      <div className="fixed top-6 left-6 z-50 flex items-center gap-3">
        <div className={`p-2 rounded-xl backdrop-blur-xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/95 border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]'}`}>
          <Sparkles className={isDark ? "text-primary" : "text-[#007AFF]"} size={22} />
        </div>
        <span className="text-xl font-black tracking-tighter gradient-text drop-shadow-sm">AI SUMMARIX</span>
      </div>

      <main className="relative z-10">
        <Summarizer isDark={isDark} />
      </main>

      <footer className={`w-full py-10 text-center ${isDark ? 'text-gray-500 border-white/5' : 'text-slate-400 border-slate-200'} border-t bg-transparent mt-10`}>
        <p className="text-sm font-medium tracking-wide">© 2026 AI SUMMARIX | Advanced Neural Summarization Engine</p>
      </footer>
    </div>
  )
}

export default App
