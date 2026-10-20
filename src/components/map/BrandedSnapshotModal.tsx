import React, { useState, useRef, useEffect } from 'react';
import { ToranOrnamentalBorder } from '../cultural/GujaratiPatterns';
import { 
  X, 
  Download, 
  Copy, 
  Share2, 
  Check, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  ShieldCheck, 
  Layers,
  MapPin
} from 'lucide-react';

interface BrandedSnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  currentTitle?: string;
  currentSubtitle?: string;
  currentStats?: {
    capex?: string;
    completion?: string;
    agency?: string;
    impactScore?: number;
    locality?: string;
  };
}

export const BrandedSnapshotModal: React.FC<BrandedSnapshotModalProps> = ({
  isOpen,
  onClose,
  theme,
  currentTitle = 'Gujarat Infrastructure Master Plan',
  currentSubtitle = 'High-Speed Corridors & Smart Metropolis Spatial Atlas',
  currentStats = {
    capex: '₹1,08,000 Cr',
    completion: '88% On Track',
    agency: 'NHSRCL / DICDL / GIDC',
    impactScore: 94,
    locality: 'Gujarat Mega Growth Corridors'
  }
}) => {
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [cardTheme, setCardTheme] = useState<'blueprint' | 'dark' | 'heritage'>('blueprint');
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render the branded card onto the canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = aspectRatio === '9:16' ? 1080 : 1920;
    const height = aspectRatio === '9:16' ? 1920 : 1080;
    canvas.width = width;
    canvas.height = height;

    // 1. Background Fill
    if (cardTheme === 'blueprint') {
      // Architectural Blueprint Navy-Cyan
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a1628');
      bgGrad.addColorStop(0.5, '#07111e');
      bgGrad.addColorStop(1, '#050a12');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Blueprint CAD Grid Lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 2;
      const gridSize = width / 20;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    } else if (cardTheme === 'heritage') {
      // Warm Saffron / Royal Ivory Heritage
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#1a100a');
      bgGrad.addColorStop(0.5, '#241408');
      bgGrad.addColorStop(1, '#120a04');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Dark Engineering Obsidian
      ctx.fillStyle = '#101827';
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Cultural Toran Header Trim
    const toranHeight = 16;
    const toranGrad = ctx.createLinearGradient(0, 0, width, 0);
    toranGrad.addColorStop(0, '#9D233B');
    toranGrad.addColorStop(0.25, '#FF9418');
    toranGrad.addColorStop(0.5, '#1C6555');
    toranGrad.addColorStop(0.75, '#FF9418');
    toranGrad.addColorStop(1, '#9D233B');
    ctx.fillStyle = toranGrad;
    ctx.fillRect(0, 0, width, toranHeight);

    // 3. Top Branding Tag & Logo
    const pad = width * 0.07;
    let currY = pad;

    // Platform Tag
    ctx.fillStyle = '#FF9418';
    ctx.font = 'bold 28px monospace';
    ctx.fillText('GUJARAT INFRAMAP • SPATIAL DISCOVERY PLATFORM', pad, currY);
    currY += 45;

    // Gujarati Native Subtitle
    ctx.fillStyle = 'rgba(241, 232, 215, 0.7)';
    ctx.font = '500 24px sans-serif';
    ctx.fillText('ગુજરાત ડિજિટલ પ્રવાસ & ઇન્ફ્રાસ્ટ્રક્ચર એટલાસ', pad, currY);
    currY += 80;

    // 4. Main Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 64px sans-serif';
    
    // Word wrap title
    const words = currentTitle.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > (width - pad * 2) && n > 0) {
        ctx.fillText(line, pad, currY);
        line = words[n] + ' ';
        currY += 75;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, pad, currY);
    currY += 50;

    // Subtitle
    ctx.fillStyle = '#8F9CAE';
    ctx.font = '600 32px sans-serif';
    ctx.fillText(currentSubtitle.slice(0, 70), pad, currY);
    currY += 80;

    // 5. Center Feature Visual Card / Map Frame
    const cardW = width - pad * 2;
    const cardH = aspectRatio === '9:16' ? height * 0.42 : height * 0.38;

    // Draw card box
    ctx.fillStyle = 'rgba(21, 31, 48, 0.95)';
    ctx.strokeStyle = cardTheme === 'blueprint' ? '#00F0FF' : '#FF9418';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(pad, currY, cardW, cardH, 24);
    ctx.fill();
    ctx.stroke();

    // Inner Grid in the card
    const innerPad = 40;
    const innerW = cardW - innerPad * 2;

    // Card Header
    ctx.fillStyle = cardTheme === 'blueprint' ? '#00F0FF' : '#FF9418';
    ctx.font = 'bold 30px monospace';
    ctx.fillText(`📍 ${currentStats.locality || 'HIGH-GROWTH CORRIDOR'}`, pad + innerPad, currY + 60);

    // Score Badge / Big Metric in Card
    const scoreVal = currentStats.impactScore || 94;
    ctx.fillStyle = '#10B981';
    ctx.font = '900 96px sans-serif';
    ctx.fillText(`${scoreVal}`, pad + innerPad, currY + 165);

    ctx.fillStyle = '#8F9CAE';
    ctx.font = 'bold 26px monospace';
    ctx.fillText('/100 INFRA CONNECTIVITY SCORE', pad + innerPad + 140, currY + 130);
    ctx.fillStyle = '#F1E8D7';
    ctx.font = '600 24px sans-serif';
    ctx.fillText('Top 5% Mega-Growth Infrastructure Zone in Western India', pad + innerPad + 140, currY + 165);

    // Card Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pad + innerPad, currY + 210);
    ctx.lineTo(pad + cardW - innerPad, currY + 210);
    ctx.stroke();

    // Stats Grid inside Card
    const colW = innerW / 3;
    const statY = currY + 270;

    // Stat 1: CapEx
    ctx.fillStyle = '#8F9CAE';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('ESTIMATED CAPEX', pad + innerPad, statY);
    ctx.fillStyle = '#FF9418';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(currentStats.capex || '₹42,000 Cr', pad + innerPad, statY + 45);

    // Stat 2: Completion
    ctx.fillStyle = '#8F9CAE';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('EXECUTION STATUS', pad + innerPad + colW, statY);
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(currentStats.completion || '88% On Track', pad + innerPad + colW, statY + 45);

    // Stat 3: Agency
    ctx.fillStyle = '#8F9CAE';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('RESPONSIBLE AGENCY', pad + innerPad + colW * 2, statY);
    ctx.fillStyle = '#F1E8D7';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText((currentStats.agency || 'GIDC / NHSRCL').slice(0, 16), pad + innerPad + colW * 2, statY + 45);

    currY += cardH + 70;

    // 6. Growth Insights / Broker Bullet Points
    if (aspectRatio === '9:16') {
      ctx.fillStyle = 'rgba(255, 148, 24, 0.15)';
      ctx.strokeStyle = 'rgba(255, 148, 24, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(pad, currY, cardW, 200, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FF9418';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('⚡ KEY CATALYTIC INFRASTRUCTURE:', pad + 30, currY + 45);

      ctx.fillStyle = '#F1E8D7';
      ctx.font = '500 24px sans-serif';
      ctx.fillText('✓ Grade-separated interchange with SP Ring Road & Metro Phase 2', pad + 30, currY + 90);
      ctx.fillText('✓ High Speed Rail 320 km/h Shinkansen terminal reachability < 15 min', pad + 30, currY + 130);
      ctx.fillText('✓ Sovereign semiconductor & mega industrial investment corridor', pad + 30, currY + 170);

      currY += 260;
    }

    // 7. Permanent Official Watermark Banner (CRITICAL FOR VIRALITY)
    const watermarkH = 110;
    const watermarkY = height - watermarkH;

    ctx.fillStyle = '#0a101d';
    ctx.fillRect(0, watermarkY, width, watermarkH);

    ctx.strokeStyle = '#25324A';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, watermarkY);
    ctx.lineTo(width, watermarkY);
    ctx.stroke();

    // Watermark Icon & URL
    ctx.fillStyle = '#FF9418';
    ctx.font = '900 36px sans-serif';
    ctx.fillText('🌐 gujarat-inframap.vercel.app', pad, watermarkY + 68);

    ctx.fillStyle = '#8F9CAE';
    ctx.font = 'bold 22px monospace';
    const verifiedText = 'VERIFIED GIS SPATIAL INTELLIGENCE';
    const textW = ctx.measureText(verifiedText).width;
    ctx.fillText(verifiedText, width - pad - textW, watermarkY + 68);

  }, [isOpen, aspectRatio, cardTheme, currentTitle, currentSubtitle, currentStats]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    const link = document.createElement('a');
    link.download = `gujarat-inframap-${aspectRatio === '9:16' ? 'story' : 'landscape'}-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png', 1.0);
    link.click();
    setTimeout(() => setIsDownloading(false), 800);
  };

  const handleCopy = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      });
    } catch (err) {
      console.warn('Clipboard write note:', err);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Check out this 3D Gujarat Infrastructure Master Plan card: ${currentTitle} (Score: ${currentStats.impactScore || 94}/100) — Generated on https://gujarat-inframap.vercel.app`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border-2 shadow-[8px_8px_0px_#101827] overflow-hidden ${
          theme === 'dark' ? 'bg-[#151F30] border-[#25324A] text-[#F1E8D7]' : 'bg-[#FAF6ED] border-[#25324A] text-[#101827]'
        }`}
      >
        {/* Cultural Accent Trim */}
        <ToranOrnamentalBorder className="w-full flex-shrink-0" height={8} />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-2 border-[#25324A] flex items-center justify-between gap-4 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-[#FF9418]/20 text-[#FF9418] border border-[#FF9418]/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                📸 Viral Growth Engine
              </span>
              <span className="text-[10px] font-mono text-[#8F9CAE]">
                High-Res Card with Permanent Watermark
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black font-editorial tracking-tight">
              Export Branded Story Card for Brokers &amp; Creators
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-[#25324A] hover:border-[#FF9418] hover:text-[#FF9418] transition-colors"
            aria-label="Close export card modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Toolbar */}
        <div className="px-4 py-3 bg-[#101827]/70 border-b border-[#25324A] flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
          
          {/* Aspect Ratio Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#8F9CAE] font-bold">FORMAT:</span>
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all ${
                aspectRatio === '9:16'
                  ? 'bg-[#FF9418] text-[#101827] border-[#101827] font-black'
                  : 'bg-[#151F30] text-[#8F9CAE] border-[#25324A]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16 Story / Reel</span>
            </button>
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition-all ${
                aspectRatio === '16:9'
                  ? 'bg-[#FF9418] text-[#101827] border-[#101827] font-black'
                  : 'bg-[#151F30] text-[#8F9CAE] border-[#25324A]'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>16:9 LinkedIn / X</span>
            </button>
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#8F9CAE] font-bold">THEME:</span>
            {(['blueprint', 'dark', 'heritage'] as const).map(t => (
              <button
                key={t}
                onClick={() => setCardTheme(t)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold capitalize border ${
                  cardTheme === t
                    ? 'bg-[#00F0FF]/20 text-[#00F0FF] border-[#00F0FF]'
                    : 'bg-[#151F30] text-[#8F9CAE] border-[#25324A]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

        </div>

        {/* Live Canvas Preview */}
        <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-black/40">
          <div className="relative max-h-[50vh] flex items-center justify-center">
            <canvas 
              ref={canvasRef}
              className="max-h-[48vh] max-w-full rounded-xl border-2 border-[#25324A] shadow-[4px_4px_0px_#101827] object-contain"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t-2 border-[#25324A] bg-[#101827]/80 flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#10B981]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Watermarked: gujarat-inframap.vercel.app</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl border-2 border-[#25324A] hover:border-[#FF9418] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied PNG!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-xs flex items-center gap-1.5 border border-[#101827] shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-1.5 rounded-xl bg-[#FF9418] hover:bg-[#e07f10] text-[#101827] font-black text-xs flex items-center gap-1.5 border-2 border-[#101827] shadow-[2px_2px_0px_#101827] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Exporting...' : 'Download PNG'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
