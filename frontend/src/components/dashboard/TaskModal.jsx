import React from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ isModalOpen, setIsModalOpen, addTask, newTask, setNewTask }) => {
    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative w-full max-w-xl bg-[#0a0a0c] border border-white/10 rounded-[40px] p-10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-500/10 blur-[100px] -mr-32 -mt-32"></div>

                <div className="flex items-center justify-between mb-10 relative z-10">
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">New Task Initialization</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={addTask} className="space-y-8 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Objective</label>
                        <input
                            autoFocus
                            type="text"
                            placeholder="E.g., Complete UI Mockups"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold italic focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-700"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
                            <input
                                type="text"
                                placeholder="Project Name"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold italic focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-700"
                                value={newTask.category}
                                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Priority Level</label>
                            <select
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white font-bold italic focus:border-indigo-500 focus:outline-none appearance-none cursor-pointer"
                                value={newTask.priority}
                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                            >
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transform hover:-translate-y-1 transition-all border-none cursor-pointer"
                    >
                        Authorize Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
