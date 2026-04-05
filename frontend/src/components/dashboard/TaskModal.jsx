import React from 'react';
import { X, ChevronDown, Clock } from 'lucide-react';

const TaskModal = ({ isModalOpen, setIsModalOpen, addTask, newTask, setNewTask }) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-[#0a0a0c] border border-white/10 rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] -mr-32 -mt-32"></div>

                <div className="flex items-center justify-between mb-6 lg:mb-8 relative z-10">
                    <h3 className="text-xl lg:text-2xl font-black text-white italic uppercase tracking-tighter">New Task Initialization</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={addTask} className="space-y-4 lg:space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Objective</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="E.g., Complete UI Mockups"
                            className="w-full bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-3 lg:p-4 text-sm lg:text-base text-white font-bold italic focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-700"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Directive Sector</label>
                            <input
                                type="text"
                                placeholder="Alpha / Beta / Gamma"
                                className="w-full bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-3 lg:p-4 text-sm lg:text-base text-white font-bold italic focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-700"
                                value={newTask.category}
                                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Threat Level</label>
                            <div className="relative">
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-3 lg:p-4 text-sm lg:text-base text-white font-bold italic focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer pr-10"
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                >
                                    <option value="low" className="bg-[#0a0a0c]">NOMINAL</option>
                                    <option value="medium" className="bg-[#0a0a0c]">ELEVATED</option>
                                    <option value="high" className="bg-[#0a0a0c]">CRITICAL</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Scheduled Date</label>
                            <input
                                type="date"
                                className="w-full bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-3 lg:p-4 text-sm lg:text-base text-white font-bold italic focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                                value={newTask.scheduledDate || ''}
                                onChange={(e) => setNewTask({ ...newTask, scheduledDate: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Start Time</label>
                            <div className="relative">
                                <input
                                    type="time"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-3 lg:p-4 text-sm lg:text-base text-white font-bold italic focus:border-indigo-500 focus:outline-none appearance-none pr-10"
                                    value={newTask.startTime || ''}
                                    onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
                                />
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                    <Clock size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mission Duration</label>
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Amount"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl p-3 lg:p-4 text-sm lg:text-base text-white font-bold italic focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-700"
                                    value={newTask.durationValue || ''}
                                    onChange={(e) => setNewTask({ ...newTask, durationValue: parseInt(e.target.value) || 0 })}
                                />
                                <div className="relative">
                                    <select
                                        className="h-full bg-white/5 border border-white/10 rounded-xl lg:rounded-2xl px-3 lg:px-4 pr-8 text-sm lg:text-base text-white font-bold italic focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer"
                                        value={newTask.durationUnit || 'minutes'}
                                        onChange={(e) => setNewTask({ ...newTask, durationUnit: e.target.value })}
                                    >
                                        <option value="minutes" className="bg-[#0a0a0c]">Minutes</option>
                                        <option value="hours" className="bg-[#0a0a0c]">Hours</option>
                                        <option value="days" className="bg-[#0a0a0c]">Days</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(newTask.durationValue > 0 || newTask.scheduledDate) && (() => {
                            const unit = newTask.durationUnit || 'minutes';
                            const multiplier = unit === 'days' ? 86400000 : unit === 'hours' ? 3600000 : 60000;
                            const totalMs = (newTask.durationValue || 0) * multiplier;

                            let baseTime = Date.now();
                            if (newTask.scheduledDate) {
                                baseTime = new Date(newTask.scheduledDate).getTime();
                                if (newTask.startTime) {
                                    const [h, m] = newTask.startTime.split(':');
                                    const d = new Date(newTask.scheduledDate);
                                    d.setHours(parseInt(h), parseInt(m));
                                    baseTime = d.getTime();
                                }
                            }

                            const deadline = new Date(baseTime + totalMs);
                            const isSameDay = deadline.toDateString() === new Date().toDateString();
                            const dateStr = isSameDay
                                ? deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : deadline.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                            return (
                                <div className="flex items-center gap-3 px-5 py-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl animate-in slide-in-from-top-2 duration-300">
                                    <Clock size={14} className="text-indigo-400" />
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                                        {newTask.durationValue > 0 ? `Projected Deadline: ${dateStr}` : `Starts at: ${dateStr}`}
                                    </span>
                                </div>
                            );
                        })()}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 lg:py-4 rounded-xl lg:rounded-2xl font-black uppercase tracking-[0.15em] shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transform hover:-translate-y-1 transition-all border-none cursor-pointer flex items-center justify-center gap-2"
                    >
                        <span className="italic">Authorize Directive</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
