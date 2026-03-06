import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ArrowRight, ChevronLeft, Target, Zap } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await api.put(`/auth/reset-password/${token}`, { password });
            alert("Password Reset Successful. Please login with your new access key.");
            navigate('/auth');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || "Reset Failed";
            alert(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030303] text-[#f8fafc] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col items-center justify-center p-6 overflow-hidden relative">
            {/* BACKGROUND EFFECTS */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/5 blur-[120px] rounded-full animate-pulse-slow"></div>
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
            </div>

            <button
                onClick={() => navigate('/auth')}
                className={`absolute top-8 left-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all duration-700 group z-10 bg-transparent border-none cursor-pointer ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
            >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Return to Auth
            </button>

            <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-6 border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.4)] relative group animate-precision-docking stagger-1">
                        <ShieldCheck size={32} className="text-white relative z-10" />
                    </div>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2 animate-precision-docking stagger-2">
                        Reset Access Key
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 animate-precision-docking stagger-3">
                        Re-initialize your security credentials
                    </p>
                </div>

                <div className="bg-white/[0.03] border border-white/5 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 shadow-2xl animate-precision-docking stagger-3">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">New Access Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-gray-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Confirm New Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-gray-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full group relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-4 text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 mt-4 cursor-pointer"
                        >
                            <span className={`flex items-center justify-center gap-3 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                                Update Credentials
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-10 flex items-center justify-center gap-6 text-[8px] font-black uppercase tracking-[0.4em] text-gray-700">
                    <div className="flex items-center gap-2">
                        <Zap size={10} className="text-indigo-500" />
                        <span>Encrypted Session</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Target size={10} className="text-indigo-500" />
                        <span>Override Active</span>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.2; transform: scale(1.05); }
                }
                .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
            `}} />
        </div>
    );
};

export default ResetPassword;
