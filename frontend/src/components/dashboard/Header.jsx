import React from 'react';
import {
    Plus,
    User,
    ChevronDown,
    Target
} from 'lucide-react';

const Header = ({ activeTab, userStats, setIsModalOpen, scrolled }) => {
    return (
        <header className={`sticky top-0 z-[60] flex items-center justify-between px-6 md:px-10 transition-all duration-700 border-b animate-reveal-up ${scrolled
            ? 'h-20 bg-black/40 backdrop-blur-3xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]'
            : 'h-24 bg-[#020202] border-white/5'
            }`}>
            <div className={`flex flex-col transition-all duration-700 ${scrolled ? 'scale-90 origin-left' : 'scale-100'}`}>
                {/* Mobile Project Branding Tag */}
                <div className="flex md:hidden items-center gap-2 mb-1.5 opacity-80 animate-reveal-in">
                    <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-md flex items-center justify-center shadow-lg shadow-indigo-500/10">
                        <Target className="text-white" size={10} />
                    </div>
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Focus Core</span>
                </div>

                <div className="flex flex-col">
                    <h2 className="text-lg md:text-xl font-bold text-white tracking-tight italic uppercase leading-none">
                        {activeTab === 'tasks' ? 'Task Engine' : 'Dashboard'}
                    </h2>
                    <p className={`text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-1.5 transition-all duration-700 ${scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                        Status: <span className="animate-pulse">Operational</span>
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <div className={`flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300 group/user hover-glow ${scrolled ? 'py-1.5' : 'py-2'}`}>
                    <div className={`rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all duration-700 group-hover/user:scale-110 group-hover/user:shadow-indigo-500/40 ${scrolled ? 'w-8 h-8' : 'w-9 h-9 md:w-10 md:h-10'}`}>
                        <User size={scrolled ? 14 : 16} className="text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-[10px] md:text-xs font-black text-white italic leading-tight uppercase tracking-tighter group-hover/user:text-indigo-400 transition-colors">{userStats.userName}</p>
                        <p className={`text-[10px] text-indigo-400 font-bold uppercase tracking-widest transition-all duration-700 ${scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                            {userStats.userRole}
                        </p>
                    </div>
                    <ChevronDown size={14} className="text-slate-500 group-hover/user:text-white transition-colors" />
                </div>

                <div className={`w-px bg-white/10 hidden md:block transition-all duration-700 ${scrolled ? 'h-6' : 'h-10'}`}></div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className={`bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl text-[11px] font-black hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 border-none cursor-pointer flex items-center gap-2 md:gap-3 uppercase tracking-wider hover:-translate-y-1 active:scale-95 ${scrolled ? 'px-4 md:px-6 py-2.5' : 'px-5 md:px-8 py-3.5'
                        }`}
                >
                    <Plus size={16} className="animate-pulse" />
                    <span className={scrolled ? 'hidden lg:block' : 'hidden sm:block'}>Initiate</span>
                </button>
            </div>
        </header >
    );
};

export default Header;
