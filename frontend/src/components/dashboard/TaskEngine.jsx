import React from 'react';
import { ListTodo } from 'lucide-react';
import TaskItem from './TaskItem';

const TaskEngine = ({ filteredTasks, filter, setFilter, toggleTaskStatus, deleteTask }) => {
    return (
        <div className="space-y-8 animate-reveal-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter italic uppercase">Mission Log</h3>
                    <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-widest">{filteredTasks.length} Tasks active in current view</p>
                </div>

                <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl self-start md:self-center backdrop-blur-md transition-all duration-300 hover:border-white/20">
                    {['all', 'pending', 'completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 border border-white/5 cursor-pointer hover:scale-105 active:scale-95 ${filter === f
                                ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                                : 'text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredTasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onToggleStatus={toggleTaskStatus}
                        onDelete={deleteTask}
                    />
                ))}

                {filteredTasks.length === 0 && (
                    <div className="py-24 flex flex-col items-center justify-center text-center bg-white/[0.01] border border-dashed border-white/10 rounded-[48px]">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-700 mb-6">
                            <ListTodo size={40} />
                        </div>
                        <p className="text-xl font-black text-slate-600 uppercase italic tracking-widest">Sector Clear</p>
                        <p className="text-slate-500 text-sm mt-2 font-medium">No tasks found in this frequency.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskEngine;
