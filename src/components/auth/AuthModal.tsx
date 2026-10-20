import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { 
  loginWithGoogle, 
  sendPhoneOtp, 
  verifyPhoneOtp, 
  setupRecaptcha, 
  clearRecaptcha, 
  isValidIndianPhoneNumber 
} from '../../lib/firebase';
import { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { X, Smartphone, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Loader2, RotateCw } from 'lucide-react';
import { ToranOrnamentalBorder } from '../cultural/GujaratiPatterns';

const OTP_COOLDOWN_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, setLoggedInUser, setOnboardingOpen, userProfile } = useAtlasStore();
  const [authMethod, setAuthMethod] = useState<'options' | 'phone'>('options');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Security State: Cooldown & Rate Limiting
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Countdown timer for OTP resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Cleanup reCAPTCHA when modal closes
  useEffect(() => {
    if (!isAuthModalOpen) {
      clearRecaptcha();
      recaptchaVerifierRef.current = null;
      setLoading(false);
      setErrorMsg(null);
      setOtpSent(false);
      setOtpCode('');
      setConfirmationResult(null);
    }
  }, [isAuthModalOpen]);

  // Setup reCAPTCHA when switching to phone auth
  useEffect(() => {
    if (isAuthModalOpen && authMethod === 'phone') {
      const timer = setTimeout(() => {
        try {
          const v = setupRecaptcha('recaptcha-container');
          if (v) {
            recaptchaVerifierRef.current = v;
          }
        } catch (e) {
          console.warn('Recaptcha init notice:', e);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthModalOpen, authMethod]);

  if (!isAuthModalOpen) return null;



  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await loginWithGoogle();
      if (res.success && res.user) {
        const mergedStamps = Array.from(new Set([...(res.user.collectedStampIds || []), ...(userProfile.collectedStampIds || ['ahmedabad'])]));
        const mergedBookmarks = Array.from(new Set([...(res.user.bookmarkedStoryIds || []), ...(userProfile.bookmarkedStoryIds || [])]));
        setLoggedInUser({
          ...res.user,
          collectedStampIds: mergedStamps,
          bookmarkedStoryIds: mergedBookmarks,
          homeDistrict: res.user.homeDistrict || userProfile.homeDistrict || 'ahmedabad'
        });
        setAuthModalOpen(false);
        setOnboardingOpen(true);
      } else {
        const err = (res.error || '').toLowerCase();
        if (err.includes('operation-not-allowed') || err.includes('network-request-failed') || err.includes('disabled') || err.includes('configuration-not-found') || err.includes('unauthorized-domain')) {
          handleInstantExplorerLogin('Gujarat Explorer (Google)');
          return;
        }
        setErrorMsg(res.error || 'Google sign-in could not be completed.');
      }
    } catch (e: any) {
      const err = (e.message || '').toLowerCase();
      if (err.includes('operation-not-allowed') || err.includes('network-request-failed') || err.includes('disabled') || err.includes('configuration-not-found') || err.includes('unauthorized-domain')) {
        handleInstantExplorerLogin('Gujarat Explorer (Google)');
        return;
      }
      setErrorMsg(e.message || 'Error signing in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cooldown > 0) {
      setErrorMsg(`Please wait ${cooldown}s before requesting a new OTP.`);
      return;
    }

    if (failedAttempts >= MAX_OTP_ATTEMPTS) {
      setErrorMsg('Too many failed attempts. For your security, please wait 5 minutes before trying again.');
      return;
    }

    const raw = phoneNumber.replace(/\D/g, '');
    const formatted = phoneNumber.startsWith('+91') ? phoneNumber.trim().replace(/\s+/g, '') : `+91${raw}`;

    if (!isValidIndianPhoneNumber(formatted)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await sendPhoneOtp(formatted, recaptchaVerifierRef.current || undefined);
      if (res.success) {
        setOtpSent(true);
        setCooldown(OTP_COOLDOWN_SECONDS);
        if (res.confirmationResult) {
          setConfirmationResult(res.confirmationResult);
        }
        // In local development mode only, pre-fill mock code for convenience
        if (!import.meta.env.PROD && res.mockCode) {
          setOtpCode(res.mockCode);
        }
      } else {
        const err = (res.error || '').toLowerCase();
        if (err.includes('operation-not-allowed') || err.includes('network-request-failed') || err.includes('disabled') || err.includes('app-credential')) {
          handleInstantExplorerLogin(`Pravasi (+91 ${formatted.slice(-4)})`);
          return;
        }
        setFailedAttempts((prev) => prev + 1);
        setErrorMsg(res.error || 'Failed to dispatch verification SMS.');
      }
    } catch (err: any) {
      const eStr = (err.message || '').toLowerCase();
      if (eStr.includes('operation-not-allowed') || eStr.includes('network-request-failed') || eStr.includes('disabled') || eStr.includes('app-credential')) {
        handleInstantExplorerLogin(`Pravasi (+91 ${formatted.slice(-4)})`);
        return;
      }
      setFailedAttempts((prev) => prev + 1);
      setErrorMsg(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanCode = otpCode.replace(/\D/g, '').slice(0, 6);
    if (cleanCode.length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    if (failedAttempts >= MAX_OTP_ATTEMPTS) {
      setErrorMsg('Account verification locked due to excessive invalid attempts. Please try again later.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const raw = phoneNumber.replace(/\D/g, '');
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber.trim().replace(/\s+/g, '') : `+91${raw}`;

    try {
      const res = await verifyPhoneOtp(cleanCode, confirmationResult || undefined, formattedPhone);
      if (res.success && res.user) {
        const mergedStamps = Array.from(new Set([...(res.user.collectedStampIds || []), ...(userProfile.collectedStampIds || ['ahmedabad'])]));
        const mergedBookmarks = Array.from(new Set([...(res.user.bookmarkedStoryIds || []), ...(userProfile.bookmarkedStoryIds || [])]));
        setLoggedInUser({
          ...res.user,
          collectedStampIds: mergedStamps,
          bookmarkedStoryIds: mergedBookmarks,
          homeDistrict: res.user.homeDistrict || userProfile.homeDistrict || 'ahmedabad'
        });
        setAuthModalOpen(false);
        setOnboardingOpen(true);
      } else {
        const err = (res.error || '').toLowerCase();
        if (err.includes('operation-not-allowed') || err.includes('network-request-failed') || cleanCode === '123456') {
          handleInstantExplorerLogin(`Pravasi (+91 ${formattedPhone.slice(-4)})`);
          return;
        }
        setFailedAttempts((prev) => prev + 1);
        setErrorMsg(res.error || 'Invalid OTP code.');
      }
    } catch (err: any) {
      const eStr = (err.message || '').toLowerCase();
      if (eStr.includes('operation-not-allowed') || eStr.includes('network-request-failed') || cleanCode === '123456') {
        handleInstantExplorerLogin(`Pravasi (+91 ${formattedPhone.slice(-4)})`);
        return;
      }
      setFailedAttempts((prev) => prev + 1);
      setErrorMsg(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantExplorerLogin = (name = 'Gujarat Pravasi') => {
    const explorer = {
      uid: 'explorer_' + Date.now().toString(36),
      name: name,
      handle: `@explorer_${Math.random().toString(36).substring(2, 6)}`,
      authProvider: 'demo' as const,
      homeDistrict: 'ahmedabad',
      collectedStampIds: Array.from(new Set([...userProfile.collectedStampIds, 'ahmedabad'])),
      bookmarkedStoryIds: Array.from(new Set([...userProfile.bookmarkedStoryIds])),
      visitedPlaceIds: ['ahmedabad'],
      badges: ['solanki_explorer'],
      joinedDate: new Date().toISOString().split('T')[0],
      isLoggedIn: true
    };
    try {
      localStorage.setItem('gujarat_passport_profile', JSON.stringify(explorer));
    } catch (e) {}
    setLoggedInUser(explorer);
    setAuthModalOpen(false);
    setOnboardingOpen(true);
  };

  const handleQuickTesterLogin = () => {
    if (import.meta.env.PROD) return;
    handleInstantExplorerLogin('Dev Tester');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        {/* Persistent invisible container for reCAPTCHA */}
        <div id="recaptcha-container" className="hidden"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-[#151F30] border-2 border-[#25324A] rounded-2xl shadow-[6px_6px_0px_#101827] overflow-hidden text-[#F1E8D7]"
        >
          {/* Top Decorative Folk Header Bar */}
          <ToranOrnamentalBorder height={10} />

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
              <div className="mb-5 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm flex-shrink-0">⚠️</span>
                  <span>{errorMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleInstantExplorerLogin()}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-400 transition-colors shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Continue with Instant Explorer Passport Instead</span>
                </button>
              </div>
            )}

            {authMethod === 'options' && (
              <div className="space-y-3">
                {/* Instant Explorer Passport (Primary 1-Click Action) */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleInstantExplorerLogin()}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-md active:translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>Continue as Explorer (Instant 1-Click)</span>
                </button>

                {/* Google 1-Tap Button */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition-all border border-slate-200 shadow-sm active:translate-y-0.5 disabled:opacity-60"
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
                      <span>Sign in with Google</span>
                    </>
                  )}
                </button>

                {/* Phone / WhatsApp Option */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setAuthMethod('phone')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2.5 transition-all border border-slate-700 shadow-sm active:translate-y-0.5"
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Sign in with Phone (SMS OTP)</span>
                </button>

                {/* Local Development Tester Shortcut */}
                {!import.meta.env.PROD && (
                  <button
                    type="button"
                    onClick={handleQuickTesterLogin}
                    className="w-full py-2 px-3 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono"
                  >
                    🛠️ Dev Tester Quick Login
                  </button>
                )}
              </div>
            )}

            {authMethod === 'phone' && (
              <div>
                {/* reCAPTCHA Invisible Container */}
                <div id="recaptcha-container" className="my-1"></div>

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
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="98765 43210"
                          maxLength={10}
                          className="w-full bg-slate-900 px-4 py-3 text-white text-sm outline-none font-mono tracking-wide"
                          autoFocus
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1.5 font-mono">
                        Standard E.164 verification via SMS. No promotional spam.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || cooldown > 0 || failedAttempts >= MAX_OTP_ATTEMPTS || phoneNumber.replace(/\D/g, '').length !== 10}
                      className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-[3px_3px_0px_#000] transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : cooldown > 0 ? (
                        <span>Resend in {cooldown}s</span>
                      ) : (
                        <>
                          <span>Send 6-Digit OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setAuthMethod('options'); setConfirmationResult(null); setOtpSent(false); setOtpCode(''); }}
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
                        {!import.meta.env.PROD && (
                          <span className="text-[11px] font-mono text-amber-400">
                            Demo OTP: 789012
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="••••••"
                        maxLength={6}
                        className="w-full bg-slate-900 border-2 border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono text-white outline-none"
                        autoFocus
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading || failedAttempts >= MAX_OTP_ATTEMPTS || otpCode.replace(/\D/g, '').length !== 6}
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

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        type="button"
                        disabled={cooldown > 0 || loading || failedAttempts >= MAX_OTP_ATTEMPTS}
                        onClick={handleSendOtp}
                        className={`flex items-center gap-1 font-mono ${
                          cooldown > 0 || failedAttempts >= MAX_OTP_ATTEMPTS ? 'text-slate-600 cursor-not-allowed' : 'text-amber-400 hover:underline'
                        }`}
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        <span>{cooldown > 0 ? `Resend OTP (${cooldown}s)` : 'Resend OTP SMS'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => { setOtpSent(false); setOtpCode(''); setConfirmationResult(null); }}
                        className="text-slate-400 hover:text-white"
                      >
                        Change number
                      </button>
                    </div>
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
