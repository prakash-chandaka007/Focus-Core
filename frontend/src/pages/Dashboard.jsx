import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import Background from '../components/dashboard/Background';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import TaskEngine from '../components/dashboard/TaskEngine';
import TaskModal from '../components/dashboard/TaskModal';
import StrategicTicker from '../components/dashboard/StrategicTicker';
import api from '../services/api';
import Footer from '../components/dashboard/Footer';
import FooterPromo from '../components/dashboard/FooterPromo';

const Dashboard = () => {
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
  const [newTask, setNewTask] = useState({ title: '', category: 'General', priority: 'Medium' });

  // 1. Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, tasksRes] = await Promise.all([
          api.get('/auth/user').catch(e => { console.error("User fetch failed:", e); return { data: null }; }),
          api.get('/tasks').catch(e => { console.error("Tasks fetch failed:", e); return { data: [] }; })
        ]);

        if (userRes.data) {
          setUser(userRes.data);
        }

        // Map backend 'text' to frontend 'title' and '_id' to 'id'
        const rawTasks = Array.isArray(tasksRes.data) ? tasksRes.data : [];
        const mappedTasks = rawTasks.map(t => ({
          id: t._id || Math.random().toString(36).substr(2, 9),
          title: t.text || 'Untitled Objective',
          category: t.category || 'General',
          priority: (t.priority && typeof t.priority === 'string')
            ? t.priority.charAt(0).toUpperCase() + t.priority.slice(1)
            : 'Medium',
          status: t.status || 'pending',
          createdAt: t.createdAt ? new Date(t.createdAt) : new Date()
        }));
        setTasks(mappedTasks);

        setIsVisible(true);
      } catch (err) {
        console.error("Critical dashboard initialization error:", err);
        // We still set isVisible to true to avoid blank screen if partial data loaded
        setIsVisible(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // 2. Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollTop = scrollContainerRef.current.scrollTop;
        setScrolled(scrollTop > 20);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading]);

  // 3. Scroll to top on tab switch
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [activeTab]);

  // User Stats Calculation
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const userStats = {
    userName: user?.username || "Operator",
    userRole: user?.email ? "Pro Member" : "Guest Mode",
    dailyCompletion: completionPercentage,
    currentStreak: user?.currentStreak || 0,
    totalTasksDone: completedCount,
    pendingTasks: pendingCount
  };

  // --- CRUD OPERATIONS ---
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    try {
      const res = await api.post('/tasks', {
        text: newTask.title,
        priority: newTask.priority.toLowerCase(),
        category: newTask.category
      });

      const mappedTask = {
        id: res.data._id,
        title: res.data.text,
        category: res.data.category,
        priority: res.data.priority.charAt(0).toUpperCase() + res.data.priority.slice(1),
        status: res.data.status,
        createdAt: new Date(res.data.createdAt)
      };

      setTasks([mappedTask, ...tasks]);
      setNewTask({ title: '', category: 'General', priority: 'Medium' });
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to add task:", err);
      // Optional: Add local fallback if backend fails (optimistic UI)
    }
  };

  const toggleTaskStatus = async (id) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;
    const newStatus = taskToToggle.status === 'completed' ? 'pending' : 'completed';

    // Optimistic Update
    const previousTasks = [...tasks];
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));

    try {
      await api.patch(`/tasks/${id}`, { status: newStatus });
    } catch (err) {
      console.error("Status update failed:", err);
      setTasks(previousTasks); // Rollback
    }
  };

  const deleteTask = async (id) => {
    const previousTasks = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));

    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.error("Delete failed:", err);
      setTasks(previousTasks); // Rollback
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

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
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        className="animate-precision-docking"
      />

      <main className="flex-1 flex flex-col overflow-hidden relative z-10 transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] pb-20 md:pb-0">
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar relative"
        >
          <Header
            activeTab={activeTab}
            userStats={userStats}
            setIsModalOpen={setIsModalOpen}
            scrolled={scrolled}
          />
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-0 space-y-8 md:space-y-12 min-h-screen">
            <div key={activeTab} className="space-y-8 md:space-y-12 animate-precision-docking stagger-2">
              {activeTab === 'dashboard' && (
                <div className="relative p-12 md:p-16 rounded-[48px] bg-gradient-to-br from-indigo-600/20 via-blue-600/5 to-transparent border border-white/10 overflow-hidden group animate-precision-docking stagger-1 backdrop-blur-xl">
                  {/* Big Rotating Star (To and Fro) */}
                  <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-20 pointer-events-none animate-swing filter blur-[2px]">
                    <Star size={160} className="text-yellow-400 fill-yellow-400/20" />
                  </div>

                  {/* Subtle Scanline Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-40 w-full animate-[scanning-line_8s_linear_infinite] pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">System Active // Operator Entry</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.04em] italic uppercase leading-tight">
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

              {activeTab === 'tasks' && (
                <TaskEngine
                  filteredTasks={filteredTasks}
                  filter={filter}
                  setFilter={setFilter}
                  toggleTaskStatus={toggleTaskStatus}
                  deleteTask={deleteTask}
                />
              )}

              {activeTab === 'dashboard' && (
                <DashboardOverview userStats={userStats} />
              )}
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
      </main >
    </div >
  );
};

export default Dashboard;
