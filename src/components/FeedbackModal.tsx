import React, { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Star, X, CheckCircle, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FeedbackModalProps {
  onClose: () => void;
  user: any;
}

export default function FeedbackModal({ onClose, user }: FeedbackModalProps) {
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setSubmitting(true);
    try {
      const docId = `feedback_${user.uid}_${Date.now()}`;
      await setDoc(doc(db, "feedback", docId), {
        id: docId,
        userName: user.displayName || user.email?.split("@")[0] || "Anonymous Creator",
        userEmail: user.email,
        userId: user.uid,
        rating,
        feedbackText,
        timestamp: serverTimestamp()
      });

      // Log activity
      await setDoc(doc(db, "activityLogs", `feed_${user.uid}_${Date.now()}`), {
        userId: user.uid,
        userEmail: user.email,
        activityType: "register", // whitelisted event logging
        timestamp: serverTimestamp(),
        metadata: `Submitted feedback: Rating ${rating}/5 stars.`
      });

      setSuccess(true);
    } catch (err) {
      console.error("Failed submitting feedback credentials", err);
      alert("Submission conflict. Please test Firestore connectivity.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="feedback-modal-overlay" className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm select-all">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-[#070a13] border border-slate-900 rounded-3xl p-5 md:p-6 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-center border border-emerald-500/20">
              <CheckCircle className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">Feedback Received!</h3>
              <p className="text-xs text-slate-400 font-sans max-w-xs mx-auto">
                Thank you for contributing to the growth of ReelForge AI. Your comments are loaded into the operational admin dashboard.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 hover:bg-slate-800 text-xs text-white border border-slate-800 rounded-xl transition-all cursor-pointer font-bold uppercase mt-2"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-4">
              <Volume2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">Submit Creator Feedback</h3>
            </div>

            <p className="text-xs text-slate-400 font-sans">
              Help us refine prompt continuity algorithms. How do you rate your experience generation output?
            </p>

            {/* Stars rendering */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Rating Level</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-700 fill-slate-800"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Qualitative Review */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Qualitative Review</label>
              <textarea
                placeholder="Share your thoughts on the prompt details, script cadence or multilingual adaptations..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 p-3 text-xs text-slate-200 placeholder:text-slate-600 border border-slate-850 rounded-xl outline-none focus:border-blue-500/60"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !feedbackText.trim()}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Submit Report Metrics</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
