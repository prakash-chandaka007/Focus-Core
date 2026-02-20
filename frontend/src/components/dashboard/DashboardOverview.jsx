import React from 'react';
import {
    Star,
    ListTodo,
    Flame,
    Activity,
    Target
} from 'lucide-react';
import MiniSparkline from './MiniSparkline';



const StatBox = ({ icon, label, value, color, staggerClass }) => (
    <div className={`flex flex-col gap-3 group/stat cursor-pointer p-4 rounded-[24px] bg-white/[0.02] transition-all duration-300 hover:bg-white/[0.06] hover:-translate-y-1 hover-glow border border-white/5 hover:border-indigo-500/30 animate-precision-docking ${staggerClass} relative overflow-hidden backdrop-blur-md`}>
        <div className="absolute top-3 right-3 flex items-center gap-1.5 h-2">
            <span className="text-[6px] font-black text-slate-600 uppercase tracking-widest opacity-0 group-hover/stat:opacity-100 transition-opacity">Live Data Link</span>
            <div className={`w-1.5 h-1.5 rounded-full animate-ping opacity-40 ${color.replace('text-', 'bg-')}`}></div>
            <div className={`w-1 h-1 rounded-full ${color.replace('text-', 'bg-')}`}></div>
        </div>
        <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center ${color} shadow-[0_0_20px_transparent] transition-all duration-500 group-hover/stat:scale-110 group-hover/stat:shadow-current/20 group-hover/stat:border-current/30 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-current opacity-0 group-hover/stat:opacity-5 transition-opacity"></div>
            {icon}
        </div>
        <div>
            <div className="flex justify-between items-baseline mb-0.5">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] group-hover/stat:text-white transition-colors duration-300">{label}</p>
            </div>
            <p className="text-xl font-black text-white tracking-tight italic uppercase group-hover/stat:scale-105 origin-left transition-transform duration-500">{value}</p>
        </div>
    </div>
);

const DashboardOverview = ({ userStats }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 bg-white/[0.03] border border-white/10 rounded-[32px] md:rounded-[48px] p-6 md:p-12 relative overflow-hidden group backdrop-blur-2xl animate-precision-docking stagger-1">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full -mr-40 -mt-40"></div>
                <h3 className="text-3xl font-black text-white tracking-tighter mb-14 italic uppercase relative z-10 animate-precision-docking stagger-2">Daily Completion</h3>
                <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="relative w-56 h-56 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                            <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-white/[0.04]" />
                            <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="14" fill="transparent" strokeDasharray={628} strokeDashoffset={628 - (628 * (userStats.dailyCompletion / 100))} strokeLinecap="round" className="text-indigo-500 transition-all duration-[1500ms] ease-out" />
                        </svg>
                        <div className="text-center animate-precision-docking stagger-3">
                            <span className="text-5xl md:text-6xl font-black text-white tracking-tighter italic">{userStats.dailyCompletion}</span>
                            <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mt-1">% Done</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 flex-1 w-full">
                        <StatBox icon={<ListTodo size={20} />} label="Total Tasks" value={userStats.totalTasksDone} color="text-indigo-400" staggerClass="stagger-3" />
                        <StatBox icon={<Flame size={20} />} label="Streak" value={`${userStats.currentStreak} Days`} color="text-orange-400" staggerClass="stagger-4" />
                        <StatBox icon={<Activity size={20} />} label="Habit Rate" value="88%" color="text-blue-400" staggerClass="stagger-5" />
                        <StatBox icon={<Star size={20} />} label="Level" value="Pro" color="text-yellow-400" staggerClass="stagger-6" />
                    </div>
                </div>
            </div>

            <div className="xl:col-span-4 bg-white/[0.02] border border-white/10 rounded-[32px] md:rounded-[48px] p-6 md:p-10 flex flex-col backdrop-blur-3xl animate-precision-docking stagger-2 relative overflow-hidden">
                <h4 className="text-2xl font-black text-white mb-8 tracking-tight italic uppercase animate-precision-docking stagger-3">Current Habits</h4>
                <div className="space-y-4 mb-10 flex-1">
                    {['Morning Hydration', 'Deep Work Block', 'Evening Review'].map((habit, i) => (
                        <div key={i} className={`flex items-center justify-between p-5 bg-white/[0.03] rounded-[24px] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.08] hover:-translate-y-1 transition-all duration-500 cursor-pointer group/habit hover-glow animate-precision-docking stagger-${i + 4} backdrop-blur-md`}>
                            <div className="flex flex-col gap-3">
                                <span className="text-[13px] font-black text-slate-100 italic uppercase tracking-tight group-hover/habit:text-indigo-400 transition-colors duration-300">{habit}</span>
                                <MiniSparkline
                                    data={[0.3, 0.6, 0.4, 0.9, 0.7, i === 0 ? 0.8 : i === 1 ? 0.3 : 0.9, 0.85]}
                                    color={i === 0 ? "#818cf8" : i === 1 ? "#fbbf24" : "#3c82f6"}
                                />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1 group-hover/habit:text-indigo-500 transition-colors">Target</span>
                                <Target size={18} className="text-indigo-500 group-hover/habit:scale-125 group-hover/habit:rotate-90 transition-all duration-500" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="pt-6 border-t border-white/5 animate-precision-docking stagger-7">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Completion Rate</span>
                        <span className="text-2xl font-black text-white italic">75%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 animate-glow-pulse">
                        <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 h-full w-[75%] animate-gradient-shift bg-[length:200%_auto]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
