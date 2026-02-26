import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Background = () => {
    const { isDark } = useTheme();

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {isDark ? (
                <>
                    {/* Existing Dark Background */}
                    <div className="absolute top-[-15%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full animate-spin-slow"></div>
                    <div className="absolute bottom-[-15%] left-[-10%] w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full animate-reverse-spin"></div>
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
                    <div className="absolute inset-0 bg-radial-vignette pointer-events-none"></div>
                    <div className="tactical-noise"></div>
                </>
            ) : (
                <>
                    {/* Premium Clean Light Background */}
                    <div className="absolute inset-0 bg-[#F4F7FA]"></div>
                    {/* Soft glowing ambient orbs */}
                    <div className="absolute top-[-20%] left-[-10%] w-[1200px] h-[1200px] bg-indigo-500/10 blur-[150px] rounded-full animate-spin-slow mix-blend-multiply"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-blue-400/10 blur-[150px] rounded-full animate-reverse-spin mix-blend-multiply"></div>

                    {/* Subtle grain */}
                    <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                </>
            )}
        </div>
    );
};

export default Background;
