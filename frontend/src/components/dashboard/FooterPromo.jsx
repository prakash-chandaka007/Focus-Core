import React from 'react';
import { MoveUpRight, Zap, ShieldCheck, Cpu } from 'lucide-react';

const FooterPromo = () => {
    const handleUpgradeClick = () => {
        alert("Yo, we're still cookin' the Pro tier! This feature is deep in the workshop. Stay tuned! 🛠️🔥");
    };

    return (
        <section className="relative py-16 px-8 border border-white/5 overflow-hidden rounded-[40px] bg-indigo-600/[0.03] mt-20 mb-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12 animate-reveal-up">
            <div className="absolute inset-0 bg-indigo-600/[0.01] animate-pulse-glow pointer-events-none"></div>

            <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
                <div className="inline-flex items-center gap-3 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full backdrop-blur-md">
                    <Zap size={14} className="text-indigo-400" />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-300">Tactical Advantage</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
                    Unlock <span className="text-indigo-500">Pro Power.</span>
                </h2>

                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider leading-relaxed">
                    Elevate your workflow with the neural-sync suite. Focus Core Pro status unlocks high-precision tools for serious operators.
                </p>
            </div>

            <div className="flex-shrink-0 relative z-10">
                <button
                    onClick={handleUpgradeClick}
                    className="group relative px-12 py-6 bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-indigo-600 hover:text-white transition-all duration-500 rounded-xl overflow-hidden active:scale-95 shadow-2xl border-none cursor-pointer"
                >
                    <span className="relative z-10 group-hover:tracking-[0.6em] transition-all duration-500 flex items-center gap-3">
                        Join Pro <MoveUpRight size={14} />
                    </span>
                    <div className="absolute inset-0 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                </button>
            </div>
        </section>
    );
};

export default FooterPromo;
