import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInAnonymously, 
  signInWithCustomToken,
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  query, 
  serverTimestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Clock, 
  Zap, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Plus, 
  MoreVertical,
  Target,
  BarChart3,
  Calendar,
  Search,
  Bell,
  User,
  ShieldAlert
} from 'lucide-react';

// Firebase Configuration from Environment
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'focus-core-v1';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    velocity: '0%',
    streaks: '0 Days',
    completed: '0',
    focus: '0m'
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // 1. Authentication Handshake
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      }
    };

    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Data Listeners (Firestore)
  useEffect(() => {
    if (!user) return;

    // Public Tasks Collection Listener
    const tasksRef = collection(db, 'artifacts', appId, 'public', 'data', 'tasks');
    const unsubscribeTasks = onSnapshot(tasksRef, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Simple JS Sort by timestamp (Rule 2: No complex Firestore queries)
      setTasks(taskList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    }, (error) => {
      console.error("Task subscription error:", error);
    });

    // User Profile/Stats Listener
    const statsRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'stats');
    const unsubscribeStats = onSnapshot(statsRef, (docSnap) => {
      if (docSnap.exists()) {
        setStats(docSnap.data());
      } else {
        // Initialize stats if new user
        setDoc(statsRef, {
          velocity: '84%',
          streaks: '1 Day',
          completed: '0',
          focus: '15m'
        });
      }
    }, (error) => console.error("Stats subscription error:", error));

    return () => {
      unsubscribeTasks();
      unsubscribeStats();
    };
  }, [user]);

  // 3. Actions
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !user) return;

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'tasks'), {
        title: newTaskTitle,
        priority: 'Medium',
        status: 'Pending',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });
      setNewTaskTitle('');
      setIsAddingTask(false);
    } catch (error) {
      console.error("Error adding protocol:", error);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    if (!user) return;
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const taskRef = doc(db, 'artifacts', appId, 'public', 'data', 'tasks', taskId);
      await updateDoc(taskRef, { status: newStatus });
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 animate-pulse">Establishing Secure Uplink...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-[#f8fafc] font-['Plus_Jakarta_Sans',sans-serif] flex overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl flex flex-col items-center lg:items-start p-6 z-20">
        <div className="flex items-center gap-3 mb-12 lg:px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            <Zap size={20} className="text-white fill-white" />
          </div>
          <span className="hidden lg:block font-black italic tracking-tighter text-xl uppercase text-white">Focus Core</span>
        </div>

        <nav className="flex-1 w-full space-y-2">
          {[
            { Icon: LayoutDashboard, label: 'Control Center', active: true },
            { Icon: Target, label: 'Velocity Log' },
            { Icon: BarChart3, label: 'Analytics' },
            { Icon: Calendar, label: 'Schedule' },
            { Icon: Settings, label: 'System Prefs' },
          ].map((item, idx) => (
            <button 
              key={idx}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${item.active ? 'bg-indigo-600/10 text-indigo-500' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              <item.Icon size={20} className={item.active ? 'text-indigo-500' : 'group-hover:text-white'} />
              <span className="hidden lg:block text-xs font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={() => signOut(auth)}
          className="w-full flex items-center gap-4 p-4 text-gray-600 hover:text-red-500 transition-colors mt-auto"
        >
          <LogOut size={20} />
          <span className="hidden lg:block text-xs font-black uppercase tracking-widest">Terminate Session</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] -z-10 rounded-full"></div>
        
        <header className="h-24 border-b border-white/5 flex items-center justify-between px-8 sticky top-0 bg-[#030303]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-2 rounded-xl w-96 group focus-within:border-indigo-500/50 transition-all">
            <Search size={18} className="text-gray-500 group-focus-within:text-indigo-500" />
            <input 
              type="text" 
              placeholder="SEARCH PROTOCOLS..." 
              className="bg-transparent border-none outline-none text-[10px] font-bold tracking-widest uppercase w-full placeholder:text-gray-700 text-white"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">ID: {user?.uid}</p>
                <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-tighter">Verified Operator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-[#030303] flex items-center justify-center overflow-hidden">
                  <User size={20} className="text-indigo-400" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Authenticated Session</p>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">System Status: Online</h2>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsAddingTask(true)}
                className="bg-indigo-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
              >
                <Plus size={14} /> New Protocol
              </button>
            </div>
          </div>

          {/* KPI CARDS (Live Data) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Current Velocity', value: stats.velocity, Icon: Zap, color: 'text-yellow-500' },
              { label: 'Neural Streaks', value: stats.streaks, Icon: TrendingUp, color: 'text-indigo-500' },
              { label: 'Completed Nodes', value: stats.completed, Icon: CheckCircle2, color: 'text-emerald-500' },
              { label: 'Focus Minutes', value: stats.focus, Icon: Clock, color: 'text-purple-500' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/[0.03] border border-white/5 p-6 rounded-[24px]">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                    <stat.Icon size={20} />
                  </div>
                </div>
                <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-black tracking-tighter uppercase text-white">{stat.value}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* PROTOCOL LIST */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-black uppercase tracking-[0.3em]">Live Feed</h3>
              </div>

              {isAddingTask && (
                <form onSubmit={handleAddTask} className="bg-white/5 border border-indigo-500/30 p-4 rounded-2xl flex gap-4 animate-in fade-in slide-in-from-top-4">
                  <input 
                    autoFocus
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="ENTER PROTOCOL NAME..."
                    className="flex-1 bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest text-white"
                  />
                  <button type="button" onClick={() => setIsAddingTask(false)} className="text-[10px] font-black uppercase text-gray-500">Cancel</button>
                  <button type="submit" className="text-[10px] font-black uppercase text-indigo-500">Initialize</button>
                </form>
              )}

              <div className="bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden min-h-[400px]">
                {tasks.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-600 py-20">
                    <ShieldAlert size={48} className="mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">No active protocols found</p>
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead className="border-b border-white/5 bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Protocol</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Status</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-gray-500">Operator ID</th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {tasks.map((task) => (
                        <tr key={task.id} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-6 py-5">
                            <p className={`text-xs font-bold uppercase tracking-tight ${task.status === 'Completed' ? 'text-gray-600 line-through' : 'text-white'}`}>
                              {task.title}
                            </p>
                          </td>
                          <td className="px-6 py-5">
                            <button 
                              onClick={() => toggleTaskStatus(task.id, task.status)}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
                                task.status === 'Completed' 
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-indigo-500/50'
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'Completed' ? 'bg-emerald-500' : 'bg-gray-700'}`}></div>
                              <span className="text-[9px] font-black uppercase tracking-widest">{task.status}</span>
                            </button>
                          </td>
                          <td className="px-6 py-5 text-[9px] font-bold text-gray-500 uppercase tracking-widest font-mono">
                            {task.createdBy?.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button className="text-gray-700 hover:text-white transition-colors"><MoreVertical size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.3em]">Network Pulse</h3>
              <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 aspect-square flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/5 opacity-20 animate-pulse"></div>
                <div className="absolute inset-12 border border-white/5 rounded-full animate-spin-slow"></div>
                
                <div className="text-center relative z-10">
                  <div className="text-4xl font-black italic tracking-tighter text-indigo-500 mb-1 uppercase">SYNC</div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Database Connected</p>
                </div>

                <div className="mt-12 w-full space-y-4 relative z-10">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[8px] font-black text-indigo-500 uppercase mb-2">Cloud Latency</p>
                    <div className="flex items-end gap-1 h-8">
                      {[4, 7, 5, 9, 3, 6, 8, 4, 10, 5].map((h, i) => (
                        <div key={i} className="flex-1 bg-indigo-500/40 rounded-sm" style={{ height: `${h * 10}%` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;0,800;1,800&display=swap');
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow { animation: spin-slow 12s linear infinite; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e1e1e; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default Dashboard;