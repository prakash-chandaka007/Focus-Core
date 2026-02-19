import React from 'react';
import { Target } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative z-10 pt-20 pb-10 px-6 md:px-10 bg-transparent border-t border-white/5 mt-auto">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                                <Target size={16} className="text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tighter italic uppercase text-white">FOCUSCORE</span>
                        </div>
                        <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] leading-relaxed max-w-xs">
                            Performance infrastructure for those who value time. Engineered for clarity.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-12 md:gap-24">
                        <div className="space-y-6">
                            <h5 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em] md:tracking-[0.6em]">System</h5>
                            <ul className="space-y-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest list-none">
                                {['Workflow', 'Cross-Platform', 'Data Security', 'Open API'].map(link => (
                                    <li key={link}><a href="#" className="hover:text-white transition-colors no-underline">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h5 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em] md:tracking-[0.6em]">Organization</h5>
                            <ul className="space-y-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest list-none">
                                {['Privacy Policy', 'Our Mission', 'Global Status'].map(link => (
                                    <li key={link}><a href="#" className="hover:text-white transition-colors no-underline">{link}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.6em] text-slate-700 gap-6">
                    <p>© 2024 FOCUS CORE // PERFORMANCE ARCHITECTURE</p>
                    <div className="flex gap-10">
                        <span className="hover:text-indigo-400 cursor-pointer transition-colors italic">X (Twitter)</span>
                        <span className="hover:text-indigo-400 cursor-pointer transition-colors italic">Join Discord</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
