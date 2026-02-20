import React, { useState, useEffect } from 'react';

const MissionClock = () => {
    const [time, setTime] = useState(new Date());
    const [uptime, setUptime] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
            setUptime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        const s = date.getSeconds().toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const formatUptime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-end opacity-60">
            <div className="flex items-center gap-2">
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Session Time</span>
                <span className="text-[12px] font-black text-white italic tracking-tighter w-16 text-right font-mono">
                    {formatTime(time)}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[7px] font-black text-indigo-500/50 uppercase tracking-[0.3em]">Uptime</span>
                <span className="text-[9px] font-black text-indigo-400 italic tracking-tighter w-12 text-right font-mono">
                    +{formatUptime(uptime)}
                </span>
            </div>
        </div>
    );
};

export default MissionClock;
