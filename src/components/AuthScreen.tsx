import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile 
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Sparkles, Mail, Lock, User, LogIn, ChevronRight, AlertCircle, RefreshCw } from "lucide-react";

interface AuthScreenProps {
  onSuccess: () => void;
}

export default function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSyncUserProfile = async (firebaseUser: any, displayNameInput?: string, providerId?: string) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      const isOwnerAdmin = firebaseUser.email === "tiwariff07@gmail.com";
      
      if (!userSnap.exists()) {
        // Build fresh user collection record
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          name: displayNameInput || firebaseUser.displayName || firebaseUser.email.split("@")[0] || "AI Creator",
          email: firebaseUser.email,
          loginProvider: providerId || "password",
          createdAt: serverTimestamp(),
          lastActive: serverTimestamp(),
          totalGenerations: 0,
          userLanguage: "English",
          userPlatformPreference: "YouTube Shorts",
          role: "user",
          isPremium: false
        });

        // Log active login activity
        const activityRef = doc(db, "activityLogs", `reg_${firebaseUser.uid}_${Date.now()}`);
        await setDoc(activityRef, {
          userId: firebaseUser.uid,
          userEmail: firebaseUser.email,
          activityType: "register",
          timestamp: serverTimestamp(),
          metadata: "User completed first-time register credentials sync."
        });
      } else {
        // Update last-active time marker
        await setDoc(userRef, {
          lastActive: serverTimestamp()
        }, { merge: true });

        // Log active login activity
        const activityRef = doc(db, "activityLogs", `login_${firebaseUser.uid}_${Date.now()}`);
        await setDoc(activityRef, {
          userId: firebaseUser.uid,
          userEmail: firebaseUser.email,
          activityType: "login",
          timestamp: serverTimestamp(),
          metadata: `User logged in using: ${providerId || "password"}`
        });
      }
    } catch (err: any) {
      console.error("Profile synchronization incident:", err);
    }
  };

  const handleOAuthGoogle = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const provider = new GoogleAuthProvider();
      // Google parameters
      provider.setCustomParameters({
        prompt: "select_account"
      });
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await handleSyncUserProfile(result.user, result.user.displayName || "", "google.com");
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed authentication with Google account provider.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please complete the required Email and Password input parameters.");
      return;
    }
    if (isSignUp && !name) {
      setErrorMsg("Please supply your name descriptor to build your creator profile.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        // Create fresh credentials
        const result = await createUserWithEmailAndPassword(auth, email, password);
        if (result.user) {
          await updateProfile(result.user, { displayName: name });
          await handleSyncUserProfile(result.user, name, "password");
          onSuccess();
        }
      } else {
        // Login existing credentials
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user) {
          await handleSyncUserProfile(result.user, result.user.displayName || "", "password");
          onSuccess();
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setErrorMsg("Invalid Email or Credentials. Please verify details.");
      } else if (err.code === "auth/email-already-in-use") {
        setErrorMsg("This email identifier already possesses active profile registrations.");
      } else if (err.code === "auth/weak-password") {
        setErrorMsg("Security threshold unmet: Password must possess at least 6 characters.");
      } else {
        setErrorMsg(err.message || "Credential authentication pipeline halted.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-screen-layout" className="fixed inset-0 bg-[#04060c] z-50 flex items-center justify-center p-4 overflow-y-auto">
      
      {/* Dynamic Backdrops */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-indigo-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(7,10,19,0.2),rgba(4,6,12,0.98))]" />

      <div className="relative w-full max-w-md bg-[#070a13]/85 border border-slate-900/90 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Head branding visualizer */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] mx-auto shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <div className="w-full h-full bg-[#070a13] rounded-[15px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold font-display text-white tracking-tight">
              {isSignUp ? "Begin Designing Content" : "Infiltrate Prompt Console"}
            </h2>
            <p className="text-xs text-slate-400 font-sans tracking-wide max-w-xs mx-auto">
              {isSignUp 
                ? "Join the premier operating engine for YouTube Shorts, Reels, and TikTok faceless creators."
                : "Synchronize your creator profile blueprint with our real-time database."
              }
            </p>
          </div>
        </div>

        {/* Submission form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">Name Display</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-slate-500"><User className="w-4 h-4" /></span>
                <input
                  type="text"
                  placeholder="Enter name (e.g. Adarsh)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 text-slate-200 placeholder:text-slate-600 border border-slate-850 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/10 rounded-xl text-sm outline-none transition-all duration-300"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">Email Address</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-500"><Mail className="w-4 h-4" /></span>
              <input
                type="email"
                placeholder="reelforge@creator.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 text-slate-200 placeholder:text-slate-600 border border-slate-850 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/10 rounded-xl text-sm outline-none transition-all duration-300"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">Creator Passcode</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-500"><Lock className="w-4 h-4" /></span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/40 text-slate-200 placeholder:text-slate-600 border border-slate-850 focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/10 rounded-xl text-sm outline-none transition-all duration-300"
                required
              />
            </div>
          </div>

          {errorMsg && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-950/40 border border-red-500/30 text-red-300 p-3 rounded-xl text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0" />
              <span className="leading-relaxed">{errorMsg}</span>
            </motion.div>
          )}

          {/* Trigger button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm rounded-xl shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <LogIn className="w-4 h-4" />}
            <span>{isSignUp ? "Generate Account Blueprint" : "Initialize Console Control"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-900" /></div>
          <span className="relative px-3 bg-[#070a13] text-[10px] font-mono uppercase tracking-wider text-slate-500">OR CONNECT WITH</span>
        </div>

        {/* OAuth Buttons */}
        <button
          onClick={handleOAuthGoogle}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-slate-950 border border-slate-850 hover:border-slate-800 hover:bg-slate-900 hover:text-white text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
        >
          {/* Custom SVG logo Google */}
          <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Toggles */}
        <p className="text-center text-xs text-slate-500 font-sans mt-6">
          {isSignUp ? "Already registered with ReelForge?" : "Ready to scale your virality target?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:text-blue-300 font-bold underline transition-colors cursor-pointer"
          >
            {isSignUp ? "Infiltrate Console now" : "Create Creator profile"}
          </button>
        </p>

      </div>

    </div>
  );
}
