import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, User, ChevronDown, Target, Sun, Moon, LayoutDashboard, ListTodo, Flame, Calendar, TrendingUp, Power } from 'lucide-react';
import MissionClock from './MissionClock';
import { useTheme } from '../../context/ThemeContext';

const TAB_LABELS = {
    dashboard: 'Dashboard',
    tasks: 'Task Engine',
    habits: 'Habit Tracker',
    progress: 'Analytics',
    schedule: 'Schedule',
};

const NavIcon = ({ icon, label, isActive, onClick, isDark }) => (
    <button
        onClick={onClick}
        className={`relative flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-2 rounded-xl transition-all duration-500 border overflow-hidden group ${
            isActive 
                ? (isDark 
                    ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/40 shadow-[inset_0_0_20px_rgba(79,70,229,0.2)]'
                    : 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm') 
                : (isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-transparent')
        } cursor-pointer backdrop-blur-md hidden sm:flex xl:flex`}
        title={label}
    >
        {isActive && <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-indigo-500/10' : 'from-indigo-500/5'} to-transparent`}></div>}
        <span className="relative z-10 transition-transform duration-300 group-hover:scale-110 scale-90 md:scale-100">{icon}</span>
        <span className={`relative z-10 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
            isActive 
                ? (isDark ? 'text-white drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'text-indigo-700') 
                : ''
        }`}>
            {label}
        </span>
        {isActive && (
            <>
                <div className={`absolute bottom-0 left-1/4 right-1/4 h-[2px] ${isDark ? 'bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,1)]' : 'bg-indigo-500 shadow-xs'}`}></div>
                <div className={`absolute top-0 right-0 w-8 h-8 ${isDark ? 'bg-indigo-400/20 blur-xl' : 'bg-indigo-400/10 blur-xl'} rounded-full`}></div>
            </>
        )}
    </button>
);

const Header = ({ activeTab, setActiveTab, userStats, setIsModalOpen, scrolled }) => {
    const { isDark, toggle } = useTheme();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    return (
        <header className={`sticky top-0 z-[60] flex items-center justify-between px-4 xl:px-8 transition-all duration-700 border-b animate-precision-docking stagger-1 ${
            scrolled
                ? (isDark 
                    ? 'h-14 bg-black/60 backdrop-blur-3xl border-indigo-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)]'
                    : 'h-14 bg-white/90 backdrop-blur-3xl border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)]')
                : (isDark 
                    ? 'h-16 lg:h-20 bg-[#020202] border-white/10'
                    : 'h-16 lg:h-20 bg-[#F8FAFC] border-slate-200')
        }`}>
            <div className={`flex items-center gap-3 transition-all duration-700 animate-precision-docking stagger-2 ${scrolled ? 'scale-95 origin-left' : 'scale-100'}`}>
                {/* Logo & Title */}
                <div className="flex items-center gap-2 md:gap-3 relative group/logo cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                    <div className={`transition-all duration-500 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 border relative overflow-hidden ${
                        isDark ? 'shadow-[0_0_30px_rgba(79,70,229,0.3)] border-white/20' : 'shadow-[0_4px_15px_rgba(79,70,229,0.2)] border-indigo-200'
                    } ${scrolled ? 'w-8 h-8' : 'w-9 h-9 md:w-10 md:h-10'}`}>
                        <div className="absolute -inset-2 bg-indigo-500/5 blur-2xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '6px 6px' }}></div>
                        <Target className="text-white relative z-10 transition-transform duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-12" size={scrolled ? 16 : 20} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className={`text-sm md:text-lg font-black tracking-[-0.08em] italic uppercase leading-none ${
                            isDark ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]' : 'text-slate-800'
                        }`}>
                            FOCUS CORE
                        </h1>
                        <p className={`text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] transition-all duration-700 mt-0.5 md:mt-1 flex items-center gap-2 ${
                            isDark ? 'text-indigo-400' : 'text-indigo-600'
                        } ${scrolled ? 'opacity-0 h-0 m-0 overflow-hidden' : (isDark ? 'opacity-80' : 'opacity-100')}`}>
                            Mode <span className={`animate-pulse animate-text-jitter ${isDark ? 'text-white' : 'text-slate-900'}`}>{isDark ? 'Tactical' : 'Stealth'}</span>
                        </p>
                    </div>
                </div>

                {!scrolled && (
                    <div className={`hidden 2xl:flex flex-col justify-center pl-4 ml-2 border-l h-10 animate-precision-docking stagger-5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                        <MissionClock />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1.5 md:gap-3">
                {/* Horizontal Navigation replacing Sidebar */}
                <div className="flex items-center gap-1 mr-0 md:mr-2 animate-precision-docking stagger-2">
                    <NavIcon isDark={isDark} icon={<LayoutDashboard size={16} />} label="Overview" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <NavIcon isDark={isDark} icon={<ListTodo size={16} />} label="Tasks" isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
                    <NavIcon isDark={isDark} icon={<Flame size={16} />} label="Habits" isActive={activeTab === 'habits'} onClick={() => setActiveTab('habits')} />
                    <NavIcon isDark={isDark} icon={<Calendar size={16} />} label="Schedule" isActive={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
                    <NavIcon isDark={isDark} icon={<TrendingUp size={16} />} label="Analytics" isActive={activeTab === 'progress'} onClick={() => setActiveTab('progress')} />
                </div>

                <div className={`w-px hidden lg:block transition-all duration-700 animate-precision-docking stagger-3 ${isDark ? 'bg-white/10' : 'bg-slate-200'} ${scrolled ? 'h-4' : 'h-6'}`}></div>

                {/* User chip */}
                <div className="relative">
                    <div
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2 border rounded-xl cursor-pointer transition-all duration-300 group/user animate-precision-docking stagger-3 backdrop-blur-md ${
                            isDark 
                                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover-glow' 
                                : 'bg-white border-slate-200 hover:bg-slate-50 hover:shadow-sm'
                        }`}
                    >
                        <div className={`rounded-lg md:rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center border transition-all duration-700 group-hover/user:scale-110 shadow-lg ${
                            isDark ? 'shadow-indigo-500/20 group-hover/user:shadow-indigo-500/40 border-white/20' : 'shadow-[0_2px_10px_rgba(79,70,229,0.2)] border-indigo-200'
                        } ${scrolled ? 'w-7 h-7' : 'w-8 h-8'}`}>
                            <User size={scrolled ? 13 : 15} className="text-white" />
                        </div>
                        <div className="hidden lg:block text-left">
                            <p className={`text-[10px] md:text-xs font-black italic leading-tight uppercase tracking-tight transition-colors ${
                                isDark ? 'text-white group-hover/user:text-indigo-400' : 'text-slate-800 group-hover/user:text-indigo-600'
                            }`}>{userStats.userName}</p>
                        </div>
                        <ChevronDown size={14} className={`hidden md:block transition-all duration-300 ${
                            isDark ? 'text-slate-500 group-hover/user:text-white' : 'text-slate-400 group-hover/user:text-slate-800'
                        } ${isDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className={`absolute top-full right-0 mt-2 w-40 md:w-48 backdrop-blur-2xl border rounded-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-200 ${
                            isDark 
                                ? 'bg-[#050505]/90 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
                                : 'bg-white/95 border-slate-200 shadow-xl'
                        }`}>
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={handleSignOut}
                                    className={`w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 transition-all border border-transparent cursor-pointer rounded-xl group/logout ${
                                        isDark 
                                            ? 'text-slate-400 hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/5' 
                                            : 'text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50'
                                    }`}
                                >
                                    <Power size={14} className={`transition-colors ${isDark ? 'group-hover/logout:text-red-400' : 'group-hover/logout:text-red-600'}`} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`w-px hidden lg:block transition-all duration-700 animate-precision-docking stagger-4 ${isDark ? 'bg-white/10' : 'bg-slate-200'} ${scrolled ? 'h-4' : 'h-6'}`}></div>

                {/* Theme toggle pill — desktop only */}
                <button
                    onClick={toggle}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    className={`hidden lg:flex items-center gap-2 border rounded-xl transition-all duration-300 cursor-pointer animate-precision-docking stagger-4 ${scrolled ? 'px-2.5 py-1.5' : 'px-3 py-2'} ${
                        isDark 
                            ? 'border-white/10 hover:border-indigo-500/30 bg-white/5 hover:bg-white/10' 
                            : 'border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 shadow-sm'
                    }`}
                >
                    <div className="relative w-4 h-4">
                        <Sun
                            size={16}
                            className={`absolute inset-0 text-yellow-500 transition-all duration-500 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}
                        />
                        <Moon
                            size={16}
                            className={`absolute inset-0 text-indigo-400 transition-all duration-500 ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
                        />
                    </div>
                </button>

                <div className={`w-px hidden lg:block transition-all duration-700 ${isDark ? 'bg-white/10' : 'bg-slate-200'} ${scrolled ? 'h-4' : 'h-6'}`}></div>

                {/* Add task button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={`bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl text-[10px] font-black transition-all duration-300 border cursor-pointer flex items-center gap-1.5 md:gap-2 uppercase tracking-widest hover:-translate-y-0.5 active:scale-95 animate-precision-docking stagger-5 relative overflow-hidden group/btn ${scrolled ? 'px-3 md:px-4 py-1.5 md:py-2' : 'px-4 md:px-5 py-2 md:py-2.5'} ${
                        isDark 
                            ? 'hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] border-white/20' 
                            : 'hover:shadow-[0_10px_20px_rgba(79,70,229,0.3)] border-indigo-500'
                    }`}
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <Plus size={14} className="animate-pulse relative z-10" />
                    <span className={`relative z-10 hidden sm:block`}>Initiate</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
