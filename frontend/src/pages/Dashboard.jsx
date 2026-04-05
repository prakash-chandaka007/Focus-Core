import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import Background from '../components/dashboard/Background';
import Header from '../components/dashboard/Header';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import TaskEngine from '../components/dashboard/TaskEngine';
import TaskModal from '../components/dashboard/TaskModal';
import HabitTracker from '../components/dashboard/HabitTracker';
import Analytics from '../components/dashboard/Analytics';
import Schedule from '../components/dashboard/Schedule';
import StrategicTicker from '../components/dashboard/StrategicTicker';
import api from '../services/api';
import Footer from '../components/dashboard/Footer';
import FooterPromo from '../components/dashboard/FooterPromo';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  // --- TASK STATE ---
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', category: 'General', priority: 'medium', durationValue: 30, durationUnit: 'minutes', scheduledDate: null, startTime: null });
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState('asc');

  // --- HABIT STATE ---
  const [habits, setHabits] = useState([]);

  // --- ANALYTICS STATE ---
  const [analytics, setAnalytics] = useState(null);

  // 1. Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, tasksRes, habitsRes, analyticsRes] = await Promise.all([
          api.get('/auth/user').catch(e => { console.error('User fetch failed:', e); return { data: null }; }),
          api.get('/tasks').catch(e => { console.error('Tasks fetch failed:', e); return { data: [] }; }),
          api.get('/habits').catch(e => { console.error('Habits fetch failed:', e); return { data: [] }; }),
          api.get('/analytics').catch(e => { console.error('Analytics fetch failed:', e); return { data: null }; }),
        ]);

        if (userRes.data) setUser(userRes.data);

        const rawTasks = Array.isArray(tasksRes.data) ? tasksRes.data : [];
        const mappedTasks = rawTasks.map(t => ({
          id: t._id || Math.random().toString(36).substr(2, 9),
          title: t.text || 'Untitled Objective',
          category: t.category || 'General',
          priority: t.priority || 'medium',
          status: t.status || 'pending',
          duration: t.duration || 30,
          scheduledDate: t.scheduledDate,
          startTime: t.startTime,
          createdAt: t.createdAt ? new Date(t.createdAt) : new Date()
        }));
        setTasks(mappedTasks);

        const rawHabits = Array.isArray(habitsRes.data) ? habitsRes.data : [];
        setHabits(rawHabits);

        if (analyticsRes.data) setAnalytics(analyticsRes.data);

        setIsVisible(true);
      } catch (err) {
        console.error('Critical dashboard initialization error:', err);
        setIsVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // 2. Refetch analytics whenever habits or tasks change
  useEffect(() => {
    if (!loading) {
      api.get('/analytics')
        .then(res => setAnalytics(res.data))
        .catch(() => { });
    }
  }, [habits, tasks, loading]);

  // 3. Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setScrolled(scrollContainerRef.current.scrollTop > 20);
      }
    };
    const container = scrollContainerRef.current;
    if (container) container.addEventListener('scroll', handleScroll);
    return () => { if (container) container.removeEventListener('scroll', handleScroll); };
  }, [loading]);

  // 4. Scroll to top on tab switch
  useEffect(() => {
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTo(0, 0);
  }, [activeTab]);

  // User Stats Calculation
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Habit stats for DashboardOverview
  const completedHabits = habits.filter(h => h.completedToday >= h.goalFrequency).length;
  const habitRate = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;

  const userStats = {
    userName: user?.username || 'Operator',
    userRole: user?.email ? 'Pro Member' : 'Guest Mode',
    dailyCompletion: completionPercentage,
    currentStreak: user?.currentStreak || 0,
    userLevel: user?.levelTitle || 'Novice',
    totalTasksDone: completedCount,
    pendingTasks: pendingCount,
    habitRate
  };

  // --- TASK CRUD ---
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    try {
      const unitMultiplier = { days: 1440, hours: 60, minutes: 1 };
      const durationInMinutes = (newTask.durationValue || 30) * (unitMultiplier[newTask.durationUnit] || 1);
      const res = await api.post('/tasks', {
        text: newTask.title,
        priority: newTask.priority.toLowerCase(),
        category: newTask.category,
        duration: durationInMinutes,
        scheduledDate: newTask.scheduledDate,
        startTime: newTask.startTime
      });
      const mappedTask = {
        id: res.data._id,
        title: res.data.text,
        category: res.data.category,
        priority: res.data.priority,
        status: res.data.status,
        duration: res.data.duration,
        scheduledDate: res.data.scheduledDate,
        startTime: res.data.startTime,
        createdAt: new Date(res.data.createdAt)
      };
      setTasks([mappedTask, ...tasks]);
      setNewTask({ title: '', category: 'General', priority: 'medium', durationValue: 30, durationUnit: 'minutes', scheduledDate: null, startTime: null });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const toggleTaskStatus = async (id) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;
    const newStatus = taskToToggle.status === 'completed' ? 'pending' : 'completed';
    const previousTasks = [...tasks];
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      await api.patch(`/tasks/${id}`, { status: newStatus });
    } catch (err) {
      console.error('Status update failed:', err);
      setTasks(previousTasks);
    }
  };

  const deleteTask = async (id) => {
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));
    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.error('Delete failed:', err);
      setTasks(previousTasks);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  }).sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityWeights = { high: 3, medium: 2, low: 1 };
      const wA = priorityWeights[a.priority] || 0;
      const wB = priorityWeights[b.priority] || 0;
      return sortOrder === 'asc' ? wB - wA : wA - wB;
    } else if (sortBy === 'time') {
      const getRemaining = (task) => new Date(task.createdAt.getTime() + task.duration * 60000) - new Date();
      return sortOrder === 'asc' ? getRemaining(a) - getRemaining(b) : getRemaining(b) - getRemaining(a);
    }
    return 0;
  });

  // --- HABIT CRUD ---
  const addHabit = async (formData) => {
    try {
      const res = await api.post('/habits', {
        name: formData.name,
        category: formData.category,
        goalFrequency: formData.goalFrequency
      });
      setHabits([res.data, ...habits]);
    } catch (err) {
      console.error('Failed to add habit:', err);
    }
  };

  const incrementHabit = async (id) => {
    const prev = [...habits];
    // Optimistic update
    setHabits(habits.map(h => h._id === id
      ? { ...h, completedToday: Math.min(h.completedToday + 1, h.goalFrequency) }
      : h
    ));
    try {
      const res = await api.put(`/habits/increment/${id}`);
      // Sync with server response
      setHabits(prev => prev.map(h => h._id === id ? res.data : h));
    } catch (err) {
      console.error('Increment failed:', err.response?.data?.msg || err.message);
      setHabits(prev);
    }
  };

  const deleteHabit = async (id) => {
    const prev = [...habits];
    setHabits(habits.filter(h => h._id !== id));
    try {
      await api.delete(`/habits/${id}`);
    } catch (err) {
      console.error('Delete habit failed:', err);
      setHabits(prev);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="w-12 h-12 relative flex items-center justify-center text-indigo-500">
          <div className="absolute inset-0 border-2 border-indigo-500/10 rounded-full"></div>
          <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#020202] text-slate-200 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col md:flex-row overflow-hidden">

      <Background />

      <main className="flex-1 flex flex-col overflow-hidden relative z-10 transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] pb-20 md:pb-0">
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar relative"
        >
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            userStats={userStats}
            setIsModalOpen={setIsModalOpen}
            scrolled={scrolled}
          />
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:py-8 min-h-screen">
            <div className={`relative w-full rounded-[24px] md:rounded-[32px] border ${isDark ? 'border-indigo-500/20' : 'border-white/10'} bg-[#0a0a0c]/80 backdrop-blur-3xl p-6 md:p-8 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-700`}>
              {/* Futuristic HUD Background Elements */}
              <div className="scanning-grid opacity-[0.03] pointer-events-none"></div>
              <div className="absolute top-0 left-0 w-40 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
              <div className="absolute top-0 right-0 w-[2px] h-40 bg-gradient-to-b from-indigo-500 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-40 h-[2px] bg-gradient-to-l from-indigo-500 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-[2px] h-40 bg-gradient-to-t from-indigo-500 to-transparent"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(79,70,229,0.08),transparent_70%)] pointer-events-none"></div>

              <div className="absolute top-8 right-10 flex gap-1.5 opacity-40 pointer-events-none">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              </div>

              <div key={activeTab} className="space-y-8 md:space-y-12 animate-precision-docking stagger-2 relative z-10 block">

                {/* ── Dashboard Welcome Banner ── */}
                {activeTab === 'dashboard' && (
                  <div className="relative p-8 md:p-10 rounded-[32px] bg-gradient-to-br from-indigo-600/20 via-blue-600/5 to-transparent border border-white/10 overflow-hidden group animate-precision-docking stagger-1 backdrop-blur-xl">
                    <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-20 pointer-events-none animate-swing filter blur-[2px]">
                      <Star size={160} className="text-yellow-400 fill-yellow-400/20" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-40 w-full animate-[scanning-line_8s_linear_infinite] pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col gap-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">System Active // Operator Entry</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-[-0.04em] italic uppercase leading-tight">
                          Welcome back, <br />
                          <span className="text-indigo-400">{userStats.userName.split(' ')[0]}</span>
                        </h2>
                      </div>
                      <p className="text-slate-400 max-w-xl font-bold leading-relaxed uppercase text-[11px] tracking-widest opacity-80">
                        Streak Integrity: <span className="text-white font-black italic">{userStats.currentStreak} Days</span> //
                        Resource Load: <span className="text-white font-black italic">{userStats.pendingTasks} Active Tasks</span>
                      </p>
                      <div className="w-full max-w-md h-1 bg-white/5 rounded-full overflow-hidden mt-4">
                        <div className="h-full bg-indigo-500 w-3/4 animate-glow-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Overview Stats ── */}
                {activeTab === 'dashboard' && (
                  <DashboardOverview userStats={userStats} habits={habits} />
                )}

                {/* ── Task Engine ── */}
                {activeTab === 'tasks' && (
                  <TaskEngine
                    filteredTasks={filteredTasks}
                    filter={filter}
                    setFilter={setFilter}
                    toggleTaskStatus={toggleTaskStatus}
                    deleteTask={deleteTask}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                  />
                )}

                {/* ── Habit Tracker ── */}
                {activeTab === 'habits' && (
                  <HabitTracker
                    habits={habits}
                    onAddHabit={addHabit}
                    onIncrementHabit={incrementHabit}
                    onDeleteHabit={deleteHabit}
                  />
                )}

                {/* ── Analytics ── */}
                {activeTab === 'progress' && (
                  <Analytics analytics={analytics} isDark={isDark} />
                )}

                {/* ── Schedule ── */}
                {activeTab === 'schedule' && (
                  <Schedule user={user} />
                )}

              </div>
            </div>
          </div>

          <FooterPromo />
          <Footer />
          <StrategicTicker />
        </div>

        <TaskModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          addTask={addTask}
          newTask={newTask}
          setNewTask={setNewTask}
        />
      </main>
    </div>
  );
};

export default Dashboard;
