import React from 'react';
import {
    LayoutDashboard,
    ListTodo,
    Flame,
    Calendar,
    TrendingUp,
    Settings,
    Power,
    Target
} from 'lucide-react';

const NavItem = ({ icon, label, active, onClick, staggerClass }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-center lg:justify-start px-6 py-4 rounded-[22px] transition-all duration-500 border cursor-pointer group relative animate-precision-docking ${staggerClass} ${active
            ? 'bg-gradient-to-r from-indigo-500/15 via-indigo-500/5 to-transparent text-white border-indigo-500/30 shadow-[inset_0_0_20px_rgba(79,70,229,0.1)]'
            : 'bg-transparent text-slate-500 border-white/5 hover:text-white hover:bg-white/[0.04] hover:-translate-y-0.5'
            } hover-glow`}
    >
        <div className={`transition-all duration-500 shrink-0 ${active ? 'text-indigo-400 scale-125 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'group-hover:text-indigo-400 group-hover:scale-110'}`}>{icon}</div>
        <span className={`hidden md:block font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-500 ml-4 whitespace-nowrap italic ${active ? 'text-white' : ''}`}>
            {label}
        </span>
        {active && (
            <>
                <div className="absolute left-0 w-1.5 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_20px_rgba(99,102,241,1)] animate-pulse"></div>
                <div className="absolute right-4 w-1 h-1 bg-indigo-400 rounded-full animate-ping opacity-40"></div>
            </>
        )}
    </button>
);

const Sidebar = ({ activeTab, setActiveTab, className }) => {
    return (
        <aside
            className={`fixed bottom-0 left-0 right-0 h-20 md:h-screen md:w-72 md:relative md:static bg-black/40 backdrop-blur-3xl border-t md:border-t-0 md:border-r border-indigo-500/20 z-50 transition-all duration-500 flex flex-row md:flex-col p-4 md:p-10 overflow-hidden ${className}`}
        >
            <div className="hidden md:flex mb-16 items-center gap-4 px-2 animate-precision-docking stagger-1 relative group/logo">
                <div className="absolute -inset-2 bg-indigo-500/5 blur-2xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"></div>
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.4)] shrink-0 border border-white/20 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '6px 6px' }}></div>
                    <Target className="text-white relative z-10" size={28} />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black tracking-[-0.08em] text-white italic uppercase leading-none">
                        FOCUS CARE
                    </h1>
                    <span className="text-[7px] font-black text-indigo-400 uppercase tracking-[0.5em] mt-1 opacity-60">System Core v2.0</span>
                </div>
            </div>

            <nav className="flex-1 flex flex-row md:flex-col items-center justify-around md:justify-start md:space-y-4 gap-2 w-full">
                <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} staggerClass="stagger-2" />
                <NavItem icon={<ListTodo size={20} />} label="To-Do List" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} staggerClass="stagger-3" />
                <NavItem icon={<Flame size={20} />} label="Habit Tracker" active={activeTab === 'habits'} onClick={() => setActiveTab('habits')} staggerClass="stagger-4" />
                <NavItem icon={<Calendar size={20} />} label="Schedule" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} staggerClass="stagger-5" />
                <NavItem icon={<TrendingUp size={20} />} label="Analytics" active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} staggerClass="stagger-6" />
            </nav>

            <div className="hidden md:flex mt-auto pt-8 border-t border-white/5 flex-col space-y-3">
                <button className="w-full flex items-center justify-start gap-4 p-4 text-slate-500 hover:text-white transition-all border border-white/5 bg-transparent cursor-pointer group hover-glow rounded-2xl animate-precision-docking stagger-7">
                    <Settings size={20} className="shrink-0" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Settings</span>
                </button>
                <button className="w-full flex items-center justify-start gap-4 p-4 text-slate-500 hover:text-white transition-all border border-white/5 bg-transparent cursor-pointer group hover-glow rounded-2xl animate-precision-docking stagger-8">
                    <Power size={20} className="group-hover:text-red-400 shrink-0" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
