import React from 'react';
import { Check, Trash2 } from 'lucide-react';

const TaskItem = ({ task, onToggleStatus, onDelete, staggerClass }) => {
    return (
        <div
            className={`group p-6 rounded-[32px] border transition-all duration-500 flex items-center justify-between animate-precision-docking ${staggerClass} hover-glow hover:scale-[1.01] ${task.status === 'completed'
                ? 'bg-indigo-500/5 border-indigo-500/20 opacity-70'
                : 'bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
        >
            <div className="flex items-center gap-8 flex-1">
                <div className="relative group/check">
                    <button
                        onClick={() => onToggleStatus(task.id)}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer relative z-10 ${task.status === 'completed'
                            ? 'bg-indigo-500 border-indigo-500 text-white'
                            : 'bg-transparent border-white/20 text-transparent hover:border-indigo-500 group-hover:text-indigo-500/50'
                            }`}
                    >
                        <Check size={20} />
                    </button>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] italic">{task.category || 'Alpha Sector'}</span>
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md border ${task.priority === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            task.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            }`}>
                            {task.priority === 'High' ? 'CRITICAL' : task.priority === 'Medium' ? 'ELEVATED' : 'NOMINAL'}
                        </span>
                    </div>
                    <p className={`text-xl font-bold tracking-tight italic transition-all ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'
                        }`}>
                        {task.title}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-6">
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">Entry Log</p>
                    <p className="text-[11px] text-slate-400 font-black tracking-tighter">{task.createdAt.toLocaleDateString()}</p>
                </div>
                <button
                    onClick={() => onDelete(task.id)}
                    className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500/50 hover:text-red-500 hover:bg-red-500/20 transition-all border-none cursor-pointer flex items-center justify-center"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

export default TaskItem;
