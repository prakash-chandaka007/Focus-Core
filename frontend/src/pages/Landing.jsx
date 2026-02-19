import React, { useState, useEffect, useRef } from 'react';
import {
  Target,
  ListTodo,
  TrendingUp,
  MoveUpRight,
  ArrowUpRight,
  Plus,
  Layout,
  ShieldCheck,
  ZapOff,
  Activity,
  Cpu,
  Lock,
  Menu,
  X,
  Compass,
  Clock,
  Layers,
  ChevronRight,
  BarChart3,
  MousePointer2,
  Zap
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeIndices, setActiveIndices] = useState(new Set());

  const observerRef = useRef(null);

  useEffect(() => {
    // Reveal animation on scroll
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveIndices(prev => new Set([...prev, entry.target.getAttribute('data-index')]));
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => {
      observerRef.current.observe(el);
    });

    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e) => {
      if (window.innerWidth > 768) {
        // Subtle parallax mapping
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        setMousePos({ x, y, rawX: e.clientX, rawY: e.clientY });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const isVisible = (index) => activeIndices.has(index);

  return (
    <div className="min-h-screen bg-[#030303] text-[#f8fafc] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-indigo-500/30 overflow-x-hidden">

      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 z-0 transition-opacity duration-700 ease-out opacity-40 hidden md:block"
          style={{
            background: `radial-gradient(1200px circle at ${mousePos.rawX}px ${mousePos.rawY}px, rgba(79, 70, 229, 0.08), transparent 80%)`
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04] transition-transform duration-1000 ease-out"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            transform: `perspective(1000px) rotateX(${60 + mousePos.y * 0.2}deg) rotateY(${mousePos.x * 0.2}deg) translateY(-100px) translateZ(-500px)`,
            maskImage: 'radial-gradient(ellipse_at_center, black 40%, transparent 100%)'
          }}
        />
        <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-indigo-600/10 blur-[150px] rounded-full animate-float" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/5 blur-[150px] rounded-full animate-float-delayed" />
      </div>

      {/* NAVIGATION */}
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${scrolled ? 'bg-black/80 backdrop-blur-2xl py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-8 border-b border-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center relative border border-white/10 group-hover:rotate-[-10deg] transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]">
              <Target size={20} className="text-white" strokeWidth={3} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter uppercase italic">FOCUS<span className="text-indigo-500">CORE</span></span>
              <span className="text-[7px] font-black text-gray-500 uppercase tracking-[0.4em] hidden sm:block">Intelligent Productivity</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
              {['How it Works', 'Framework', 'Community'].map(item => (
                <a key={item} href="#" className="hover:text-indigo-400 transition-colors relative group py-1">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <div className="h-4 w-px bg-white/10"></div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/auth')}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors border-none bg-transparent cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="px-7 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-lg border-none cursor-pointer"
              >
                Join now
              </button>
            </div>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-48 pb-20 md:pt-64 md:pb-48 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div
            data-animate data-index="hero-badge"
            className={`inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-10 backdrop-blur-md transition-all duration-1000 ${isVisible('hero-badge') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-gray-400">Scientific System for High Achievers</span>
          </div>

          <h1
            data-animate data-index="hero-title"
            className={`text-6xl md:text-[9rem] font-black tracking-[-0.06em] leading-[0.85] mb-12 uppercase italic transition-all duration-1000 delay-300 ${isVisible('hero-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 blur-xl'}`}>
            DESIGN YOUR <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-800 bg-[length:200%_auto] animate-gradient-shift">DAILY EDGE.</span>
          </h1>

          <p
            data-animate data-index="hero-desc"
            className={`text-base md:text-xl text-gray-500 max-w-2xl mb-16 font-medium leading-relaxed tracking-tight uppercase transition-all duration-1000 delay-500 ${isVisible('hero-desc') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Stop reacting to your inbox. Build a <span className="text-white">disciplined workflow</span> that prioritizes your goals and converts daily effort into <span className="text-indigo-500">long-term compounding growth</span>.
          </p>

          <div
            data-animate data-index="hero-cta"
            className={`flex flex-col sm:flex-row gap-4 w-full sm:w-auto transition-all duration-1000 delay-700 ${isVisible('hero-cta') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <button
              onClick={() => navigate('/auth')}
              className="group flex items-center justify-center gap-4 px-12 py-6 bg-indigo-600 border border-indigo-400/20 text-xs font-black uppercase tracking-[0.4em] hover:bg-indigo-500 transition-all rounded-sm shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] active:scale-95 text-white cursor-pointer"
            >
              Build Your System <MoveUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="flex items-center justify-center gap-4 px-12 py-6 bg-transparent border border-white/10 text-xs font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all rounded-sm text-white cursor-pointer"
            >
              Explore The Model
            </button>
          </div>
        </div>
      </section>

      {/* DYNAMIC BENTO GRID */}
      <section className="relative z-10 px-6 md:px-12 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 auto-rows-min md:auto-rows-[380px]">

          {/* Organization Card */}
          <div
            data-animate data-index="card-1"
            className={`md:col-span-8 bg-[#0a0a0a] border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-700 ${isVisible('card-1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-indigo-600/10 blur-[100px] group-hover:bg-indigo-600/20 transition-all duration-700"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-indigo-500 mb-8">
                  <Layers size={20} className="animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Scalable Workspaces</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-4 uppercase leading-none">STRATEGIC <br className="hidden md:block" /> FOCUS AREAS</h3>
                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] max-w-sm leading-relaxed">
                  Eliminate mental clutter. Categorize your life into high-impact domains like Business, Wellness, and Strategic Planning.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}
                    style={{ transitionDelay: `${i * 100}ms` }}
                    className={`h-12 w-12 border border-white/10 rounded-xl flex items-center justify-center transition-all group-hover:border-indigo-500/40 group-hover:bg-indigo-600/5 group-hover:scale-110`}>
                    <Target size={18} className="text-gray-800 group-hover:text-indigo-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Speed Card */}
          <div
            data-animate data-index="card-2"
            className={`md:col-span-4 bg-indigo-600 text-white rounded-[40px] p-10 flex flex-col justify-between group overflow-hidden relative shadow-2xl transition-all duration-700 delay-200 ${isVisible('card-2') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-transparent"></div>
            <div className="flex justify-between items-start relative z-10">
              <Clock size={48} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform duration-500" />
              <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter mb-4 uppercase leading-none">SEAMLESS <br /> TRACKING</h3>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-80 leading-relaxed">Capture ideas and log progress in seconds. We optimize for speed so the tool never slows down your execution.</p>
            </div>
          </div>

          {/* Privacy Card */}
          <div
            data-animate data-index="card-3"
            className={`md:col-span-5 bg-[#0a0a0a] border border-white/5 rounded-[40px] p-10 flex flex-col justify-between group hover:bg-[#0c0c0c] transition-all duration-700 ${isVisible('card-3') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-500 mb-8 group-hover:shadow-[0_0_30px_rgba(79,70,229,0.2)] transition-all">
              <Lock size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black italic tracking-tighter mb-3 uppercase leading-none">SECURE DATA <br /> ENCLAVE</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 leading-relaxed">
                Your habits are personal. Our local-first architecture ensures that your data remains encrypted and under your sole ownership.
              </p>
            </div>
          </div>

          {/* Sync Card */}
          <div
            data-animate data-index="card-4"
            className={`md:col-span-7 bg-white text-black rounded-[40px] p-10 md:p-12 relative overflow-hidden group transition-all duration-700 delay-300 ${isVisible('card-4') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase">UNIFIED SYNC</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 italic">Real-time collaboration tools</p>
              </div>
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white animate-bounce-slow">
                <Activity size={24} />
              </div>
            </div>
            <div className="flex items-end gap-3 h-32">
              {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
                <div key={i}
                  className="flex-1 bg-black/5 rounded-t-lg transition-all duration-1000"
                  style={{
                    height: isVisible('card-4') ? `${h}%` : '0%',
                    transitionDelay: `${i * 100}ms`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW METHODOLOGY SECTION */}
      <section className="relative z-10 py-32 px-6 md:px-12 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="flex-1">
              <div
                data-animate data-index="meth-badge"
                className={`flex items-center gap-3 text-indigo-500 mb-8 transition-all duration-1000 ${isVisible('meth-badge') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <Zap size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">The Methodology</span>
              </div>
              <h2
                data-animate data-index="meth-title"
                className={`text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-12 leading-none transition-all duration-1000 delay-200 ${isVisible('meth-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                THREE PILLARS OF <br /> <span className="text-indigo-500">PEAK PERFORMANCE</span>
              </h2>

              <div className="space-y-12">
                {[
                  { icon: <Target className="text-indigo-500" />, title: "Precision Goal Setting", desc: "Break your vision into 90-day sprints and daily executable targets." },
                  { icon: <ZapOff className="text-indigo-500" />, title: "Deep Work Induction", desc: "Automated focus modes that silence noise and prime your cognitive state." },
                  { icon: <BarChart3 className="text-indigo-500" />, title: "Performance Audits", desc: "Bi-weekly reviews powered by behavioral data to eliminate inefficiencies." }
                ].map((item, i) => (
                  <div
                    key={i}
                    data-animate data-index={`meth-item-${i}`}
                    className={`flex gap-8 group transition-all duration-1000 ${isVisible(`meth-item-${i}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    style={{ transitionDelay: `${400 + (i * 150)}ms` }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-indigo-500/50 group-hover:bg-indigo-600/10 transition-all duration-500">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-black uppercase italic tracking-tight mb-2 group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-loose max-w-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="aspect-square bg-gradient-to-br from-indigo-600/20 to-transparent rounded-[60px] border border-white/5 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                {/* Visual Representation of the "Core" */}
                <div className="w-64 h-64 rounded-full border border-indigo-500/20 animate-spin-slow flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border border-indigo-500/40 animate-reverse-spin flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-indigo-600/20 backdrop-blur-3xl flex items-center justify-center border border-indigo-500 shadow-[0_0_50px_rgba(79,70,229,0.3)]">
                      <Target size={40} className="text-white" />
                    </div>
                  </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-indigo-500 rounded-full blur-sm animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-purple-500 rounded-full blur-md animate-pulse delay-700"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL */}
      <section className="relative z-10 py-32 md:py-64 px-6 border-t border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600/[0.02] animate-pulse"></div>
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center relative">
          <h2
            data-animate data-index="final-title"
            className={`text-6xl md:text-[10rem] font-black italic tracking-tighter mb-12 md:mb-16 uppercase leading-[0.8] transition-all duration-1000 ${isVisible('final-title') ? 'opacity-100 scale-100' : 'opacity-0 scale-110 blur-2xl'}`}>
            BECOME <br className="md:hidden" /> <span className="text-indigo-500">UNSTOPPABLE.</span>
          </h2>
          {/* <button className="group relative px-16 md:px-24 py-8 bg-white text-black text-[10px] font-black uppercase tracking-[0.6em] hover:bg-indigo-600 hover:text-white transition-all duration-500 rounded-sm overflow-hidden active:scale-95 shadow-2xl">
            <span className="relative z-10 group-hover:tracking-[1em] transition-all duration-500">Access the Method</span>
            <div className="absolute inset-0 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </button> */}
          <div className="mt-12 flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.4em] text-gray-700">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-white/5 border border-white/10"></div>)}
            </div>
            <span>Trusted by 40,000+ Founders and Creators</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 pt-20 pb-12 px-6 md:px-12 bg-[#030303] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                  <Target size={16} className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tighter italic uppercase">FOCUSCORE</span>
              </div>
              <p className="text-gray-700 text-[8px] font-black uppercase tracking-[0.6em] leading-[2.5] max-w-xs">
                Performance infrastructure for those who value time. Engineered for clarity.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 md:gap-24">
              <div className="space-y-6">
                <h5 className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.6em]">System</h5>
                <ul className="space-y-4 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                  {['Workflow', 'Cross-Platform', 'Data Security', 'Open API'].map(link => (
                    <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h5 className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.6em]">Organization</h5>
                <ul className="space-y-4 text-[9px] font-bold text-gray-600 uppercase tracking-widest">
                  {['Privacy Policy', 'Our Mission', 'Global Status'].map(link => (
                    <li key={link}><a href="#" className="hover:text-white transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 text-[7px] font-black uppercase tracking-[0.6em] text-gray-800 gap-6">
            <p>© 2024 FOCUS CORE // PERFORMANCE ARCHITECTURE</p>
            <div className="flex gap-10">
              <span className="hover:text-indigo-400 cursor-pointer transition-colors italic">X (Twitter)</span>
              <span className="hover:text-indigo-400 cursor-pointer transition-colors italic">Join Discord</span>
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta_Sans:ital,wght@0,400;0,700;0,800;1,800&display=swap');
        
        body { background: #030303; color: #f8fafc; cursor: crosshair; }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-40px) scale(1.1); }
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        .animate-float { animation: float 15s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 18s ease-in-out infinite 2s; }
        .animate-bounce-slow { animation: bounce 4s infinite; }
        .animate-gradient-shift { animation: gradient-shift 8s ease infinite; }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-reverse-spin { animation: reverse-spin 8s linear infinite; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030303; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #4f46e5; }
      `}} />
    </div>
  );
};

export default Landing;