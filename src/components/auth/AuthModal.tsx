import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { loginWithGoogle, sendPhoneOtp, verifyPhoneOtp } from '../../lib/firebase';
import { X, Smartphone, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, setLoggedInUser, setOnboardingOpen } = useAtlasStore();
  const [authMethod, setAuthMethod] = useState<'options' | 'phone'>('options');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await loginWithGoogle();
      if (res.success && res.user) {
        setLoggedInUser(res.user);
        setAuthModalOpen(false);
        // If user has not picked a custom home district yet, open onboarding
        setOnboardingOpen(true);
      } else {
        setErrorMsg(res.error || 'Google sign-in could not be completed.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Error signing in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const formatted = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber.replace(/\D/g, '')}`;
      const res = await sendPhoneOtp(formatted);
      if (res.success) {
        setOtpSent(true);
        if (res.mockCode) {
          // Pre-populate or show hint for demo convenience
          setOtpCode(res.mockCode);
        }
      } else {
        setErrorMsg(res.error || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await verifyPhoneOtp(otpCode, undefined, phoneNumber);
      if (res.success && res.user) {
        setLoggedInUser(res.user);
        setAuthModalOpen(false);
        setOnboardingOpen(true);
      } else {
        setErrorMsg(res.error || 'Invalid OTP code.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTesterLogin = () => {
    const demoUser = {
      uid: 'tester_' + Date.now().toString(36),
      name: 'Hardik Shah',
      email: 'hardik.explorer@gujaratatlas.in',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      handle: '@hardik_ahmedabad',
      authProvider: 'demo' as const,
      homeDistrict: 'ahmedabad',
      collectedStampIds: ['ahmedabad', 'patan', 'junagadh', 'kachchh'],
      bookmarkedStoryIds: ['story-signature-farm'],
      visitedPlaceIds: ['ahmedabad', 'patan'],
      badges: ['solanki_explorer', 'saurashtra_scout'],
      joinedDate: new Date().toISOString().split('T')[0],
      isLoggedIn: true
    };
    setLoggedInUser(demoUser);
    setAuthModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-[#0f172a] border-2 border-amber-500/60 rounded-2xl shadow-[0_20px_60px_rgba(245,158,11,0.2)] overflow-hidden text-slate-100"
        >
          {/* Top Decorative Folk Header Bar */}
          <div className="h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500" />

          {/* Close Button */}
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                ગૂ
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                Pravas Identity • પ્રવાસ પાસપોર્ટ
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white font-['Outfit'] mb-1">
              Claim Your Gujarat Passport
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Sync your 34-district travel stamps, unlock secret folklore dossiers, and generate viral 9:16 story cards.
            </p>

            {errorMsg && (
              <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2">
                <span className="text-sm">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {authMethod === 'options' && (
              <div className="space-y-3">
                {/* Google 1-Tap Button */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition-all border-2 border-slate-200 shadow-[3px_3px_0px_rgba(245,158,11,0.5)] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Phone / WhatsApp Option */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setAuthMethod('phone')}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm flex items-center justify-center gap-2.5 transition-all border-2 border-slate-700 shadow-[3px_3px_0px_#334155] active:translate-x-0.5 active:translate-y-0.5"
                >
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span>Continue with Phone / WhatsApp</span>
                </button>

                {/* Instant Quick Tester Login */}
                <div className="pt-2">
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-800" />
                    <span className="flex-shrink mx-3 text-[11px] font-mono uppercase text-slate-500">
                      Or one-click test
                    </span>
                    <div className="flex-grow border-t border-slate-800" />
                  </div>

                  <button
                    type="button"
                    onClick={handleQuickTesterLogin}
                    className="w-full py-2.5 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Instant Demo Explorer Login (No Credentials Required)</span>
                  </button>
                </div>
              </div>
            )}

            {authMethod === 'phone' && (
              <div>
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Mobile Number (India)
                      </label>
                      <div className="flex rounded-xl overflow-hidden border-2 border-slate-700 focus-within:border-amber-400 transition-colors">
                        <span className="bg-slate-800 text-slate-400 px-3.5 py-3 text-sm font-bold flex items-center border-r border-slate-700">
                          +91
                        </span>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="98765 43210"
                          maxLength={12}
                          className="w-full bg-slate-900 px-4 py-3 text-white text-sm outline-none font-mono"
                          autoFocus
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] transition-all disabled:opacity-60"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span>Send 6-Digit OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setAuthMethod('options')}
                      className="w-full text-center text-xs text-slate-400 hover:text-white pt-1"
                    >
                      ← Back to all sign-in options
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                          Enter 6-Digit OTP
                        </label>
                        <span className="text-[11px] font-mono text-amber-400">
                          Demo OTP: 789012
                        </span>
                      </div>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="789012"
                        maxLength={6}
                        className="w-full bg-slate-900 border-2 border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono text-white outline-none"
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length !== 6}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Verify &amp; Unlock Passport</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setOtpSent(false); setOtpCode(''); }}
                      className="w-full text-center text-xs text-slate-400 hover:text-white pt-1"
                    >
                      Change phone number
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Privacy pledge */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400/80" />
              <span>Zero spam guarantee. Cloud-synced across devices.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
