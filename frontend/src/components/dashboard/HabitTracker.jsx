import React, { useState } from 'react';
import {
    Flame, Plus, Trash2, CheckCircle2, Target, ChevronDown, ChevronUp, Zap, CalendarDays
} from 'lucide-react';

const CATEGORIES = ['General', 'Health', 'Productivity', 'Fitness', 'Mindfulness', 'Learning', 'Social'];
const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const CATEGORY_COLORS = {
    Health: { bar: 'from-emerald-500 to-green-400', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    Productivity: { bar: 'from-indigo-500 to-blue-400', badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    Fitness: { bar: 'from-orange-500 to-yellow-400', badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    Mindfulness: { bar: 'from-purple-500 to-violet-400', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    Learning: { bar: 'from-cyan-500 to-sky-400', badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    Social: { bar: 'from-pink-500 to-rose-400', badge: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
    General: { bar: 'from-slate-500 to-slate-400', badge: 'bg-slate-500/20 text-slate-400 border-slate-500/30' },
};

// ── Progress Bar ───────────────────────────────────────────────────────────────
const ProgressBar = ({ value, max, category }) => {
    const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
    const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.General;
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Progress</span>
                <span className="text-[11px] font-black text-white italic">{value} / {max} Limit</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <div
                    className={`h-full bg-gradient-to-r ${colors.bar} transition-all duration-700 ease-out rounded-full`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

// ── Habit Card ─────────────────────────────────────────────────────────────────
const HabitCard = ({ habit, onIncrement, onDelete, index }) => {
    const colors = CATEGORY_COLORS[habit.category] || CATEGORY_COLORS.General;
    const isDone = habit.completedToday >= habit.goalFrequency;
    const pct = habit.goalFrequency > 0
        ? Math.min(Math.round((habit.completedToday / habit.goalFrequency) * 100), 100)
        : 0;

    const targetDays = habit.targetDays || [0, 1, 2, 3, 4, 5, 6];
    const todayIndex = new Date().getDay();
    const isDueToday = targetDays.includes(todayIndex);

    return (
        <div className={`relative group p-6 rounded-[28px] bg-white/[0.03] border border-white/[0.07] hover:border-indigo-500/30 hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-500 backdrop-blur-md animate-precision-docking stagger-${(index % 8) + 2} overflow-hidden hover-glow`}>
            {/* Done overlay glow */}
            {isDone && (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none rounded-[28px]" />
            )}

            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[9px] font-black uppercase tracking-[0.25em] px-2 py-0.5 rounded-full border ${colors.badge}`}>
                            {habit.category}
                        </span>
                        {isDone && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                <CheckCircle2 size={8} /> COMPLETED
                            </span>
                        )}
                        {!isDueToday && !isDone && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 flex items-center gap-1">
                                <CalendarDays size={8} /> OFF DAY
                            </span>
                        )}
                    </div>
                    <h3 className="text-[15px] font-black text-white tracking-tight italic uppercase truncate leading-tight group-hover:text-indigo-300 transition-colors duration-300">
                        {habit.name}
                    </h3>
                </div>

                {/* Streak pill */}
                <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-1.5 shrink-0">
                    <Flame size={12} className="text-orange-400" />
                    <span className="text-[11px] font-black text-orange-300 italic">{habit.streak}</span>
                    <span className="text-[8px] font-black text-orange-500/60 uppercase tracking-wider">days</span>
                </div>
            </div>

            {/* Target Days Indicator */}
            <div className="flex gap-1 mb-4">
                {DAYS_OF_WEEK.map((day, i) => {
                    const isActive = targetDays.includes(i);
                    const isToday = todayIndex === i;
                    return (
                        <div
                            key={i}
                            className={`w-5 h-5 flex items-center justify-center rounded-full text-[8px] font-black transition-all ${isActive
                                    ? isToday ? 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-white/10 text-white'
                                    : 'bg-white/[0.02] text-slate-600'
                                }`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            {/* Progress */}
            <div className="mb-5">
                <ProgressBar value={habit.completedToday} max={habit.goalFrequency} category={habit.category} />
                <p className="text-[9px] text-slate-600 mt-1.5 font-black uppercase tracking-widest">
                    {pct}% of {habit.goalFrequency} Max Daily Limit
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onIncrement(habit._id)}
                    disabled={isDone || !isDueToday}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all duration-300
                        ${isDone
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 cursor-not-allowed'
                            : !isDueToday
                                ? 'bg-slate-500/5 border-slate-500/20 text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/25 hover:text-white active:scale-95 cursor-pointer'
                        }`}
                >
                    {isDone ? (
                        <><CheckCircle2 size={12} /> Limit Reached</>
                    ) : !isDueToday ? (
                        <><CalendarDays size={12} /> Off Day</>
                    ) : (
                        <><Zap size={12} /> Log Progress</>
                    )}
                </button>
                <button
                    onClick={() => onDelete(habit._id)}
                    className="p-2.5 rounded-2xl border border-white/5 text-slate-600 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

// ── Create Form ────────────────────────────────────────────────────────────────
const CreateForm = ({ onSubmit, onClose }) => {
    const [form, setForm] = useState({ name: '', category: 'General', goalFrequency: 1, targetDays: [0, 1, 2, 3, 4, 5, 6] });

    const toggleDay = (dayIndex) => {
        setForm(prev => {
            const newDays = prev.targetDays.includes(dayIndex)
                ? prev.targetDays.filter(d => d !== dayIndex)
                : [...prev.targetDays, dayIndex];
            // Ensure at least one day is selected
            if (newDays.length === 0) return prev;
            return { ...prev, targetDays: newDays.sort() };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        onSubmit(form);
        onClose();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 p-6 rounded-[28px] bg-indigo-500/5 border border-indigo-500/20 backdrop-blur-xl animate-precision-docking stagger-1"
        >
            <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">New Habit</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {/* Name */}
                <div className="md:col-span-2">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Habit Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Morning Run…"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[13px] font-black text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.08] transition-all duration-300"
                        autoFocus
                    />
                </div>
                {/* Category */}
                <div className="md:col-span-1">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
                    <select
                        value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[13px] font-black text-white focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.08] transition-all duration-300 cursor-pointer appearance-none"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>)}
                    </select>
                </div>
                {/* Frequency */}
                <div className="md:col-span-1">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Daily Limit</label>
                    <input
                        type="number"
                        min={1}
                        max={50}
                        value={form.goalFrequency}
                        onChange={e => setForm({ ...form, goalFrequency: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-[13px] font-black text-white focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.08] transition-all duration-300"
                    />
                </div>
            </div>

            {/* Target Days Selector */}
            <div className="mb-6">
                <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Active Days</label>
                <div className="flex gap-2 flex-wrap">
                    {DAYS_OF_WEEK.map((day, idx) => {
                        const isSelected = form.targetDays.includes(idx);
                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => toggleDay(idx)}
                                className={`w-10 h-10 rounded-xl font-black text-[12px] transition-all duration-300 ${isSelected
                                        ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                                        : 'bg-white/5 border border-white/10 text-slate-500 hover:bg-white/10 hover:text-slate-300'
                                    }`}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex gap-3">
                <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 active:scale-95 cursor-pointer"
                >
                    <Plus size={14} /> Create Habit
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

// ── Main HabitTracker ──────────────────────────────────────────────────────────
const HabitTracker = ({ habits, onAddHabit, onIncrementHabit, onDeleteHabit }) => {
    const [showForm, setShowForm] = useState(false);
    const [filterCat, setFilterCat] = useState('All');
    const [showDueTodayOnly, setShowDueTodayOnly] = useState(false);

    const todayIndex = new Date().getDay();

    const allCategories = ['All', ...new Set(habits.map(h => h.category))];

    const filtered = habits.filter(h => {
        const catMatch = filterCat === 'All' || h.category === filterCat;
        const targetDays = h.targetDays || [0, 1, 2, 3, 4, 5, 6];
        const dueMatch = showDueTodayOnly ? targetDays.includes(todayIndex) : true;
        return catMatch && dueMatch;
    });

    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.completedToday >= h.goalFrequency).length;
    const overallRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    return (
        <div className="space-y-8 animate-precision-docking stagger-1">
            {/* ── Panel Header ─────────────────────────────────────── */}
            <div className="p-8 md:p-12 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/5 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-indigo-500/5 blur-[60px] rounded-full -ml-10 -mb-10 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            {/* <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.4em]">Module 3 // Habit Sync</span> */}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-[-0.04em] italic uppercase">
                            Habit <span className="text-orange-400">Tracker</span>
                        </h2>
                        <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-2">
                            {completedHabits}/{totalHabits} Habit completed today
                        </p>
                    </div>

                    {/* Summary stats */}
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-black text-white italic">{overallRate}%</div>
                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Today's Rate</div>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="text-center">
                            <div className="text-3xl font-black text-orange-400 italic">{totalHabits}</div>
                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Habits</div>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <button
                            onClick={() => setShowForm(v => !v)}
                            className="flex items-center gap-2 px-5 py-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 active:scale-95 cursor-pointer"
                        >
                            {showForm ? <ChevronUp size={14} /> : <Plus size={14} />}
                            {showForm ? 'Close' : 'New Habit'}
                        </button>
                    </div>
                </div>

                {/* Overall progress bar */}
                <div className="relative z-10 mt-6">
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 transition-all duration-1000 ease-out rounded-full"
                            style={{ width: `${overallRate}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ── Create Form ──────────────────────────────────────── */}
            {showForm && (
                <CreateForm onSubmit={onAddHabit} onClose={() => setShowForm(false)} />
            )}

            {/* ── Category & Due Today Filter ──────────────────────── */}
            {habits.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {allCategories.map(cat => {
                            const isActive = filterCat === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCat(cat)}
                                    className={`px-4 py-2 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer
                                        ${isActive
                                            ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                                            : 'bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-white hover:border-white/20'
                                        }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* Due Today Toggle */}
                    <button
                        onClick={() => setShowDueTodayOnly(!showDueTodayOnly)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer
                            ${showDueTodayOnly
                                ? 'bg-orange-500/20 border-orange-500/40 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                                : 'bg-white/[0.03] border-white/[0.07] text-slate-500 hover:text-white hover:border-white/20'
                            }`}
                    >
                        <CalendarDays size={12} />
                        Due Today Only
                    </button>
                </div>
            )}

            {/* ── Habit Grid ───────────────────────────────────────── */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 rounded-[28px] bg-white/[0.03] border border-white/[0.07] flex items-center justify-center mb-6">
                        <Target size={32} className="text-slate-700" />
                    </div>
                    <p className="text-[13px] font-black text-slate-500 uppercase tracking-widest italic">
                        {habits.length === 0 ? 'No Habits active' : 'No Habits found matching filter'}
                    </p>
                    <p className="text-[11px] font-black text-slate-700 uppercase tracking-wider mt-2">
                        {habits.length === 0 ? 'Create your first habit above' : 'Try a different category or disable "Due Today"'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filtered.map((habit, i) => (
                        <HabitCard
                            key={habit._id}
                            habit={habit}
                            index={i}
                            onIncrement={onIncrementHabit}
                            onDelete={onDeleteHabit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HabitTracker;
