import React from 'react';
import { LayoutDashboard, ListTodo, Flame, Calendar, TrendingUp } from 'lucide-react';

const MobileNav = ({ activeTab, setActiveTab, isDark }) => {
    const navItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { id: 'tasks', icon: <ListTodo size={20} />, label: 'Tasks' },
        { id: 'habits', icon: <Flame size={20} />, label: 'Habits' },
        { id: 'schedule', icon: <Calendar size={20} />, label: 'Schedule' },
        { id: 'progress', icon: <TrendingUp size={20} />, label: 'Analytics' },
    ];

    return (
        <nav className={`fixed bottom-0 left-0 right-0 z-[70] md:hidden border-t backdrop-blur-2xl transition-all duration-500 ${
            isDark 
                ? 'bg-black/60 border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]' 
                : 'bg-white/90 border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]'
        }`}>
            <div className="flex items-center justify-around px-2 py-3">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center gap-1 transition-all duration-300 relative group ${
                                isActive 
                                    ? 'text-indigo-500' 
                                    : (isDark ? 'text-slate-500' : 'text-slate-400')
                            } bg-transparent border-none cursor-pointer`}
                        >
                            <div className={`transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : 'group-active:scale-95'}`}>
                                {item.icon}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest transition-all duration-300 ${
                                isActive ? 'opacity-100' : 'opacity-0 scale-75'
                            }`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div className="absolute -top-3 w-8 h-1 bg-indigo-500 rounded-full blur-[2px] animate-pulse"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNav;
