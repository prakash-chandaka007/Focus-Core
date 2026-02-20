import React from 'react';

const StrategicTicker = () => {
    const messages = [
        "SYSTEM CORE OPTIMIZED",
        "NEURAL LINK ESTABLISHED",
        "MISSION LOG SYNCING",
        "SYSCAP LOAD: NORMAL",
        "OPERATOR SESSION ACTIVE",
        "DATA ENCRYPTED",
        "FOCUS BOUNDARY SET"
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 h-6 bg-black/80 border-t border-indigo-500/20 z-[200] overflow-hidden flex items-center index-100">
            <div className="w-16 h-full bg-indigo-600/20 border-r border-indigo-500/30 flex items-center justify-center px-2 shrink-0">
                <span className="text-[7px] font-black text-indigo-400 uppercase tracking-tighter">Live Status</span>
            </div>
            <div className="flex-1 overflow-hidden relative group">
                <div className="flex items-center gap-12 animate-[ticker_30s_linear_infinite] whitespace-nowrap px-4">
                    {[...messages, ...messages].map((msg, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em]">{msg}</span>
                        </div>
                    ))}
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}} />
        </div>
    );
};

export default StrategicTicker;
