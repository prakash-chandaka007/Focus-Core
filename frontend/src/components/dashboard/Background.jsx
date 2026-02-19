import React from 'react';

const Background = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-15%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full animate-spin-slow"></div>
            <div className="absolute bottom-[-15%] left-[-10%] w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full animate-reverse-spin"></div>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none"></div>
        </div>
    );
};

export default Background;
