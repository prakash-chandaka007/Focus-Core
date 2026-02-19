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

const NavItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-center lg:justify-start px-6 py-4 rounded-[22px] transition-all duration-500 border cursor-pointer group relative ${active
            ? 'bg-gradient-to-r from-indigo-500/10 to-transparent text-white border-white/10 shadow-[inset_0_0_20px_rgba(79,70,229,0.05)]'
            : 'bg-transparent text-slate-500 border-white/5 hover:text-white hover:bg-white/[0.04] hover:-translate-y-0.5'
            } hover-glow`}
    >
        <div className={`transition-all duration-500 shrink-0 ${active ? 'text-indigo-400 scale-125' : 'group-hover:text-indigo-400 group-hover:scale-110'}`}>{icon}</div>
        <span className={`hidden md:block font-black text-[11px] uppercase tracking-wider transition-all duration-500 ml-4 whitespace-nowrap ${active ? 'text-indigo-400' : ''}`}>
            {label}
        </span>
        {active && <div className="absolute left-0 w-1.5 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_20px_rgba(99,102,241,0.8)] animate-pulse"></div>}
    </button>
);

const Sidebar = ({ activeTab, setActiveTab, className }) => {
    return (
        <aside
            className={`fixed bottom-0 left-0 right-0 h-20 md:h-screen md:w-72 md:relative md:static bg-black/40 backdrop-blur-3xl border-t md:border-t-0 md:border-r border-white/5 z-50 transition-all duration-500 flex flex-row md:flex-col p-4 md:p-10 overflow-hidden ${className}`}
        >
            <div className="hidden md:flex mb-16 items-center gap-4 px-2">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 shrink-0">
                    <Target className="text-white" size={24} />
                </div>
                <h1 className="text-xl font-black tracking-tighter text-white italic uppercase">
                    FOCUS CARE
                </h1>
            </div>

            <nav className="flex-1 flex flex-row md:flex-col items-center justify-around md:justify-start md:space-y-4 gap-2 w-full">
                <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                <NavItem icon={<ListTodo size={20} />} label="To-Do List" active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
                <NavItem icon={<Flame size={20} />} label="Habit Tracker" active={activeTab === 'habits'} onClick={() => setActiveTab('habits')} />
                <NavItem icon={<Calendar size={20} />} label="Schedule" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
                <NavItem icon={<TrendingUp size={20} />} label="Analytics" active={activeTab === 'progress'} onClick={() => setActiveTab('progress')} />
            </nav>

            <div className="hidden md:flex mt-auto pt-8 border-t border-white/5 flex-col space-y-3">
                <button className="w-full flex items-center justify-start gap-4 p-4 text-slate-500 hover:text-white transition-all border border-white/5 bg-transparent cursor-pointer group hover-glow rounded-2xl">
                    <Settings size={20} className="shrink-0" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Settings</span>
                </button>
                <button className="w-full flex items-center justify-start gap-4 p-4 text-slate-500 hover:text-white transition-all border border-white/5 bg-transparent cursor-pointer group hover-glow rounded-2xl">
                    <Power size={20} className="group-hover:text-red-400 shrink-0" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
