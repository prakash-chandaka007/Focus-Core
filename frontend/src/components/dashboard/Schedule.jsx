import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, AlignLeft, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Schedule = ({ user }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({
        text: '',
        priority: 'Medium',
        category: 'Work',
        startTime: '09:00',
        duration: 30
    });

    const fetchTasks = async () => {
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const res = await api.get(`/tasks?date=${dateStr}`);
            setTasks(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [selectedDate]);

    const calendarGrid = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const grid = [];
        // Padding for previous month
        for (let i = 0; i < firstDay; i++) {
            grid.push(null);
        }
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            grid.push(new Date(year, month, i));
        }
        return grid;
    }, [viewDate]);

    const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            await api.post('/tasks', {
                ...newTask,
                scheduledDate: dateStr
            });
            setShowTaskForm(false);
            setNewTask({ text: '', priority: 'Medium', category: 'Work', startTime: '09:00', duration: 30 });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    const isToday = (date) => {
        const today = new Date();
        return date && date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date) => {
        return date && date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth() && date.getFullYear() === selectedDate.getFullYear();
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-precision-docking">
            {/* Calendar Side */}
            <div className="xl:col-span-5 space-y-6">
                <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">
                                {MONTHS[viewDate.getMonth()]} <span className="text-indigo-500">{viewDate.getFullYear()}</span>
                            </h2>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Strategic Planning Phase</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handlePrevMonth} className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={handleNextMonth} className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-4">
                        {DAYS.map(day => (
                            <div key={day} className="text-center py-2">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{day}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {calendarGrid.map((date, i) => {
                            if (!date) return <div key={`pad-${i}`} className="aspect-square" />;

                            const tdy = isToday(date);
                            const sel = isSelected(date);

                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(date)}
                                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 relative group cursor-pointer
                                        ${sel
                                            ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-110 z-10'
                                            : tdy
                                                ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-400'
                                                : 'hover:bg-white/5 text-slate-400 border border-transparent'
                                        }`}
                                >
                                    <span className="text-sm font-black italic">{date.getDate()}</span>
                                    {tdy && !sel && <div className="absolute bottom-2 w-1 h-1 rounded-full bg-indigo-500" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-8 rounded-[40px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                            <Plus size={24} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Deploy Task</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule for {selectedDate.toDateString()}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowTaskForm(!showTaskForm)}
                        className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] cursor-pointer"
                    >
                        Initialize Creation Protocol
                    </button>
                </div>
            </div>

            {/* Agenda Side */}
            <div className="xl:col-span-7 space-y-6">
                <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/10 backdrop-blur-3xl min-h-[600px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Operational <span className="text-indigo-400">Agenda</span></h2>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Timeline for {selectedDate.toDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{tasks.length} Active</span>
                            </div>
                        </div>
                    </div>

                    {showTaskForm && (
                        <form onSubmit={handleCreateTask} className="mb-8 p-6 rounded-3xl bg-white/5 border border-white/10 animate-precision-docking">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Task Objective</label>
                                    <input
                                        type="text" required
                                        value={newTask.text}
                                        onChange={e => setNewTask({ ...newTask, text: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 outline-none transition-all"
                                        placeholder="Define mission objective..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Start Time</label>
                                    <div className="relative">
                                        <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                                        <input
                                            type="time" required
                                            value={newTask.startTime}
                                            onChange={e => setNewTask({ ...newTask, startTime: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Duration (min)</label>
                                    <input
                                        type="number" required
                                        value={newTask.duration}
                                        onChange={e => setNewTask({ ...newTask, duration: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowTaskForm(false)}
                                        className="px-6 py-2 rounded-xl text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all cursor-pointer"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-2 rounded-xl bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-500/20 cursor-pointer"
                                    >
                                        Engage
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center h-full opacity-20">
                                <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center flex-1 py-20 opacity-20 border border-dashed border-white/10 rounded-[40px]">
                                <CalendarIcon size={48} className="text-slate-500 mb-6" />
                                <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em]">Zero Encounters Found</p>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2 italic">Awaiting tactical deployment commands</p>
                            </div>
                        ) : (
                            tasks.map((task, i) => (
                                <div key={task._id} className="group p-6 rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-indigo-500/20 hover:bg-white/[0.05] transition-all duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="shrink-0 flex flex-col items-center gap-1">
                                            <span className="text-[11px] font-black text-indigo-400 italic">{task.startTime || '--:--'}</span>
                                            <div className="w-0.5 h-8 bg-white/5 group-last:hidden" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${task.priority === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                    task.priority === 'Medium' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                                                        'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                                    }`}>
                                                    {task.priority} Priority
                                                </span>
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{task.duration} MIN</span>
                                            </div>
                                            <h4 className="text-[15px] font-black text-white italic truncate group-hover:text-indigo-300 transition-colors uppercase">{task.text}</h4>
                                        </div>
                                        <button className="p-3 rounded-2xl bg-white/5 border border-white/5 text-slate-600 hover:text-indigo-400 hover:border-indigo-500/20 transition-all cursor-pointer">
                                            {task.status === 'completed' ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Circle size={16} />}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
