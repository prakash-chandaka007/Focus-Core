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

const NavIcon = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`relative flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl transition-all duration-500 border overflow-hidden group ${isActive ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/40 shadow-[inset_0_0_20px_rgba(79,70,229,0.2)]' : 'text-slate-400 hover:text-white hover:bg-white/5 border-transparent'} cursor-pointer backdrop-blur-md hidden sm:flex`}
        title={label}
    >
        {isActive && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent"></div>}
        <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{icon}</span>
        <span className={`relative z-10 text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]' : ''}`}>
            {label}
        </span>
        {isActive && (
            <>
                <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,1)]"></div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-indigo-400/20 blur-xl rounded-full"></div>
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
        <header className={`sticky top-0 z-[60] flex items-center justify-between px-6 md:px-10 transition-all duration-700 border-b animate-precision-docking stagger-1 ${scrolled
            ? 'h-20 bg-black/60 backdrop-blur-3xl border-indigo-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.4)]'
            : 'h-24 bg-[#020202] border-white/10'
            }`}>
            <div className={`flex items-center gap-4 transition-all duration-700 animate-precision-docking stagger-2 ${scrolled ? 'scale-90 origin-left' : 'scale-100'}`}>
                {/* Logo & Title */}
                <div className="flex items-center gap-3 md:gap-4 relative group/logo cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                    <div className={`transition-all duration-500 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(79,70,229,0.3)] shrink-0 border border-white/20 relative overflow-hidden ${scrolled ? 'w-10 h-10' : 'w-12 h-12 md:w-14 md:h-14'}`}>
                        <div className="absolute -inset-2 bg-indigo-500/5 blur-2xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '6px 6px' }}></div>
                        <Target className="text-white relative z-10 transition-transform duration-500 group-hover/logo:scale-110 group-hover/logo:rotate-12" size={scrolled ? 20 : 28} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg md:text-xl font-black tracking-[-0.08em] text-white italic uppercase leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                            FOCUS CORE
                        </h1>
                        <p className={`text-[8px] md:text-[9px] text-indigo-400 font-black uppercase tracking-[0.4em] transition-all duration-700 mt-1 flex items-center gap-2 ${scrolled ? 'opacity-0 h-0 m-0 overflow-hidden' : 'opacity-80'}`}>
                            Mode <span className="animate-pulse animate-text-jitter text-white">{isDark ? 'Tactical' : 'Stealth'}</span>
                        </p>
                    </div>
                </div>

                {!scrolled && (
                    <div className="hidden lg:flex flex-col justify-center pl-6 ml-2 border-l border-white/10 h-12 animate-precision-docking stagger-5">
                        <MissionClock />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* Horizontal Navigation replacing Sidebar */}
                <div className="flex items-center gap-1.5 md:gap-2 mr-1 md:mr-4 animate-precision-docking stagger-2">
                    <NavIcon icon={<LayoutDashboard size={18} />} label="Overview" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <NavIcon icon={<ListTodo size={18} />} label="Tasks" isActive={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} />
                    <NavIcon icon={<Flame size={18} />} label="Habits" isActive={activeTab === 'habits'} onClick={() => setActiveTab('habits')} />
                    <NavIcon icon={<Calendar size={18} />} label="Schedule" isActive={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
                    <NavIcon icon={<TrendingUp size={18} />} label="Analytics" isActive={activeTab === 'progress'} onClick={() => setActiveTab('progress')} />
                </div>

                <div className={`w-px bg-white/10 hidden md:block transition-all duration-700 animate-precision-docking stagger-3 ${scrolled ? 'h-6' : 'h-10'}`}></div>

                {/* User chip */}
                <div className="relative">
                    <div
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex items-center gap-3 md:gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-300 group/user hover-glow animate-precision-docking stagger-3 backdrop-blur-md ${scrolled ? 'py-1.5' : 'py-2.5'}`}
                    >
                        <div className={`rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all duration-700 group-hover/user:scale-110 group-hover/user:shadow-indigo-500/40 border border-white/20 ${scrolled ? 'w-8 h-8' : 'w-10 h-10'}`}>
                            <User size={scrolled ? 14 : 18} className="text-white" />
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-[11px] md:text-sm font-black text-white italic leading-tight uppercase tracking-tight group-hover/user:text-indigo-400 transition-colors">{userStats.userName}</p>
                            <p className={`text-[9px] text-indigo-400 font-black uppercase tracking-[0.2em] transition-all duration-700 mt-0.5 ${scrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                                {userStats.userRole}
                            </p>
                        </div>
                        <ChevronDown size={14} className={`text-slate-500 group-hover/user:text-white transition-all duration-300 ${isDropdownOpen ? 'rotate-180 text-white' : ''}`} />
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute top-full right-0 mt-3 w-48 bg-[#050505]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-200">
                            <div className="p-2 space-y-1">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 hover:bg-red-500/5 cursor-pointer rounded-xl group/logout"
                                >
                                    <Power size={16} className="group-hover/logout:text-red-400 transition-colors" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className={`w-px bg-white/10 hidden md:block transition-all duration-700 animate-precision-docking stagger-4 ${scrolled ? 'h-6' : 'h-10'}`}></div>

                {/* Theme toggle pill — desktop only */}
                <button
                    onClick={toggle}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    className={`hidden md:flex items-center gap-2 border border-white/10 hover:border-indigo-500/30 bg-white/5 hover:bg-white/10 rounded-2xl transition-all duration-300 cursor-pointer animate-precision-docking stagger-4 ${scrolled ? 'px-3 py-2' : 'px-4 py-2.5'}`}
                >
                    <div className="relative w-5 h-5">
                        <Sun
                            size={18}
                            className={`absolute inset-0 text-yellow-500 transition-all duration-500 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}
                        />
                        <Moon
                            size={18}
                            className={`absolute inset-0 text-indigo-400 transition-all duration-500 ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
                        />
                    </div>
                    <span className={`font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-white transition-colors ${scrolled ? 'hidden lg:block' : 'hidden sm:block'}`}>
                        {isDark ? 'Stealth' : 'Tactical'}
                    </span>
                </button>

                <div className={`w-px bg-white/10 hidden md:block transition-all duration-700 ${scrolled ? 'h-6' : 'h-10'}`}></div>

                {/* Add task button */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={`bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl text-[11px] font-black hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all duration-300 border border-white/20 cursor-pointer flex items-center gap-2 md:gap-3 uppercase tracking-widest hover:-translate-y-1 active:scale-95 animate-precision-docking stagger-5 relative overflow-hidden group/btn ${scrolled ? 'px-4 md:px-6 py-2.5' : 'px-5 md:px-8 py-3.5'}`}
                >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                    <Plus size={16} className="animate-pulse relative z-10" />
                    <span className={`relative z-10 ${scrolled ? 'hidden lg:block' : 'hidden sm:block'}`}>Initiate</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
