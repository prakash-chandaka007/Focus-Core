import React from 'react';
import {
    Star,
    ListTodo,
    Flame,
    Activity,
    Target
} from 'lucide-react';

const StatBox = ({ icon, label, value, color }) => (
    <div className="flex flex-col gap-3 group/stat cursor-pointer p-4 rounded-2xl transition-all duration-300 hover:bg-white/[0.05] hover:-translate-y-1 hover-glow border border-white/5 hover:border-white/10">
        <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center ${color} shadow-lg transition-all duration-500 group-hover/stat:scale-110 group-hover/stat:shadow-indigo-500/20 group-hover/stat:border-indigo-500/30`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] mb-1 group-hover/stat:text-indigo-400 transition-colors duration-300">{label}</p>
            <p className="text-lg font-black text-white tracking-tight italic uppercase group-hover/stat:scale-105 origin-left transition-transform duration-300">{value}</p>
        </div>
    </div>
);

const DashboardOverview = ({ userStats }) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-reveal-up">
            <div className="xl:col-span-8 bg-white/[0.03] border border-white/10 rounded-[32px] md:rounded-[48px] p-6 md:p-12 relative overflow-hidden group backdrop-blur-2xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full -mr-40 -mt-40"></div>
                <h3 className="text-3xl font-black text-white tracking-tighter mb-14 italic uppercase relative z-10">Daily Completion</h3>
                <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="relative w-56 h-56 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/[0.03]" />
                            <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={628} strokeDashoffset={628 - (628 * (userStats.dailyCompletion / 100))} strokeLinecap="round" className="text-indigo-500 transition-all duration-1000" />
                        </svg>
                        <div className="text-center">
                            <span className="text-5xl md:text-6xl font-black text-white tracking-tighter italic">{userStats.dailyCompletion}</span>
                            <p className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mt-1">% Done</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 flex-1 w-full">
                        <StatBox icon={<ListTodo size={20} />} label="Total Tasks" value={userStats.totalTasksDone} color="text-indigo-400" />
                        <StatBox icon={<Flame size={20} />} label="Streak" value={`${userStats.currentStreak} Days`} color="text-orange-400" />
                        <StatBox icon={<Activity size={20} />} label="Habit Rate" value="88%" color="text-blue-400" />
                        <StatBox icon={<Star size={20} />} label="Level" value="Pro" color="text-yellow-400" />
                    </div>
                </div>
            </div>

            <div className="xl:col-span-4 bg-white/[0.02] border border-white/10 rounded-[32px] md:rounded-[48px] p-6 md:p-10 flex flex-col backdrop-blur-3xl">
                <h4 className="text-2xl font-black text-white mb-8 tracking-tight italic uppercase">Current Habits</h4>
                <div className="space-y-4 mb-10 flex-1">
                    {['Morning Hydration', 'Deep Work Block', 'Evening Review'].map((habit, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group/habit hover-glow">
                            <span className="text-sm font-bold text-slate-300 italic group-hover/habit:text-white transition-colors duration-300">{habit}</span>
                            <Target size={16} className="text-indigo-500 group-hover/habit:scale-125 transition-transform duration-300" />
                        </div>
                    ))}
                </div>
                <div className="pt-6 border-t border-white/5">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Completion Rate</span>
                        <span className="text-2xl font-black text-white italic">75%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div className="bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 h-full w-[75%] animate-gradient-shift bg-[length:200%_auto]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
