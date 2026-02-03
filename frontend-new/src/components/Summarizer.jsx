import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, FileText, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import axios from 'axios';

const Summarizer = ({ isDark }) => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSummarize = async () => {
        if (!text) return;
        setLoading(true);
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await axios.post(`${apiUrl}/summarize`, {
                text: text,
                max_length: 150,
                min_length: 50
            });
            setSummary(response.data.summary_text);
        } catch (error) {
            console.error(error);
            setSummary("Error: Could not reach the API. Please ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 pt-24 sm:pt-32 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10 sm:mb-16"
            >
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glassmorphism text-xs font-bold tracking-widest uppercase mb-6 ${isDark ? 'text-primary' : 'text-[#007AFF] bg-[#007AFF]/5'}`}>
                    <Sparkles size={14} />
                    <span>Neural Summarization Engine</span>
                </div>
                <h1 className={`text-3xl md:text-6xl font-black mb-4 sm:mb-6 leading-tight tracking-tighter ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}>
                    Summarize Any Text with <br className="hidden sm:block" />
                    <span className="gradient-text">Advanced AI Intelligence</span>
                </h1>
                <p className={`text-base md:text-xl max-w-2xl mx-auto px-4 leading-relaxed font-medium ${isDark ? 'text-gray-400' : 'text-[#86868b]'}`}>
                    Save hours of reading with our advanced AI-powered summarization engine.
                    Get the core insights instantly.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-stretch">
                {/* Input Area */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`glassmorphism p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] relative group ${!isDark ? 'mac-shadow border-white' : 'border-white/5'}`}
                >
                    <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-primary/10' : 'from-[#007AFF]/5'} to-transparent rounded-[1.5rem] sm:rounded-[2.5rem] ${isDark ? 'opacity-50' : 'opacity-20'} group-hover:opacity-100 transition-opacity pointer-events-none`}></div>

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner"></div>
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner"></div>
                                <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner"></div>
                            </div>
                            <div className={`flex items-center gap-2 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs ${isDark ? 'text-primary' : 'text-[#007AFF]'}`}>
                                <FileText size={16} />
                                <span>Source Text</span>
                            </div>
                        </div>
                        <textarea
                            className={`w-full h-48 sm:flex-grow bg-transparent border-none focus:ring-0 outline-none ${isDark ? 'text-gray-100 placeholder:text-white/10' : 'text-slate-800 placeholder:text-slate-300'} text-base md:text-xl font-medium resize-none ring-0 focus:border-none`}
                            placeholder="Paste your long document content here..."
                            style={{ outline: 'none', boxShadow: 'none' }}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        ></textarea>

                        <div className={`mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 ${isDark ? 'bg-white/[0.03]' : 'bg-[#f5f5f7]/50 shadow-inner'} p-4 sm:p-5 rounded-2xl border ${isDark ? 'border-white/5' : 'border-[#d2d2d7]'} backdrop-blur-sm`}>
                            <div className="flex flex-col items-center sm:items-start">
                                <span className={`text-[10px] uppercase tracking-widest mb-1 font-black ${isDark ? 'text-gray-500' : 'text-[#86868b]'}`}>Word Count</span>
                                <span className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-[#1d1d1f]'} font-mono font-bold`}>{text.split(/\s+/).filter(x => x).length}</span>
                            </div>
                            <button
                                onClick={handleSummarize}
                                disabled={loading || !text}
                                className={`w-full sm:w-auto flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-tighter transition-all ${loading || !text
                                    ? (isDark ? 'bg-gray-800/50 text-gray-600 border-white/5' : 'bg-[#e8e8ed] text-[#86868b] border-[#d2d2d7]') + ' cursor-not-allowed'
                                    : `${isDark ? 'bg-primary shadow-[0_15px_40px_rgba(99,102,241,0.4)]' : 'bg-[#007AFF] shadow-[0_15px_40px_rgba(0,122,255,0.3)]'} text-white md:hover:scale-[1.03] md:active:scale-95`
                                    }`}
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                {loading ? "Analyzing..." : "Generate Insights"}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Output Area */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className={`glassmorphism p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] relative overflow-hidden group min-h-[300px] ${!isDark && 'mac-shadow border-white'}`}
                >
                    {/* Glowing effect border */}
                    <div className={`absolute -inset-[1px] bg-gradient-to-br from-primary/40 via-secondary/40 to-indigo-500/40 rounded-[1.5rem] sm:rounded-[2.5rem] pointer-events-none ${isDark ? 'opacity-60' : 'opacity-10'}`}></div>

                    <div className={`absolute top-0 right-0 w-60 sm:w-80 h-60 sm:h-80 ${isDark ? 'bg-primary/20' : 'bg-primary/10'} blur-[80px] sm:blur-[120px]`}></div>
                    <div className={`absolute bottom-0 left-0 w-60 sm:w-80 h-60 sm:h-80 ${isDark ? 'bg-secondary/20' : 'bg-secondary/10'} blur-[80px] sm:blur-[120px]`}></div>

                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner"></div>
                        </div>
                        <div className={`flex items-center gap-2 font-black uppercase tracking-widest text-xs sm:text-sm ${isDark ? 'text-secondary' : 'text-[#BF5AF2]'}`}>
                            <Sparkles size={18} />
                            <span>AI Summary</span>
                        </div>
                        {summary && (
                            <button
                                onClick={copyToClipboard}
                                className={`p-2.5 ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white border border-[#d2d2d7] shadow-sm hover:bg-[#f5f5f7] text-[#1d1d1f]'} rounded-xl transition-all active:scale-90`}
                                title="Copy to clipboard"
                            >
                                {copied ? <Check className="text-green-500" size={18} /> : <Copy size={18} />}
                            </button>
                        )}
                    </div>

                    <AnimatePresence mode='wait'>
                        {!summary && !loading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center text-center py-10 sm:py-20 relative z-10"
                            >
                                <div className={`p-4 sm:p-5 ${isDark ? 'bg-white/5 border border-white/10' : 'bg-[#f5f5f7] border border-[#d2d2d7] shadow-inner'} rounded-3xl mb-4`}>
                                    <Send className={isDark ? 'text-gray-600' : 'text-[#d2d2d7]'} size={32} />
                                </div>
                                <p className={`${isDark ? 'text-gray-500' : 'text-[#86868b]'} text-sm sm:text-base font-bold italic tracking-tight`}>Your summary will appear here...</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={summary}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`relative z-10 ${isDark ? 'text-gray-200' : 'text-[#1d1d1f]'} text-base sm:text-lg md:text-xl font-bold leading-relaxed whitespace-pre-wrap`}
                            >
                                {summary}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Summarizer;
