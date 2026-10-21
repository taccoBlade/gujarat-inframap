import React, { useState } from 'react';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flag, CheckCircle2, AlertCircle } from 'lucide-react';
import { VenueCorrectionReport } from '../../types/food';

export const ReportClosureModal: React.FC = () => {
  const { 
    isReportClosureModalOpen, 
    closeReportClosureModal, 
    reportingVenue, 
    theme 
  } = useAtlasStore();

  const [reportType, setReportType] = useState<VenueCorrectionReport['reportType']>('incorrect_hours');
  const [notes, setNotes] = useState('');
  const [userContact, setUserContact] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isReportClosureModalOpen || !reportingVenue) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    const report: VenueCorrectionReport = {
      id: 'rep_' + Date.now().toString(36),
      venueId: reportingVenue.id,
      venueName: reportingVenue.name,
      reportType,
      notes: notes.trim(),
      submittedAt: new Date().toISOString(),
      userContact: userContact.trim() || undefined
    };

    try {
      const existingRaw = localStorage.getItem('gujarat_food_reports');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      localStorage.setItem('gujarat_food_reports', JSON.stringify([report, ...existing]));
    } catch (err) {
      console.error('Failed to save report to local storage:', err);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setNotes('');
      setUserContact('');
      closeReportClosureModal();
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1600] flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeReportClosureModal}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs"
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-10 w-full max-w-lg rounded-3xl border-2 shadow-[6px_6px_0px_#101827] overflow-hidden ${
            theme === 'dark' 
              ? 'bg-[#101827] border-[#25324A] text-[#F1E8D7]' 
              : 'bg-[#FAF6ED] border-[#25324A] text-[#101827]'
          }`}
        >
          {/* Header */}
          <div className={`p-4 sm:p-5 border-b-2 flex items-center justify-between gap-3 ${
            theme === 'dark' ? 'bg-[#151F30] border-[#25324A]' : 'bg-[#F1E8D7] border-[#25324A]'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 border-2 border-rose-500/40 text-rose-500 flex items-center justify-center">
                <Flag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-editorial font-bold text-base sm:text-lg">
                  Report Closure or Issue
                </h3>
                <p className="text-xs truncate max-w-[240px] text-[#FF9418]">
                  {reportingVenue.name} ({reportingVenue.branch})
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeReportClosureModal}
              className="p-1.5 rounded-lg border hover:bg-black/10 text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          {submitted ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold font-editorial">
                Report Submitted for Editorial Review
              </h4>
              <p className={`text-xs max-w-sm mx-auto leading-relaxed ${
                theme === 'dark' ? 'text-[#8F9CAE]' : 'text-[#606F7B]'
              }`}>
                Thank you! Our Gujarat InfraMap verification moderators will cross-reference this with municipal updates and local checks.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#FF9418]">
                  Select Issue Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-xl border-2 text-xs font-medium focus:outline-none focus:border-[#FF9418] ${
                    theme === 'dark'
                      ? 'bg-[#151F30] border-[#25324A] text-white'
                      : 'bg-white border-[#25324A] text-[#101827]'
                  }`}
                >
                  <option value="incorrect_hours">Outdated / Incorrect Opening Hours</option>
                  <option value="permanently_closed">Permanently Closed / Ceased Operations</option>
                  <option value="temporarily_closed">Temporarily Closed (Renovations / Seasonal)</option>
                  <option value="wrong_location">Incorrect Coordinates / Shifted Address</option>
                  <option value="price_change">Significant Price Change / Menu Update</option>
                  <option value="other">Other Information Correction</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#FF9418]">
                  Details &amp; Observed Hours / Changes *
                </label>
                <textarea
                  required
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Venue now closes at 11:00 PM instead of 1:00 AM, or stall has shifted to opposite lane..."
                  className={`w-full px-3 py-2 rounded-xl border-2 text-xs focus:outline-none focus:border-[#FF9418] leading-relaxed resize-none ${
                    theme === 'dark'
                      ? 'bg-[#151F30] border-[#25324A] text-white placeholder-neutral-500'
                      : 'bg-white border-[#25324A] text-[#101827] placeholder-neutral-400'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#FF9418]">
                  Your Contact Email (Optional)
                </label>
                <input
                  type="email"
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  placeholder="name@example.com"
                  className={`w-full px-3 py-2 rounded-xl border-2 text-xs focus:outline-none focus:border-[#FF9418] ${
                    theme === 'dark'
                      ? 'bg-[#151F30] border-[#25324A] text-white placeholder-neutral-500'
                      : 'bg-white border-[#25324A] text-[#101827] placeholder-neutral-400'
                  }`}
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeReportClosureModal}
                  className="px-4 py-2 rounded-xl border text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] font-black text-xs border-2 border-[#101827] shadow-[2px_2px_0px_#101827] transition-all"
                >
                  Submit Report
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
