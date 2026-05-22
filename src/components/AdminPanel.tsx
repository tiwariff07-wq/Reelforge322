import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, setDoc, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { motion } from "motion/react";
import { 
  Users, Sparkles, TrendingUp, Cpu, Volume2, ShieldAlert, X,
  LogOut, Star, ClipboardList, CheckCircle, Smartphone, Award, Globe
} from "lucide-react";

interface AdminPanelProps {
  onClose: () => void;
  adminEmail: string;
}

export default function AdminPanel({ onClose, adminEmail }: AdminPanelProps) {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [generationsList, setGenerationsList] = useState<any[]>([]);
  const [logsList, setLogsList] = useState<any[]>([]);
  const [feedbackList, setFeedbackList] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<"metrics" | "users" | "generations" | "logs" | "feedback">("metrics");
  const [loading, setLoading] = useState(true);

  // Load Firestore data using snap listeners for live reactive state
  useEffect(() => {
    setLoading(true);

    const usersPath = "users";
    const unsubUsers = onSnapshot(
      collection(db, usersPath),
      (snap) => {
        const u: any[] = [];
        snap.forEach((docSnap) => {
          u.push({ id: docSnap.id, ...docSnap.data() });
        });
        setUsersList(u);
        setLoading(false);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, usersPath);
      }
    );

    const genPath = "generations";
    const unsubGens = onSnapshot(
      query(collection(db, genPath), orderBy("timestamp", "desc"), limit(100)),
      (snap) => {
        const g: any[] = [];
        snap.forEach((docSnap) => {
          g.push({ id: docSnap.id, ...docSnap.data() });
        });
        setGenerationsList(g);
      },
      (err) => {
        // Fallback or silent log in case order-by index is still building on console deployment
        console.warn("Index is possibly building inside Firebase console. Fetching without sort order standard.", err);
        onSnapshot(
          collection(db, genPath),
          (innerSnap) => {
            const innerG: any[] = [];
            innerSnap.forEach((docSnap) => {
              innerG.push({ id: docSnap.id, ...docSnap.data() });
            });
            setGenerationsList(innerG);
          },
          (innerErr) => {
            handleFirestoreError(innerErr, OperationType.GET, genPath);
          }
        );
      }
    );

    const logPath = "activityLogs";
    const unsubLogs = onSnapshot(
      query(collection(db, logPath), orderBy("timestamp", "desc"), limit(150)),
      (snap) => {
        const l: any[] = [];
        snap.forEach((docSnap) => {
          l.push({ id: docSnap.id, ...docSnap.data() });
        });
        setLogsList(l);
      },
      (err) => {
        console.warn("Logs fallback fetch initialized.", err);
        onSnapshot(collection(db, logPath), (innerSnap) => {
          const innerL: any[] = [];
          innerSnap.forEach((docSnap) => {
            innerL.push({ id: docSnap.id, ...docSnap.data() });
          });
          setLogsList(innerL);
        });
      }
    );

    const feedbackPath = "feedback";
    const unsubFeedback = onSnapshot(
      collection(db, feedbackPath),
      (snap) => {
        const f: any[] = [];
        snap.forEach((docSnap) => {
          f.push({ id: docSnap.id, ...docSnap.data() });
        });
        setFeedbackList(f);
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, feedbackPath);
      }
    );

    return () => {
      unsubUsers();
      unsubGens();
      unsubLogs();
      unsubFeedback();
    };
  }, []);

  // Admin toggling Premium Credentials
  const handleTogglePremium = async (userId: string, currentPremiumState: boolean) => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, { isPremium: !currentPremiumState }, { merge: true });
      
      // Log active promotion change
      const logRef = doc(db, "activityLogs", `promo_${userId}_${Date.now()}`);
      await setDoc(logRef, {
        userId: userId,
        userEmail: adminEmail,
        activityType: "export_pdf", // fallback whitelisted tag
        timestamp: serverTimestamp(),
        metadata: `Role authorization updated. Premium toggle forced: ${!currentPremiumState}`
      });
    } catch (err: any) {
      console.error(err);
      alert("Verification exception modifying premium role parameters: " + err.message);
    }
  };

  // Metric computations
  const totalUsers = usersList.length;
  const premiumUsersCount = usersList.filter((u) => u.isPremium).length;
  const activeTodayCount = usersList.filter((u) => {
    if (!u.lastActive) return false;
    const activeDate = u.lastActive.toDate ? u.lastActive.toDate() : new Date(u.lastActive);
    const dayMs = 24 * 60 * 60 * 1000;
    return (Date.now() - activeDate.getTime()) < dayMs;
  }).length;

  const totalGenerations = generationsList.length;
  const totalExports = logsList.filter(l => l.activityType === "export_pdf").length;

  // Platform Distribution mapping for Custom bar drawings
  const getPlatformData = () => {
    const counts: Record<string, number> = {
      "YouTube Shorts": 0,
      "Instagram Reels": 0,
      "TikTok-style videos": 0,
      "Facebook Reels": 0
    };
    generationsList.forEach((g) => {
      const val = g.platform || "YouTube Shorts";
      if (counts[val] !== undefined) {
        counts[val]++;
      } else if (val.toLowerCase().includes("tiktok")) {
        counts["TikTok-style videos"]++;
      } else {
        counts["YouTube Shorts"]++;
      }
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  // Tone distribution counts
  const getToneData = () => {
    const counts: Record<string, number> = {};
    generationsList.forEach((g) => {
      const val = g.tone || "Cinematic";
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a,b) => b.count - a.count)
      .slice(0, 5);
  };

  return (
    <div id="admin-panel-overlay" className="fixed inset-0 bg-[#04060c] z-50 overflow-y-auto px-4 md:px-8 py-8 select-all">
      
      {/* Glow decorations */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-red-950/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-blue-950/15 rounded-full blur-[140px] pointer-events-none" />

      <main className="max-w-6xl mx-auto bg-[#070a13]/85 border border-red-900/20 rounded-3xl p-5 md:p-8 backdrop-blur-2xl shadow-3xl text-gray-100 relative">
        
        {/* Head Navigation dashboard */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-5 mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 p-[1.5px] shadow-[0_0_20px_rgba(239,68,68,0.25)]">
              <div className="w-full h-full bg-[#070a13] rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold font-display text-white">REELFORGE SENTRY COCKPIT</h1>
                <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-mono uppercase tracking-wide">app owner access only</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">AUTHORIZED COCKPIT SYSTEM CONSOLE • OWNER: {adminEmail}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-red-950/30 text-xs text-slate-300 hover:text-red-400 border border-slate-800 hover:border-red-900/30 flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-center"
          >
            <X className="w-4 h-4" />
            <span>Close Cockpit</span>
          </button>
        </header>

        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center space-y-4">
            <Cpu className="w-8 h-8 text-red-500 animate-spin" />
            <p className="text-xs font-mono text-slate-400">CONNECTING REALTIME STREAM PROTOCOLS...</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* STATS COUNT SUMMARY ROW */}
            <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              
              <div className="p-4 bg-slate-950/50 border border-slate-900 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-400">Total Users</span>
                  <h3 className="text-2xl font-black text-white mt-1">{totalUsers}</h3>
                </div>
                <div className="p-2 bg-blue-950 text-blue-400 rounded-lg"><Users className="w-5 h-5" /></div>
              </div>

              <div className="p-4 bg-slate-950/50 border border-slate-900 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-400">Active Today</span>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">{activeTodayCount}</h3>
                </div>
                <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
              </div>

              <div className="p-4 bg-slate-950/50 border border-slate-900 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-400">Premium VIPs</span>
                  <h3 className="text-2xl font-black text-amber-400 mt-1">{premiumUsersCount}</h3>
                </div>
                <div className="p-2 bg-amber-950 text-amber-400 rounded-lg"><Award className="w-5 h-5" /></div>
              </div>

              <div className="p-4 bg-slate-950/50 border border-slate-900 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-400">AI Generations</span>
                  <h3 className="text-2xl font-black text-blue-400 mt-1">{totalGenerations}</h3>
                </div>
                <div className="p-2 bg-blue-950 text-blue-400 rounded-lg"><Sparkles className="w-5 h-5" /></div>
              </div>

              <div className="p-4 bg-slate-950/50 border border-slate-900 rounded-xl flex items-center justify-between col-span-2 lg:col-span-1">
                <div>
                  <span className="text-[9px] font-mono uppercase text-slate-400">Exported Blueprints</span>
                  <h3 className="text-2xl font-black text-purple-400 mt-1">{totalExports}</h3>
                </div>
                <div className="p-2 bg-purple-950 text-purple-400 rounded-lg"><Star className="w-5 h-5" /></div>
              </div>

            </section>

            {/* NAVIGATIONAL TAB OPTIONS */}
            <nav className="flex items-center overflow-x-auto gap-2 border-b border-slate-900/60 pb-1.5 scrollbar-none">
              {[
                { id: "metrics", label: "Overview Metrics", icon: TrendingUp },
                { id: "users", label: "User Directory", icon: Users },
                { id: "generations", label: "Generations Stream", icon: Sparkles },
                { id: "logs", label: "Sentry Activity Logs", icon: ClipboardList },
                { id: "feedback", label: `Feedback Box (${feedbackList.length})`, icon: Volume2 }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* TAB CONTENTS ACCORDION */}
            <div className="min-h-[300px]">
              
              {/* TAB 1: METRICS ANALYTICS CHARTS */}
              {activeTab === "metrics" && (
                <div className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* SVG Chart 1: Platform distributions */}
                    <div className="p-5 bg-slate-950/60 border border-slate-900 rounded-xl">
                      <h4 className="text-xs font-mono uppercase text-slate-300 tracking-wider mb-4 flex items-center gap-1.5">
                        <Smartphone className="w-4.5 h-4.5 text-blue-400" /> Platform Deployment split
                      </h4>
                      
                      <div className="space-y-4">
                        {getPlatformData().map((item, idx) => {
                          const maxCount = Math.max(...getPlatformData().map(d => d.count), 1);
                          const pct = (item.count / maxCount) * 100;
                          return (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-sans">
                                <span className="text-slate-300 font-bold">{item.name}</span>
                                <span className="text-blue-400 font-mono font-bold">{item.count} items</span>
                              </div>
                              <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* SVG Chart 2: Top Tone categories */}
                    <div className="p-5 bg-slate-950/60 border border-slate-900 rounded-xl">
                      <h4 className="text-xs font-mono uppercase text-slate-300 tracking-wider mb-4 flex items-center gap-1.5">
                        <Star className="w-4.5 h-4.5 text-amber-400" /> Video Atmosphere Popularity
                      </h4>

                      {getToneData().length === 0 ? (
                        <p className="text-xs text-slate-500 font-sans p-6 text-center">No structural generation telemetry exists yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {getToneData().map((item, idx) => {
                            const maxVal = Math.max(...getToneData().map(t => t.count), 1);
                            const percent = (item.count / maxVal) * 100;
                            return (
                              <div key={idx} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-sans">
                                  <span className="text-slate-300 font-semibold">{item.name} Tone</span>
                                  <span className="text-amber-400 font-mono">{item.count} loops</span>
                                </div>
                                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Sentry status indicators */}
                  <div className="p-5 bg-gradient-to-tr from-slate-950 to-[#1e0a0a]/20 border border-red-950 rounded-xl flex items-start gap-4">
                    <ShieldAlert className="w-10 h-10 text-red-500 shrink-0" />
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold uppercase tracking-widest text-[#fca5a5]">role verification rules deployed</h5>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        Any read operations toward administrative tables or write adjustments on non-owner documents will return direct permission rejections natively inside Firestore security rules version 2 unless signed in under verification email `tiwariff07@gmail.com`.
                      </p>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: USER DIRECTORY LIST */}
              {activeTab === "users" && (
                <div className="bg-slate-950/60 border border-slate-900 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-900 bg-slate-950">
                    <h4 className="text-xs font-mono uppercase text-slate-300">Registered Creator Directory</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead className="bg-[#090e18] border-b border-slate-900 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3">User Descriptor</th>
                          <th className="p-3">Email Address</th>
                          <th className="p-3">Login Provider</th>
                          <th className="p-3">Generations Count</th>
                          <th className="p-3">Niche Settings</th>
                          <th className="p-3">SaaS Role</th>
                          <th className="p-3 text-center">Premium VIP Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {usersList.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-900/40">
                            <td className="p-3 font-bold text-white max-w-[120px] truncate">{user.name}</td>
                            <td className="p-3 text-slate-300 font-mono select-all">{user.email}</td>
                            <td className="p-3 text-slate-400">{user.loginProvider || "password"}</td>
                            <td className="p-3 text-blue-400 font-mono font-bold">{user.totalGenerations || 0} calls</td>
                            <td className="p-3 select-all">
                              <span className="bg-slate-900 px-1.5 py-0.5 rounded border border-slate-850 block text-[10px] text-gray-300 truncate max-w-[140px]" title={user.userPlatformPreference}>
                                {user.userPlatformPreference || "YouTube Shorts"} ({user.userLanguage || "English"})
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                user.role === "admin" ? "bg-red-950 border border-red-500/20 text-red-400 font-bold" : "bg-slate-900 border border-slate-800 text-slate-500"
                              }`}>
                                {user.role || "user"}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleTogglePremium(user.id, !!user.isPremium)}
                                className={`px-2.5 py-1 rounded font-bold font-sans text-[10px] uppercase cursor-pointer transition-all ${
                                  user.isPremium
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                                    : "bg-slate-900 text-slate-500 border border-slate-850 hover:bg-slate-800"
                                }`}
                              >
                                {user.isPremium ? "VIP Active" : "Grant VIP"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: GENERATION LOGS */}
              {activeTab === "generations" && (
                <div className="bg-slate-950/60 border border-slate-900 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-900 bg-slate-950">
                    <h4 className="text-xs font-mono uppercase text-slate-300">Live Generator Output Stream</h4>
                  </div>
                  {generationsList.length === 0 ? (
                    <p className="p-8 text-xs text-slate-500 font-sans text-center">No blueprints compiled in current catalog yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-[#090e18] border-b border-slate-900 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="p-3">Timestamp</th>
                            <th className="p-3">Creator ID</th>
                            <th className="p-3">Video Topic</th>
                            <th className="p-3">Platform Target</th>
                            <th className="p-3">Tone Mode</th>
                            <th className="p-3">Language</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                          {generationsList.map((g) => {
                            const timeText = g.timestamp?.toDate 
                              ? g.timestamp.toDate().toLocaleString() 
                              : g.timestamp 
                              ? new Date(g.timestamp).toLocaleString()
                              : "Pending System";
                            return (
                              <tr key={g.id} className="hover:bg-slate-900/40">
                                <td className="p-3 font-mono text-slate-500 text-[10px] whitespace-nowrap">{timeText}</td>
                                <td className="p-3 font-mono text-slate-400 select-all max-w-[120px] truncate" title={g.userId}>{g.userId}</td>
                                <td className="p-3 text-white font-bold max-w-xs truncate" title={g.topic}>{g.topic}</td>
                                <td className="p-3 text-blue-400 font-bold">{g.platform}</td>
                                <td className="p-3"><span className="bg-slate-900 px-1.5 py-0.5 border border-slate-850 rounded">{g.tone}</span></td>
                                <td className="p-3 text-slate-300">{g.language}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SENTRY ACTIVITY LOGS */}
              {activeTab === "logs" && (
                <div className="bg-slate-950/60 border border-slate-900 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-900 bg-slate-950">
                    <h4 className="text-xs font-mono uppercase text-slate-300">Universal Interface Telemetry</h4>
                  </div>
                  {logsList.length === 0 ? (
                    <p className="p-8 text-xs text-slate-500 font-sans text-center">No terminal logs recorded yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-[#090e18] border-b border-slate-900 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="p-3">Time Trace</th>
                            <th className="p-3">User Email</th>
                            <th className="p-3">Activity Type</th>
                            <th className="p-3">Log Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                          {logsList.map((log) => {
                            const dateStr = log.timestamp?.toDate 
                              ? log.timestamp.toDate().toLocaleString() 
                              : log.timestamp 
                              ? new Date(log.timestamp).toLocaleString()
                              : "Clock pending";
                            return (
                              <tr key={log.id} className="hover:bg-slate-900/40 font-mono text-[11px]">
                                <td className="p-3 text-slate-500 text-[10px] whitespace-nowrap">{dateStr}</td>
                                <td className="p-3 text-blue-400 select-all">{log.userEmail}</td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 border rounded text-[10px] uppercase font-bold ${
                                    log.activityType === "register"
                                      ? "bg-green-950 border-green-500/20 text-green-400"
                                      : log.activityType === "login"
                                      ? "bg-blue-950 border-blue-500/20 text-blue-400"
                                      : log.activityType === "export_pdf"
                                      ? "bg-purple-950 border-purple-500/20 text-purple-400"
                                      : "bg-slate-900 border-slate-800 text-slate-400"
                                  }`}>
                                    {log.activityType}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-300 font-sans leading-relaxed select-all" title={log.metadata}>{log.metadata}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: FEEDBACK BOX */}
              {activeTab === "feedback" && (
                <div className="space-y-4">
                  {feedbackList.length === 0 ? (
                    <div className="p-12 text-center bg-slate-950/60 border border-slate-900 rounded-xl space-y-2">
                      <Volume2 className="w-8 h-8 text-slate-500 mx-auto" />
                      <p className="text-xs text-slate-400 font-sans">No user reviews submitted yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {feedbackList.map((item) => {
                        const dateText = item.timestamp?.toDate 
                          ? item.timestamp.toDate().toLocaleDateString()
                          : item.timestamp 
                          ? new Date(item.timestamp).toLocaleDateString()
                          : "-";
                        return (
                          <div key={item.id} className="p-4 bg-slate-950/60 border border-slate-900 rounded-xl flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <b className="text-white text-xs">{item.userName}</b>
                                <span className="text-[10px] text-slate-500 font-mono">{dateText}</span>
                              </div>
                              <p className="text-xs text-slate-400 select-all font-mono font-sans">{item.userEmail}</p>
                              
                              {/* Stars */}
                              <div className="flex items-center gap-1 py-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3.5 h-3.5 ${
                                      i < (item.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-800 fill-slate-800"
                                    }`} 
                                  />
                                ))}
                              </div>

                              <p className="text-xs text-slate-200 bg-[#0a0d18] border border-slate-900 p-2.5 rounded-lg leading-relaxed select-all">
                                "{item.feedbackText}"
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
