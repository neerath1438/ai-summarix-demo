import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Github, Moon, Sun } from 'lucide-react';

const Navbar = ({ isDark, toggleTheme }) => {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl px-8 py-3 glassmorphism rounded-[2rem] flex justify-between items-center shadow-2xl shadow-black/30"
        >
            <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-primary/20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
                    <Cpu className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-xl sm:text-2xl font-black gradient-text tracking-tighter">SUMMARIX</span>
            </div>

            <div className="hidden lg:flex items-center gap-10">
                <a href="#" className={`text-sm font-bold ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors uppercase tracking-widest`}>Platform</a>
                <a href="#" className={`text-sm font-bold ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors uppercase tracking-widest`}>Solutions</a>
                <a href="#" className={`text-sm font-bold ${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors uppercase tracking-widest`}>Docs</a>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    className={`p-2 sm:p-2.5 rounded-xl transition-all ${isDark ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                >
                    {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </motion.button>

                <button className={`hidden sm:block px-6 py-2.5 rounded-full font-bold transition-all text-sm ${isDark ? 'bg-white text-dark hover:bg-gray-200' : 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20'}`}>
                    Try Free
                </button>
                <div className={`w-[1px] h-6 ${isDark ? 'bg-white/10' : 'bg-slate-300'} hidden md:block`}></div>
                <a href="https://github.com" target="_blank" rel="noreferrer" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}>
                    <Github className="w-5 h-5" />
                </a>
            </div>
        </motion.nav>
    );
};

export default Navbar;
