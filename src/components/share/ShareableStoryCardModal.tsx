import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAtlasStore } from '../../stores/useAtlasStore';
import { GUJARAT_34_DISTRICTS } from '../../data/passport-districts';
import { X, Download, Share2, Sparkles, Check } from 'lucide-react';

export const ShareableStoryCardModal: React.FC = () => {
  const { activeShareModal, setShareModalOpen, userProfile } = useAtlasStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  if (!activeShareModal) return null;

  const collectedCount = userProfile.collectedStampIds.length;
  const progressPercent = Math.round((collectedCount / 34) * 100);
  const homeDistrictObj = GUJARAT_34_DISTRICTS.find(d => d.id === userProfile.homeDistrict);

  // Recent 6 stamped districts
  const recentStamps = GUJARAT_34_DISTRICTS
    .filter(d => userProfile.collectedStampIds.includes(d.id))
    .slice(0, 6);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://gujaratatlas.in/passport/${userProfile.handle}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-slate-900 border-2 border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative flex flex-col items-center"
        >
          {/* Close button */}
          <button
            onClick={() => setShareModalOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-4">
            <h3 className="font-extrabold text-white text-lg font-['Outfit']">
              Your Gujarat Passport Card
            </h3>
            <p className="text-xs text-slate-400">
              Ready for Instagram Stories &amp; WhatsApp Status
            </p>
          </div>

          {/* The 9:16 Preview Card */}
          <div 
            ref={cardRef}
            className="w-full aspect-[9/14] bg-gradient-to-b from-amber-950/80 via-slate-900 to-black rounded-xl border-3 border-amber-500 p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden text-slate-100 select-none"
          >
            {/* Background seal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-[120px] font-black">ગૂ</span>
            </div>

            {/* Card Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-amber-500/30 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-amber-500 text-black font-black flex items-center justify-center text-xs">
                  ગૂ
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-white uppercase tracking-wider font-mono">
                    GUJARAT ATLAS
                  </h4>
                  <p className="text-[9px] text-amber-300 font-['Noto_Sans_Gujarati']">
                    સાંસ્કૃતિક પાસપોર્ટ
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {progressPercent}% COMPLETE
              </span>
            </div>

            {/* Center: Big Explorer Badge & Score */}
            <div className="relative z-10 my-auto text-center space-y-3">
              
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 p-1 shadow-lg flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-amber-400 font-['Outfit'] leading-none">
                    {collectedCount}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                    / 34 Districts
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-black text-white font-['Outfit']">
                  {userProfile.name}
                </h2>
                <p className="text-xs text-slate-400 font-mono">
                  {userProfile.handle} • Home: {homeDistrictObj?.name}
                </p>
              </div>

              {/* Recent Stamps Row */}
              <div className="pt-2">
                <p className="text-[10px] uppercase font-mono tracking-wider text-amber-400/90 mb-1.5">
                  Verified District Stamps
                </p>
                <div className="flex justify-center gap-1.5 flex-wrap">
                  {recentStamps.map(s => (
                    <span 
                      key={s.id} 
                      title={s.name}
                      className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/50 flex items-center justify-center text-sm shadow"
                    >
                      {s.icon}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Card Footer */}
            <div className="relative z-10 border-t border-amber-500/30 pt-3 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>gujaratatlas.in</span>
              <span className="text-amber-400 font-bold">#GujaratUnfiltered</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full mt-4">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold border border-slate-600 flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
            </button>
            <button
              onClick={() => alert('Card snapshot saved to device!')}
              className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow"
            >
              <Download className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
