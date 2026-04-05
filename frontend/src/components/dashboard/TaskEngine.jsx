import React from 'react';
import { ListTodo } from 'lucide-react';
import TaskItem from './TaskItem';

const TaskEngine = ({ filteredTasks, filter, setFilter, toggleTaskStatus, deleteTask, sortBy, setSortBy, sortOrder, setSortOrder }) => {
    return (
        <div className="space-y-6 lg:space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 lg:gap-6 relative p-5 lg:p-6 rounded-[24px] bg-white/[0.02] border border-white/5 overflow-hidden group">
                <div className="animate-precision-docking stagger-1">
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase">Mission Directive Log</h3>
                    <p className="text-slate-500 text-[9px] lg:text-[10px] mt-1 lg:mt-2 uppercase font-black tracking-[0.3em]">{filteredTasks.length} Directives active in current sector</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 lg:gap-4">
                    <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl self-start md:self-center backdrop-blur-md transition-all duration-300 hover:border-white/20 animate-precision-docking stagger-2">
                        {['all', 'pending', 'executed'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f === 'executed' ? 'completed' : f)}
                                className={`px-4 lg:px-6 py-2 rounded-xl text-[10px] lg:text-[11px] font-black uppercase tracking-wider transition-all duration-300 border border-white/5 cursor-pointer hover:scale-105 active:scale-95 ${filter === (f === 'executed' ? 'completed' : f)
                                    ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {f === 'all' ? 'System All' : f}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl self-start md:self-center backdrop-blur-md transition-all duration-300 hover:border-white/20 animate-precision-docking stagger-3">
                        <button
                            onClick={() => {
                                if (sortBy === 'priority') {
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                } else {
                                    setSortBy('priority');
                                    setSortOrder('asc');
                                }
                            }}
                            className={`px-3 lg:px-4 py-2 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-white/5 cursor-pointer ${sortBy === 'priority' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'text-slate-500 hover:text-white'}`}
                        >
                            Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                        <button
                            onClick={() => {
                                if (sortBy === 'time') {
                                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                } else {
                                    setSortBy('time');
                                    setSortOrder('asc');
                                }
                            }}
                            className={`px-3 lg:px-4 py-2 rounded-xl text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all duration-300 border border-white/5 cursor-pointer ${sortBy === 'time' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' : 'text-slate-500 hover:text-white'}`}
                        >
                            Time Left {sortBy === 'time' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredTasks.map((task, i) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggleStatus={toggleTaskStatus}
                        onDelete={deleteTask}
                        staggerClass={`stagger-${(i % 5) + 3}`}
                    />
                ))}

                {filteredTasks.length === 0 && (
                    <div className="py-16 lg:py-24 flex flex-col items-center justify-center text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[32px] animate-precision-docking stagger-4">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-700 mb-4 lg:mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                            <ListTodo size={32} />
                        </div>
                        <p className="text-lg lg:text-xl font-black text-slate-600 uppercase italic tracking-widest">Sector Clear</p>
                        <p className="text-slate-500 text-[9px] lg:text-[10px] mt-2 lg:mt-3 font-black uppercase tracking-[0.3em]">Frequency clear. Awaiting new instructions.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskEngine;
