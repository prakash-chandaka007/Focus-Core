import React, { useMemo } from 'react';
import { TrendingUp, Activity, Zap, CheckCircle2, Flame } from 'lucide-react';

// ── SVG Bar Chart ──────────────────────────────────────────────────────────────
const EfficiencyChart = ({ weeklyTaskData }) => {
    const maxVal = 100;
    const chartH = 140;
    const chartW = 100; // percent-based via viewBox
    const barW = 10;
    const gap = (chartW - weeklyTaskData.length * barW) / (weeklyTaskData.length + 1);

    return (
        <div className="w-full">
            <svg
                viewBox={`0 0 ${chartW} ${chartH + 24}`}
                className="w-full overflow-visible"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Grid lines */}
                {[0, 25, 50, 75, 100].map(pct => {
                    const y = chartH - (chartH * pct / maxVal);
                    return (
                        <g key={pct}>
                            <line x1="0" y1={y} x2={chartW} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
                            <text x="-1" y={y + 1} textAnchor="end" fontSize="3.5" fill="rgba(255,255,255,0.2)" fontWeight="700">
                                {pct}
                            </text>
                        </g>
                    );
                })}

                {/* Bars */}
                {weeklyTaskData.map((d, i) => {
                    const x = gap + i * (barW + gap);
                    const barH = chartH * (d.efficiency / maxVal);
                    const y = chartH - barH;
                    const isToday = i === weeklyTaskData.length - 1;

                    return (
                        <g key={d.day}>
                            {/* Background track */}
                            <rect x={x} y={0} width={barW} height={chartH} rx="3" ry="3" fill="rgba(255,255,255,0.03)" />

                            {/* Value bar */}
                            <defs>
                                <linearGradient id={`bar-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={isToday ? '#818cf8' : '#6366f1'} stopOpacity="0.9" />
                                    <stop offset="100%" stopColor={isToday ? '#60a5fa' : '#4338ca'} stopOpacity="0.6" />
                                </linearGradient>
                            </defs>
                            <rect
                                x={x} y={y}
                                width={barW} height={barH}
                                rx="3" ry="3"
                                fill={`url(#bar-grad-${i})`}
                                style={{ filter: isToday ? 'drop-shadow(0 0 4px rgba(99,102,241,0.6))' : 'none' }}
                            />

                            {/* Value label on top */}
                            {d.efficiency > 0 && (
                                <text
                                    x={x + barW / 2} y={y - 2}
                                    textAnchor="middle" fontSize="3.5"
                                    fill={isToday ? '#a5b4fc' : 'rgba(255,255,255,0.4)'}
                                    fontWeight="700"
                                >
                                    {d.efficiency}%
                                </text>
                            )}

                            {/* Day label */}
                            <text
                                x={x + barW / 2} y={chartH + 10}
                                textAnchor="middle" fontSize="4"
                                fill={isToday ? '#a5b4fc' : 'rgba(255,255,255,0.3)'}
                                fontWeight="900"
                            >
                                {d.day}
                            </text>
                            {isToday && (
                                <text
                                    x={x + barW / 2} y={chartH + 16}
                                    textAnchor="middle" fontSize="3"
                                    fill="rgba(165,180,252,0.5)"
                                    fontWeight="700"
                                >
                                    TODAY
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

// ── Sync Level Gauge ───────────────────────────────────────────────────────────
const SyncLevelGauge = ({ syncLevel, taskPct, habitPct }) => {
    const r = 80;
    const cx = 100;
    const cy = 100;
    const circumference = Math.PI * r; // semi-circle
    const arcLength = circumference;
    const filled = arcLength * (syncLevel / 100);

    // color transitions: red → amber → indigo → emerald
    const color = syncLevel < 30 ? '#ef4444' : syncLevel < 60 ? '#f59e0b' : syncLevel < 80 ? '#818cf8' : '#34d399';

    return (
        <div className="flex flex-col items-center">
            <svg viewBox="0 0 200 120" className="w-full max-w-[280px]">
                {/* Background arc */}
                <path
                    d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                    fill="none"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="16"
                    strokeLinecap="round"
                />
                {/* Value arc */}
                <path
                    d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                    fill="none"
                    stroke={color}
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray={`${filled} ${arcLength}`}
                    style={{
                        transition: 'stroke-dasharray 1.5s cubic-bezier(0, 0, 0.2, 1)',
                        filter: `drop-shadow(0 0 8px ${color}80)`
                    }}
                />
                {/* Center text */}
                <text x={cx} y={cy - 8} textAnchor="middle" fontSize="32" fill="white" fontWeight="900" fontStyle="italic">
                    {syncLevel}
                </text>
                <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)" fontWeight="700" letterSpacing="3">
                    SYNC LEVEL
                </text>
                {/* Tick marks */}
                {[0, 25, 50, 75, 100].map(pct => {
                    const angle = Math.PI * (1 - pct / 100);
                    const tx = cx + r * Math.cos(angle);
                    const ty = cy - r * Math.sin(angle);
                    return (
                        <circle key={pct} cx={tx} cy={ty} r="2" fill="rgba(255,255,255,0.15)" />
                    );
                })}
            </svg>
            {/* Breakdown */}
            <div className="flex gap-6 mt-2">
                <div className="text-center">
                    <div className="text-lg font-black text-indigo-400 italic">{taskPct}%</div>
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Tasks</div>
                </div>
                <div className="w-px h-8 bg-white/10 self-center" />
                <div className="text-center">
                    <div className="text-lg font-black text-orange-400 italic">{habitPct}%</div>
                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Habits</div>
                </div>
            </div>
        </div>
    );
};

// ── Weekly History Row ─────────────────────────────────────────────────────────
const HistoryRow = ({ row, index }) => {
    const isToday = index === 6;
    return (
        <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${isToday ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-white/[0.03] border border-transparent'}`}>
            <div className={`text-[11px] font-black uppercase tracking-widest w-10 shrink-0 ${isToday ? 'text-indigo-400' : 'text-slate-500'}`}>
                {row.day}
                {isToday && <div className="text-[8px] text-indigo-500/70 tracking-wider">Today</div>}
            </div>
            <div className="flex-1 flex items-center gap-3">
                {/* Task bar */}
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all duration-700"
                        style={{ width: `${row.efficiency}%` }}
                    />
                </div>
                <span className="text-[11px] font-black text-white italic w-10 text-right">{row.efficiency}%</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={10} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-slate-400">{row.completed}/{row.total}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Flame size={10} className="text-orange-400" />
                    <span className="text-[10px] font-black text-slate-400">{row.habitRate ?? 0}%</span>
                </div>
            </div>
        </div>
    );
};

// ── Main Analytics Component ───────────────────────────────────────────────────
const Analytics = ({ analytics }) => {
    const { weeklyTaskData = [], weeklyHabitData = [], syncLevel = 0, taskPct = 0, habitPct = 0 } = analytics || {};

    // Merge habit rate into weeklyTaskData for history rows
    const historyRows = useMemo(() => weeklyTaskData.map((d, i) => ({
        ...d,
        habitRate: weeklyHabitData[i]?.rate ?? 0
    })), [weeklyTaskData, weeklyHabitData]);

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
        <div className="space-y-8 animate-precision-docking stagger-1">
            {/* ── Header ────────────────────────────────────── */}
            <div className="p-8 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-cyan-500/5 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        {/* <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Module 4 // Focus Meter</span> */}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-[-0.04em] italic uppercase">
                        Analytics <span className="text-cyan-400">&amp; Insights</span>
                    </h2>
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-2">
                        Last 7 days · Live performance data
                    </p>
                </div>
            </div>

            {/* ── Main Grid ─────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

                {/* Sync Level Gauge */}
                <div className="xl:col-span-4 p-6 md:p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center gap-4 animate-precision-docking stagger-2">
                    <div className="w-full flex items-center justify-between mb-2">
                        <h3 className="text-[11px] font-black text-white uppercase tracking-widest italic">Sync Level</h3>
                        <div className="flex items-center gap-1.5">
                            <Zap size={10} className="text-cyan-400" />
                            <span className="text-[9px] font-black text-cyan-400/60 uppercase tracking-widest">Live</span>
                        </div>
                    </div>
                    <SyncLevelGauge syncLevel={syncLevel} taskPct={taskPct} habitPct={habitPct} />
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest text-center mt-2">
                        Tasks × 0.6 + Habits × 0.4
                    </p>
                </div>

                {/* Efficiency Bar Chart */}
                <div className="xl:col-span-8 p-6 md:p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl animate-precision-docking stagger-3">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-[11px] font-black text-white uppercase tracking-widest italic">Efficiency</h3>
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-0.5">Task completion rate per day</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-xl font-black text-indigo-400 italic">{weekAvgEfficiency}%</div>
                                <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">7-day avg</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-black text-cyan-400 italic">{bestDay}</div>
                                <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Best day</div>
                            </div>
                        </div>
                    </div>
                    <EfficiencyChart weeklyTaskData={weeklyTaskData.length ? weeklyTaskData : Array.from({ length: 7 }, (_, i) => ({
                        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(new Date().getDay() - 6 + i + 7) % 7],
                        efficiency: 0, completed: 0, total: 0
                    }))} />
                </div>
            </div>

            {/* ── Weekly History Table ───────────────────────── */}
            <div className="p-6 md:p-8 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl animate-precision-docking stagger-4">
                <div className="flex items-center gap-3 mb-6">
                    <Activity size={16} className="text-indigo-400" />
                    <h3 className="text-[11px] font-black text-white uppercase tracking-widest italic">Weekly History</h3>
                </div>
                {/* Column headers */}
                <div className="flex items-center gap-4 px-4 mb-3">
                    <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest w-10 shrink-0">Day</div>
                    <div className="flex-1 text-[8px] font-black text-slate-700 uppercase tracking-widest">Task Efficiency</div>
                    <div className="text-[8px] font-black text-slate-700 uppercase tracking-widest shrink-0 w-36 text-right">Tasks / Habits</div>
                </div>
                <div className="space-y-1">
                    {historyRows.map((row, i) => (
                        <HistoryRow key={row.day + i} row={row} index={i} />
                    ))}
                    {historyRows.length === 0 && (
                        <div className="py-12 text-center">
                            <TrendingUp size={32} className="text-slate-800 mx-auto mb-3" />
                            <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest">No data yet — complete tasks and habits to populate history</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
