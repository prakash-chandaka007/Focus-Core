import React, { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Zap, CheckCircle2, Flame, BarChart3, PieChart, LayoutGrid, BrainCircuit, Star, Target, ShieldCheck } from 'lucide-react';

// ── SVG Bar Chart ──────────────────────────────────────────────────────────────
const EfficiencyChart = ({ weeklyTaskData, isDark }) => {
    const [hoverIdx, setHoverIdx] = useState(null);
    const maxVal = 100;
    const chartH = 120;
    const chartW = 100;
    const barW = 8;
    const gap = (chartW - weeklyTaskData.length * barW) / (weeklyTaskData.length + 1);

    return (
        <div className="w-full h-full flex items-end relative">
            <svg
                viewBox={`-12 -20 ${chartW + 15} ${chartH + 45}`}
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
                    const isHovered = hoverIdx === i;

                    return (
                        <g 
                            key={d.day + i} 
                            onMouseEnter={() => setHoverIdx(i)} 
                            onMouseLeave={() => setHoverIdx(null)}
                            className="transition-opacity duration-300 cursor-crosshair"
                            style={{ opacity: hoverIdx !== null && !isHovered ? 0.3 : 1 }}
                        >
                            <rect x={x} y={0} width={barW} height={chartH} rx="2" ry="2" fill={isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.02)"} />

                            <defs>
                                <linearGradient id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={isToday || isHovered ? '#6366f1' : '#4f46e5'} />
                                    <stop offset="100%" stopColor={isToday || isHovered ? '#818cf8' : '#6366f1'} stopOpacity="0.8" />
                                </linearGradient>
                            </defs>
                            <rect
                                x={x} y={y}
                                width={barW} height={barH}
                                rx="2" ry="2"
                                fill={`url(#bar-grad-${i})`}
                                className="transition-all duration-300 ease-out"
                                style={{ filter: isToday || isHovered ? 'drop-shadow(0 4px 12px rgba(99,102,241,0.3))' : 'none' }}
                            />

                            <text
                                x={x + barW / 2} y={chartH + 12}
                                textAnchor="middle" fontSize="4"
                                fill={isToday || isHovered ? '#6366f1' : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)'}
                                fontWeight="800"
                            >
                                {d.day}
                            </text>

                            {/* Tooltip Overlay inside SVG */}
                            {isHovered && (
                                <g className="animate-in fade-in zoom-in duration-200">
                                    <rect 
                                        x={x + barW/2 - 14} 
                                        y={y - 12} 
                                        width={28} 
                                        height={9} 
                                        rx="1.5" 
                                        fill={isDark ? "white" : "#0f172a"} 
                                    />
                                    <polygon 
                                        points={`${x + barW/2},${y - 3} ${x + barW/2 - 2},${y - 12} ${x + barW/2 + 2},${y - 12}`} 
                                        fill={isDark ? "white" : "#0f172a"}
                                    />
                                    <text 
                                        x={x + barW/2} 
                                        y={y - 6.5} 
                                        textAnchor="middle" 
                                        fontSize="3.5" 
                                        fill={isDark ? "black" : "white"} 
                                        fontWeight="900"
                                    >
                                        {d.completed}/{d.total}
                                    </text>
                                </g>
                            )}
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
            <div className="relative w-full max-w-[180px] xl:max-w-[220px]">
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

    // Trend Calculations
    const trends = useMemo(() => {
        if (historyRows.length < 2) return { eff: 0, habit: 0 };
        return {
            eff: Math.round((historyRows[0]?.efficiency || 0) - (historyRows[1]?.efficiency || 0)),
            habit: Math.round((historyRows[0]?.habitRate || 0) - (historyRows[1]?.habitRate || 0))
        };
    }, [historyRows]);

    // AI Insight Generator
    const insightText = useMemo(() => {
        let perfectStreak = 0;
        for (let r of historyRows) {
            if (r.habitRate >= 90) perfectStreak++;
            else break;
        }

        if (perfectStreak > 2) return `Operational excellence. Maintained a ${perfectStreak}-day optimal habit adherence streak.`;
        if (trends.eff > 15) return `Sharp tactical improvement detected (+${trends.eff}% efficiency from yesterday).`;
        if (trends.habit < -20) return `Habit protocol slippage detected. Re-calibrate and re-engage today.`;
        if (syncLevel >= 80) return `Systems fully synchronized. Operational output is highly stabilized.`;
        if (bestDay !== '–') return `Historical data indicates ${bestDay}s yield maximum operational output.`;
        
        return `Gathering tactical telemetry to generate performance insights.`;
    }, [historyRows, trends, syncLevel, bestDay]);

    return (
        <div className="space-y-6 animate-precision-docking stagger-1 pb-12">
            {/* ── Main Analytics Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6">
                
                {/* Performance Index & Unified Metrics */}
                <div className={`p-4 md:p-6 xl:p-8 rounded-[24px] md:rounded-[30px] xl:rounded-[40px] border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-3xl relative overflow-hidden group flex flex-col`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
                        <div>
                            <h3 className={`text-base xl:text-lg font-black italic uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Performance Index</h3>
                            <p className="text-[9px] xl:text-[10px] font-black text-slate-500 uppercase tracking-widest">Synergy Engagement Report</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center">
                        <SyncLevelGauge syncLevel={syncLevel} isDark={isDark} />

                        <div className="grid grid-cols-3 gap-2 w-full mt-6 xl:mt-10 pt-6 xl:pt-8 border-t border-white/5 items-start">
                            
                            <div className="text-center group/item flex flex-col items-center">
                                <div className="text-[8px] xl:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover/item:text-indigo-400 transition-colors">Avg Eff</div>
                                <div className={`text-base xl:text-lg font-black italic ${isDark ? 'text-white' : 'text-slate-900'}`}>{weekAvgEfficiency}%</div>
                                {trends.eff !== 0 && (
                                    <div className={`flex items-center gap-0.5 mt-1 text-[9px] font-black italic ${trends.eff > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {trends.eff > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                        {Math.abs(trends.eff)}%
                                    </div>
                                )}
                            </div>
                            
                            <div className="text-center group/item flex flex-col items-center relative">
                                <div className="absolute -left-1/2 w-px h-8 bg-black/5 dark:bg-white/5 top-2" />
                                <div className="text-[8px] xl:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover/item:text-emerald-400 transition-colors">Peak</div>
                                <div className={`text-base xl:text-lg font-black italic uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>{bestDay}</div>
                                <div className="absolute -right-1/2 w-px h-8 bg-black/5 dark:bg-white/5 top-2" />
                            </div>
                            
                            <div className="text-center group/item flex flex-col items-center">
                                <div className="text-[8px] xl:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover/item:text-orange-400 transition-colors">Habits</div>
                                <div className={`text-base xl:text-lg font-black italic ${isDark ? 'text-white' : 'text-slate-900'}`}>{habitPct}%</div>
                                {trends.habit !== 0 && (
                                    <div className={`flex items-center gap-0.5 mt-1 text-[9px] font-black italic ${trends.habit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {trends.habit > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                        {Math.abs(trends.habit)}%
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Efficiency Engine & Insights Stack */}
                <div className="flex flex-col gap-4 xl:gap-6 h-full">
                    
                    {/* Insights Box */}
                    <div className={`p-4 xl:p-6 rounded-[24px] xl:rounded-[30px] border ${isDark ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-100 shadow-sm'} flex items-start gap-4`}>
                        <div className={`shrink-0 w-8 h-8 xl:w-10 xl:h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-600 text-white shadow-md'}`}>
                            <BrainCircuit size={16} />
                        </div>
                        <div>
                            <h4 className={`text-[10px] xl:text-xs font-black uppercase tracking-widest mb-1 ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>Tactical AI Insight</h4>
                            <p className={`text-xs xl:text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} leading-snug`}>
                                {insightText}
                            </p>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className={`flex-1 p-4 md:p-6 xl:p-8 rounded-[24px] md:rounded-[30px] xl:rounded-[40px] border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-3xl relative overflow-hidden flex flex-col`}>
                        <div className="mb-6 xl:mb-10">
                            <h3 className={`text-base xl:text-lg font-black italic uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Efficiency Engine</h3>
                            <p className="text-[9px] xl:text-[10px] font-black text-slate-500 uppercase tracking-widest">7-Day Trajectory</p>
                        </div>

                        <div className="flex-1 flex flex-col justify-center min-h-[200px] xl:min-h-[250px]">
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
            </div>
            
            {/* ── Gamification HUB ── */}
            <div className={`p-4 md:p-6 xl:p-8 rounded-[24px] md:rounded-[30px] xl:rounded-[40px] border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-3xl relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-yellow-500/10 transition-colors duration-700"></div>
                
                <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
                    {/* Rank Badge */}
                    <div className="relative shrink-0">
                        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-[32px] md:rounded-[40px] flex items-center justify-center border-2 rotate-3 group-hover:rotate-6 transition-all duration-700 ${
                            isDark ? 'bg-yellow-500/10 border-yellow-500/20 shadow-[0_0_40px_rgba(234,179,8,0.1)]' : 'bg-yellow-50 border-yellow-200 shadow-lg'
                        }`}>
                            <div className="flex flex-col items-center">
                                <Star size={48} className="text-yellow-500 animate-pulse mb-2" fill="currentColor" />
                                <span className={`text-3xl md:text-4xl font-black italic uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{analytics.level || 1}</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -left-2 px-4 py-1.5 bg-yellow-500 text-black text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg transform -rotate-3">
                            Rank {analytics.levelTitle || 'Novice'}
                        </div>
                    </div>

                    <div className="flex-1 w-full flex flex-col justify-center">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <h3 className={`text-lg md:text-xl font-black italic uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Operator Progression</h3>
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Synergy XP Protocol</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-2xl font-black italic ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>XP {analytics.totalXP || 0}</span>
                            </div>
                        </div>

                        {analytics.xpProgress && (
                            <div className="space-y-3">
                                <div className={`h-4 w-full ${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-2xl overflow-hidden border border-white/5 p-1`}>
                                    <div 
                                        className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-500 rounded-xl relative transition-all duration-1000 animate-gradient-shift bg-[length:200%_auto]"
                                        style={{ width: `${analytics.xpProgress.percent}%` }}
                                    >
                                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/20 blur-[1px]"></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <div className="flex items-center gap-2">
                                        <Target size={12} className="text-slate-500" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Next Target: <span className="text-yellow-500">{analytics.xpProgress.nextThreshold} XP</span></span>
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{analytics.xpProgress.percent}% Sync</span>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                            {[
                                { icon: <CheckCircle2 size={14} />, label: 'Tasks', value: `${analytics.totalXP ? Math.round(analytics.totalXP * 0.4) : 0}`, color: 'text-indigo-400' },
                                { icon: <Flame size={14} />, label: 'Habits', value: `${analytics.totalXP ? Math.round(analytics.totalXP * 0.6) : 0}`, color: 'text-orange-400' },
                                { icon: <ShieldCheck size={14} />, label: 'Consistency', value: 'High', color: 'text-emerald-400' },
                                { icon: <Zap size={14} />, label: 'Pulse', value: 'Active', color: 'text-yellow-400' },
                            ].map((item, i) => (
                                <div key={i} className={`p-3 rounded-2xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-slate-100'} flex items-center gap-3`}>
                                    <div className={`${item.color}`}>{item.icon}</div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                                        <span className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Operational History ── */}
            <div className={`p-4 md:p-6 xl:p-8 rounded-[24px] md:rounded-[30px] xl:rounded-[40px] border ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-3xl relative overflow-hidden`}>
                <div className="flex items-center justify-between mb-6 xl:mb-8">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 xl:w-10 xl:h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/5 border-white/10 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-600'}`}>
                            <Activity size={16} />
                        </div>
                        <div>
                            <h3 className={`text-base xl:text-lg font-black italic uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Mission History</h3>
                            <p className="text-[8px] xl:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Detailed Operational Logs</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className={`flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg border ${isDark ? 'bg-indigo-500/5 border-indigo-500/10' : 'bg-indigo-50 border-indigo-200'}`}>
                            <CheckCircle2 size={10} className="text-indigo-400 xl:text-[12px]" />
                            <span className="text-[9px] xl:text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">Tasks</span>
                        </div>
                        <div className={`flex items-center gap-1.5 xl:gap-2 px-2 xl:px-3 py-1 xl:py-1.5 rounded-lg border ${isDark ? 'bg-orange-500/5 border-orange-500/10' : 'bg-orange-50 border-orange-200'}`}>
                            <Flame size={10} className="text-orange-400 xl:text-[12px]" />
                            <span className="text-[9px] xl:text-[10px] font-black text-slate-500 uppercase tracking-widest hidden sm:block">Habits</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {historyRows.map((row, i) => {
                        const isToday = i === 0;
                        return (
                            <div key={row.day + i} className={`group flex flex-col sm:flex-row sm:items-center gap-4 xl:gap-6 p-3 md:p-4 rounded-2xl md:rounded-3xl border transition-all duration-300 ${isToday ? (isDark ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-indigo-50/50 border-indigo-200') : (isDark ? 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/5' : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200')}`}>
                                <div className="w-full sm:w-12 flex flex-row sm:flex-col items-center justify-between sm:justify-center">
                                    <span className={`text-[11px] xl:text-[12px] font-black uppercase tracking-widest ${isToday ? 'text-indigo-500' : 'text-slate-500'}`}>{row.day}</span>
                                    {isToday && <span className="text-[8px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">NOW</span>}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[8px] xl:text-[9px] font-black text-slate-600 uppercase tracking-widest">Task Efficiency</span>
                                        <span className={`text-[10px] xl:text-[11px] font-black italic ${isDark ? 'text-white' : 'text-slate-900'}`}>{row.efficiency}%</span>
                                    </div>
                                    <div className={`h-1.5 w-full ${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-full overflow-hidden`}>
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full transition-all duration-1000"
                                            style={{ width: `${row.efficiency}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="w-full sm:w-48 flex justify-between sm:justify-end gap-6 items-center border-t sm:border-0 border-slate-200/20 pt-3 sm:pt-0">
                                    <div className="flex flex-col items-start sm:items-end">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</span>
                                        <span className="text-[10px] xl:text-[11px] font-black text-slate-500 italic">{row.completed}/{row.total} <small className="text-[8px] uppercase not-italic">Done</small></span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Habits</span>
                                        <span className="text-[10px] xl:text-[11px] font-black text-orange-500 italic">{row.habitRate}%</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {historyRows.length === 0 && (
                        <div className={`py-12 xl:py-24 text-center border border-dashed rounded-[30px] ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                            <LayoutGrid size={32} className="text-slate-400 mx-auto mb-4 opacity-50" />
                            <p className="text-[10px] xl:text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational data stream offline</p>
                            <p className="text-[8px] xl:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 italic">Awaiting first successful command execution</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
