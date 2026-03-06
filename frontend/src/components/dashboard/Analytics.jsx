import React, { useMemo } from 'react';
import { TrendingUp, Activity, Zap, CheckCircle2, Flame, BarChart3, PieChart, LayoutGrid } from 'lucide-react';

// ── SVG Bar Chart ──────────────────────────────────────────────────────────────
const EfficiencyChart = ({ weeklyTaskData, isDark }) => {
    const maxVal = 100;
    const chartH = 120;
    const chartW = 100;
    const barW = 8;
    const gap = (chartW - weeklyTaskData.length * barW) / (weeklyTaskData.length + 1);

    return (
        <div className="w-full h-full flex items-end">
            <svg
                viewBox={`-12 -10 ${chartW + 15} ${chartH + 35}`}
                className="w-full overflow-visible"
                preserveAspectRatio="xMinYMin meet"
            >
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(pct => {
                    const y = chartH - (chartH * pct / maxVal);
                    return (
                        <g key={pct}>
                            <line x1="0" y1={y} x2={chartW} y2={y} stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} strokeWidth="0.4" />
                            <text x="-3" y={y + 1} textAnchor="end" fontSize="3" fill={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)"} fontWeight="700">
                                {pct}%
                            </text>
                        </g>
                    );
                })}

                {/* Bars */}
                {weeklyTaskData.map((d, i) => {
                    const x = gap + i * (barW + gap);
                    const barH = Math.max(2, chartH * (d.efficiency / maxVal));
                    const y = chartH - barH;
                    const isToday = i === weeklyTaskData.length - 1;

                    return (
                        <g key={d.day}>
                            <rect x={x} y={0} width={barW} height={chartH} rx="2" ry="2" fill={isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)"} />

                            <defs>
                                <linearGradient id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={isToday ? '#6366f1' : '#4f46e5'} />
                                    <stop offset="100%" stopColor={isToday ? '#818cf8' : '#6366f1'} stopOpacity="0.8" />
                                </linearGradient>
                            </defs>
                            <rect
                                x={x} y={y}
                                width={barW} height={barH}
                                rx="2" ry="2"
                                fill={`url(#bar-grad-${i})`}
                                className="transition-all duration-1000 ease-out"
                                style={{ filter: isToday ? 'drop-shadow(0 4px 12px rgba(99,102,241,0.3))' : 'none' }}
                            />

                            <text
                                x={x + barW / 2} y={chartH + 12}
                                textAnchor="middle" fontSize="4"
                                fill={isToday ? '#6366f1' : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)'}
                                fontWeight="800"
                            >
                                {d.day}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// ── Sync Level Gauge ───────────────────────────────────────────────────────────
const SyncLevelGauge = ({ syncLevel, isDark }) => {
    const r = 85;
    const cx = 100;
    const cy = 100;
    const circumference = Math.PI * r;
    const filled = circumference * (syncLevel / 100);

    const color = syncLevel < 30 ? '#ef4444' : syncLevel < 60 ? '#f59e0b' : syncLevel < 80 ? '#6366f1' : '#10b981';

    return (
        <div className="flex flex-col items-center w-full">
            <div className="relative w-full max-w-[220px]">
                <svg viewBox="0 0 200 110" className="w-full">
                    <path
                        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                        fill="none"
                        stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)"}
                        strokeWidth="14"
                        strokeLinecap="round"
                    />
                    <path
                        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                        fill="none"
                        stroke={color}
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={`${filled} ${circumference}`}
                        style={{
                            transition: 'stroke-dasharray 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            filter: isDark ? `drop-shadow(0 0 12px ${color}40)` : 'none'
                        }}
                    />
                    <text x={cx} y={cy - 5} textAnchor="middle" fontSize="32" fill={isDark ? "white" : "#0f172a"} fontWeight="900" fontStyle="italic">
                        {syncLevel}%
                    </text>
                </svg>
            </div>
        </div>
    );
};


// ── Main Analytics Component ───────────────────────────────────────────────────
const Analytics = ({ analytics, isDark }) => {
    const {
        weeklyTaskData = [],
        weeklyHabitData = [],
        syncLevel = 0,
        taskPct = 0,
        habitPct = 0
    } = analytics || {};

    const historyRows = useMemo(() => weeklyTaskData.map((d, i) => ({
        ...d,
        habitRate: weeklyHabitData[i]?.rate ?? 0
    })).reverse(), [weeklyTaskData, weeklyHabitData]);

    const weekAvgEfficiency = useMemo(() => {
        if (!weeklyTaskData.length) return 0;
        const sum = weeklyTaskData.reduce((s, d) => s + d.efficiency, 0);
        return Math.round(sum / weeklyTaskData.length);
    }, [weeklyTaskData]);

    const bestDay = useMemo(() => {
        if (!weeklyTaskData.length) return '–';
        const best = [...weeklyTaskData].sort((a, b) => b.efficiency - a.efficiency)[0];
        return best.efficiency > 0 ? best.day : '–';
    }, [weeklyTaskData]);

    return (
        <div className="space-y-6 animate-precision-docking stagger-1 pb-12">
            {/* ── Main Analytics Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Index & Unified Metrics */}
                <div className={`p-8 rounded-[40px] border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-3xl relative overflow-hidden group flex flex-col`}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className={`text-lg font-black italic uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Performance Index</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Synergy Engagement Report</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center">
                        <SyncLevelGauge syncLevel={syncLevel} isDark={isDark} />

                        <div className="grid grid-cols-5 gap-2 w-full mt-10 pt-8 border-t border-white/5 items-center">
                            <div className="text-center group/item">
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover/item:text-indigo-400 transition-colors">Avg Eff</div>
                                <div className={`text-lg font-black italic ${isDark ? 'text-white' : 'text-slate-900'}`}>{weekAvgEfficiency}%</div>
                            </div>
                            <div className="w-px h-8 bg-white/5 mx-auto" />
                            <div className="text-center group/item">
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover/item:text-emerald-400 transition-colors">Peak</div>
                                <div className={`text-lg font-black italic ${isDark ? 'text-white' : 'text-slate-900'}`}>{bestDay}</div>
                            </div>
                            <div className="w-px h-8 bg-white/5 mx-auto" />
                            <div className="text-center group/item">
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover/item:text-orange-400 transition-colors">Consistency</div>
                                <div className={`text-lg font-black italic ${isDark ? 'text-white' : 'text-slate-900'}`}>{habitPct}%</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Efficiency Engine */}
                <div className={`p-8 rounded-[40px] border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-3xl relative overflow-hidden flex flex-col`}>
                    <div className="mb-10">
                        <h3 className={`text-lg font-black italic uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Efficiency Engine</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">7-Day Performance Trajectory</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center min-h-[300px]">
                        <EfficiencyChart
                            isDark={isDark}
                            weeklyTaskData={weeklyTaskData.length ? weeklyTaskData : Array.from({ length: 7 }, (_, i) => ({
                                day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(new Date().getDay() - 6 + i + 7) % 7],
                                efficiency: 0, completed: 0, total: 0
                            }))}
                        />
                    </div>
                </div>
            </div>

            {/* ── Operational History ── */}
            <div className={`p-8 rounded-[40px] border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-3xl relative overflow-hidden`}>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Activity size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className={`text-lg font-black italic uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Mission History</h3>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Detailed Operational Logs</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                            <CheckCircle2 size={12} className="text-indigo-400" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tasks</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/5 border border-orange-500/10">
                            <Flame size={12} className="text-orange-400" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Habits</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {historyRows.map((row, i) => {
                        const isToday = i === 0;
                        return (
                            <div key={row.day + i} className={`group flex items-center gap-6 p-4 rounded-3xl border transition-all duration-300 ${isToday ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5'}`}>
                                <div className="w-12 flex flex-col items-center">
                                    <span className={`text-[12px] font-black uppercase tracking-widest ${isToday ? 'text-indigo-400' : 'text-slate-500'}`}>{row.day}</span>
                                    {isToday && <span className="text-[8px] font-black text-indigo-500/60 uppercase tracking-tighter">NOW</span>}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Task Efficiency</span>
                                        <span className={`text-[11px] font-black italic ${isDark ? 'text-white' : 'text-slate-900'}`}>{row.efficiency}%</span>
                                    </div>
                                    <div className={`h-1.5 w-full ${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-full overflow-hidden`}>
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full transition-all duration-1000"
                                            style={{ width: `${row.efficiency}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="w-48 flex justify-end gap-6 items-center">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-1">Status</span>
                                        <span className="text-[11px] font-black text-slate-400 italic">{row.completed}/{row.total} <small className="text-[8px] uppercase not-italic">Done</small></span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest mb-1">Habits</span>
                                        <span className="text-[11px] font-black text-orange-400 italic">{row.habitRate}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {historyRows.length === 0 && (
                        <div className="py-24 text-center border border-dashed border-white/5 rounded-[40px]">
                            <LayoutGrid size={40} className="text-slate-800 mx-auto mb-4 opacity-20" />
                            <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em]">Operational data stream offline</p>
                            <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mt-2 italic">Awaiting first successful command execution</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
