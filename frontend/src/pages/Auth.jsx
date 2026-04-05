import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  ArrowRight,
  ChevronLeft,
  Target,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Required for navigation
import api from '../services/api'; // Corrected path based on your src structure

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '' });
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation for email
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setFieldErrors(prev => ({ ...prev, email: 'Invalid Operator Identifier' }));
      } else {
        setFieldErrors(prev => ({ ...prev, email: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setFieldErrors(prev => ({ ...prev, email: 'Valid identity required for synchronization' }));
      setLoading(false);
      return;
    }

    setLoading(true);

    if (isForgot) {
      try {
        await api.post('/auth/forgot-password', { email: formData.email });
        alert("Transmission Sent. If the identity exists in our core, a reset link has been dispatched.");
        setIsForgot(false);
      } catch (err) {
        alert("Transmission Failed. Verification offline.");
      } finally {
        setLoading(false);
      }
      return;
    }

    const authData = isLogin
      ? { email: formData.email, password: formData.password }
      : {
        username: formData.fullName,
        email: formData.email,
        password: formData.password
      };

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, authData);

      localStorage.setItem('token', res.data.token);
      console.log("Access Granted. Token Stored.");
      navigate('/dashboard');
    } catch (err) {
      const errorData = err.response?.data;
      const errorMsg = errorData?.msg || errorData?.message || errorData?.error || err.message || "System Access Denied";
      alert(`System Error: ${errorMsg}`);
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

      {/* BACK TO LANDING */}
      <button
        onClick={() => {
          if (isForgot) setIsForgot(false);
          else navigate('/');
        }}
        className={`absolute top-8 left-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all duration-700 group z-10 bg-transparent border-none cursor-pointer ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        {isForgot ? 'Return to Authentication' : 'Return to Neutral'}
      </button>

      {/* AUTH CARD */}
      <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-6 border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.4)] relative group animate-precision-docking stagger-1">
            <ShieldCheck size={32} className="text-white relative z-10" />
            <div className="absolute inset-0 bg-indigo-400 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity"></div>
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2 overflow-hidden animate-precision-docking stagger-2">
            <span>
              {isForgot ? 'Access Recovery' : isLogin ? 'Operator Login' : 'System Enrollment'}
            </span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 animate-precision-docking stagger-3">
            {isForgot ? 'Authorize credential override' : isLogin ? 'Access your performance enclave' : 'Initialize your productivity core'}
          </p>
        </div>

        <div className="bg-white/[0.03] border border-white/5 backdrop-blur-2xl rounded-[32px] p-8 md:p-10 shadow-2xl transition-all duration-500 overflow-hidden animate-precision-docking stagger-3">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* NAME FIELD (Conditional) */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${(!isLogin && !isForgot) ? 'max-h-32 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Full Identity</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="E.G. JOHN DOE"
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-gray-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all uppercase tracking-wider"
                    required={!isLogin && !isForgot}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 animate-precision-docking stagger-4">
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Secure Email</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${fieldErrors.email ? 'text-red-500' : 'text-gray-600 group-focus-within:text-indigo-500'}`} size={18} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="OPERATOR@FOCUSCORE.IO"
                  className={`w-full bg-black/40 border rounded-xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-gray-800 focus:ring-1 outline-none transition-all uppercase tracking-wider ${fieldErrors.email ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/5 focus:border-indigo-500/50 focus:ring-indigo-500/20'}`}
                  required
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[8px] font-black uppercase tracking-widest text-red-500/80 ml-1 animate-pulse">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* PASSWORD FIELD (Hidden on Forgot) */}
            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${!isForgot ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-2 animate-precision-docking stagger-5">
                <div className="flex justify-between">
                  <label className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 ml-1">Access Key</label>
                  {isLogin && (
                    <button
                      onClick={() => setIsForgot(true)}
                      type="button"
                      className="text-[8px] font-black uppercase tracking-widest text-indigo-500 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-4 pl-12 pr-12 text-sm font-bold placeholder:text-gray-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 outline-none transition-all"
                    required={!isForgot}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer"
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-4 text-[11px] font-black uppercase tracking-[0.4em] transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 mt-4 cursor-pointer animate-precision-docking stagger-6"
            >
              <span className={`flex items-center justify-center gap-3 transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                {isForgot ? 'Request Reset' : isLogin ? 'Initialize Session' : 'Create Profile'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
              )}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shine" />
            </button>
          </form>

          {!isForgot && (
            <div className="mt-8 pt-8 border-t border-white/5 text-center animate-precision-docking stagger-7">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                {isLogin ? "New to the system?" : "Already an operator?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-indigo-500 hover:text-white transition-colors uppercase italic font-bold bg-transparent border-none cursor-pointer"
                >
                  {isLogin ? 'Request Access' : 'Authenticate Now'}
                </button>
              </p>
            </div>
          )}
        </div>

        {/* SECURITY INFO Staggered */}
        <div className="mt-10 flex items-center justify-center gap-6 text-[8px] font-black uppercase tracking-[0.4em] text-gray-700">
          <div className="flex items-center gap-2 animate-precision-docking stagger-8">
            <Zap size={10} className="text-indigo-500" />
            <span>Encrypted Session</span>
          </div>
          <div className="flex items-center gap-2 animate-precision-docking stagger-9">
            <Target size={10} className="text-indigo-500" />
            <span>Biometric Ready</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;0,800;1,800&display=swap');
        
        input::placeholder {
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        @keyframes shine {
          100% { left: 125%; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.05); }
        }

        .animate-shine { animation: shine 0.8s ease-in-out; }
        .animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }
      `}} />
    </div>
  );
};

export default Auth;