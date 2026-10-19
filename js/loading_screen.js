/**
 * Gujarat InfraMap — High-Performance Cinematic Gujarati Loading Screen
 * 
 * Implements an immersive preloader celebrating authentic Gujarati visual culture:
 * - Geometric Toran & Mandana rotating SVG rosettes
 * - Subterranean Solanki stepwell tier silhouettes
 * - Radiant 8-pointed Ajrakh celestial star with turmeric & madder red gradients
 * - Dynamic mirrorwork (Aabhla) specular gleam animations
 * - Animated Gujarati typography: "ગુજરાત ઇન્ફ્રામેપ • ડિજિટલ એટલાસ"
 * - Live progress counter with stylized Gujarati numerals (૧, ૨, ૩... ૧૦૦%)
 * - Cinematic shutter-iris wipe exit transition
 */

(function (window, document) {
  'use strict';

  const GUJARATI_NUMERALS = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];

  function toGujaratiNumber(num) {
    return String(num).split('').map(char => {
      const d = parseInt(char, 10);
      return !isNaN(d) ? GUJARATI_NUMERALS[d] : char;
    }).join('');
  }

  const CULTURAL_PROVERBS = [
    "જ્યાં જ્યાં વસે એક ગુજરાતી, ત્યાં ત્યાં સદાકાળ ગુજરાત.",
    "પાટણની વાવથી કચ્છના રણ સુધી — ગુજરાતની ભવ્યતા.",
    "સોરઠ ધરા સોહામણી, જ્યાં નિર્મળ વહેતાં નીર.",
    "અણહિલવાડ પાટણના શિલ્પો અને આધુનિક ગુજરાતનું નિર્માણ.",
    "સૌરાષ્ટ્રની રસધારા અને નર્મદાનો અમૃત પ્રવાહ."
  ];

  class GujaratLoadingScreen {
    constructor() {
      this.container = null;
      this.progressBar = null;
      this.percentText = null;
      this.gujNumText = null;
      this.proverbText = null;
      this.currentProgress = 0;
      this.targetProgress = 0;
      this.isDismissed = false;
      this.animationFrame = null;
    }

    init() {
      // Check if already injected
      if (document.getElementById('gujaratLoadingScreen')) return;

      this.injectStyles();
      this.createDOM();
      this.startProgressSimulation();
      this.bindWindowLoad();
    }

    injectStyles() {
      const style = document.createElement('style');
      style.id = 'gujaratLoadingStyles';
      style.textContent = `
        #gujaratLoadingScreen {
          position: fixed;
          inset: 0;
          z-index: 999999;
          background: #0F172A;
          background-image: 
            radial-gradient(circle at 50% 40%, rgba(226, 174, 72, 0.12) 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(184, 70, 56, 0.08) 0%, transparent 40%),
            linear-gradient(180deg, #090E17 0%, #0F172A 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #F6F0E5;
          font-family: 'Cabinet Grotesk', system-ui, -apple-system, sans-serif;
          overflow: hidden;
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        #gujaratLoadingScreen.fade-out {
          opacity: 0;
          pointer-events: none;
          transform: scale(1.04);
        }

        .gl-background-motifs {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.18;
          background-image: 
            radial-gradient(#E2AE48 1px, transparent 1px),
            radial-gradient(#B84638 1px, transparent 1px);
          background-size: 32px 32px;
          background-position: 0 0, 16px 16px;
        }

        .gl-center-composition {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
          max-width: 520px;
          width: 90%;
          text-align: center;
        }

        /* Rotating Sacred Rosette */
        .gl-mandala-wrapper {
          position: relative;
          width: 140px;
          height: 140px;
          margin-bottom: 1.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gl-svg-mandala {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: glSpin 24s linear infinite;
          transform-origin: center center;
        }

        .gl-svg-inner-ring {
          position: absolute;
          width: 75%;
          height: 75%;
          animation: glSpinReverse 16s linear infinite;
          transform-origin: center center;
        }

        .gl-star-core {
          position: relative;
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #E2AE48 0%, #B84638 100%);
          clip-path: polygon(50% 0%, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0% 50%, 35% 35%);
          box-shadow: 0 0 30px rgba(226, 174, 72, 0.6);
          animation: glPulseCore 2.5s ease-in-out infinite;
        }

        /* Mirrorwork (Aabhla) Specular Glint */
        .gl-aabhla-gleam {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #FFFFFF;
          border-radius: 50%;
          top: 32%;
          left: 32%;
          box-shadow: 0 0 12px #FFFFFF;
          animation: glGlint 3s ease-in-out infinite;
        }

        @keyframes glSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes glSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes glPulseCore {
          0%, 100% { transform: scale(0.95); filter: drop-shadow(0 0 10px rgba(226, 174, 72, 0.4)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 25px rgba(226, 174, 72, 0.8)); }
        }

        @keyframes glGlint {
          0%, 100% { opacity: 0.2; transform: scale(0.6); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        /* Typography */
        .gl-badge-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(226, 174, 72, 0.15);
          border: 1.5px solid #E2AE48;
          color: #E2AE48;
          padding: 0.25rem 0.85rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .gl-brand-title {
          font-size: 2.25rem;
          font-weight: 900;
          color: #F6F0E5;
          letter-spacing: -0.03em;
          margin: 0 0 0.35rem 0;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .gl-brand-title span {
          color: #E2AE48;
        }

        .gl-brand-gujarati {
          font-family: 'Noto Sans Gujarati', sans-serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #B84638;
          margin: 0 0 1.5rem 0;
          letter-spacing: 0.02em;
        }

        /* Progress Bar & Numerical Readout */
        .gl-progress-container {
          width: 100%;
          max-width: 340px;
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid #20201D;
          border-radius: 999px;
          height: 10px;
          padding: 2px;
          box-shadow: 3px 3px 0px #20201D;
          margin-bottom: 1rem;
          position: relative;
          overflow: hidden;
        }

        .gl-progress-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #B84638 0%, #E2AE48 50%, #315BD6 100%);
          border-radius: 999px;
          transition: width 0.15s ease-out;
          box-shadow: 0 0 10px rgba(226, 174, 72, 0.5);
        }

        .gl-metrics-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 340px;
          font-size: 0.85rem;
          color: #94A3B8;
          font-weight: 700;
          margin-bottom: 1.25rem;
        }

        .gl-guj-counter {
          color: #E2AE48;
          font-size: 1rem;
          font-family: 'Noto Sans Gujarati', sans-serif;
        }

        /* Proverb Ticker */
        .gl-proverb-box {
          font-family: 'Noto Sans Gujarati', serif;
          font-size: 0.88rem;
          color: #CBD5E1;
          font-style: italic;
          opacity: 0.85;
          max-width: 420px;
          min-height: 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `;
      document.head.appendChild(style);
    }

    createDOM() {
      const overlay = document.createElement('div');
      overlay.id = 'gujaratLoadingScreen';
      overlay.setAttribute('role', 'alert');
      overlay.setAttribute('aria-live', 'polite');
      overlay.setAttribute('aria-label', 'Loading Gujarat InfraMap');

      const randomProverb = CULTURAL_PROVERBS[Math.floor(Math.random() * CULTURAL_PROVERBS.length)];

      overlay.innerHTML = `
        <div class="gl-background-motifs" aria-hidden="true"></div>

        <div class="gl-center-composition">
          <!-- Sacred Rosette Architecture -->
          <div class="gl-mandala-wrapper" aria-hidden="true">
            <!-- Outer Toran Geometry -->
            <svg class="gl-svg-mandala" viewBox="0 0 100 100" fill="none" stroke="#E2AE48" stroke-width="1.5">
              <circle cx="50" cy="50" r="46" stroke-dasharray="3 3" opacity="0.6" />
              <polygon points="50,4 62,38 96,50 62,62 50,96 38,62 4,50 38,38" opacity="0.75" />
              <circle cx="50" cy="50" r="30" stroke="#B84638" stroke-width="1.2" opacity="0.8" />
            </svg>

            <!-- Inner Stepwell Concentric Ring -->
            <svg class="gl-svg-inner-ring" viewBox="0 0 100 100" fill="none" stroke="#F6F0E5" stroke-width="1.2">
              <rect x="25" y="25" width="50" height="50" rx="4" transform="rotate(45 50 50)" opacity="0.65" />
              <circle cx="50" cy="50" r="18" stroke-dasharray="2 4" stroke="#E2AE48" />
            </svg>

            <!-- Glowing Ajrakh Star Center -->
            <div class="gl-star-core">
              <div class="gl-aabhla-gleam"></div>
            </div>
          </div>

          <!-- Cultural Typography -->
          <div class="gl-badge-pill">
            <span>✦</span> 34 Districts • Digital Twin
          </div>
          <h1 class="gl-brand-title">Gujarat <span>InfraMap</span></h1>
          <p class="gl-brand-gujarati">ગુજરાત ઇન્ફ્રામેપ • ડિજિટલ એટલાસ</p>

          <!-- Real-Time Progress -->
          <div class="gl-progress-container" aria-hidden="true">
            <div class="gl-progress-fill" id="glProgressFill"></div>
          </div>

          <div class="gl-metrics-row">
            <span id="glStatusText">Authenticating Spatial Layers...</span>
            <span class="gl-guj-counter" id="glGujCounter">૦%</span>
          </div>

          <!-- Proverb -->
          <div class="gl-proverb-box" id="glProverbBox">
            "${randomProverb}"
          </div>
        </div>
      `;

      document.body.prepend(overlay);
      this.container = overlay;
      this.progressBar = overlay.querySelector('#glProgressFill');
      this.statusText = overlay.querySelector('#glStatusText');
      this.gujNumText = overlay.querySelector('#glGujCounter');
      this.proverbText = overlay.querySelector('#glProverbBox');
    }

    startProgressSimulation() {
      const stepLabels = [
        { at: 20, text: 'Mapping Solanki Architecture & Stepwells...' },
        { at: 45, text: 'Synchronizing 34 District Boundaries...' },
        { at: 70, text: 'Loading Gujarat Unfiltered Research...' },
        { at: 90, text: 'Calibrating Interactive Cartography...' },
        { at: 100, text: 'Gujarat, beyond the obvious.' }
      ];

      const tick = () => {
        if (this.currentProgress < this.targetProgress) {
          this.currentProgress = Math.min(this.targetProgress, this.currentProgress + 2);
          if (this.progressBar) this.progressBar.style.width = `${this.currentProgress}%`;
          if (this.gujNumText) {
            this.gujNumText.textContent = `${toGujaratiNumber(this.currentProgress)}% (${this.currentProgress}%)`;
          }

          const currentStep = stepLabels.find(s => this.currentProgress <= s.at);
          if (currentStep && this.statusText) {
            this.statusText.textContent = currentStep.text;
          }
        }

        if (this.currentProgress >= 100 && !this.isDismissed) {
          this.dismiss();
          return;
        }

        this.animationFrame = requestAnimationFrame(tick);
      };

      this.targetProgress = 35;
      setTimeout(() => { if (!this.isDismissed) this.targetProgress = 75; }, 400);
      setTimeout(() => { if (!this.isDismissed) this.targetProgress = 95; }, 800);

      this.animationFrame = requestAnimationFrame(tick);
    }

    bindWindowLoad() {
      // Once Leaflet and assets are ready, quickly transition to 100%
      const markReady = () => {
        this.targetProgress = 100;
      };

      if (document.readyState === 'complete') {
        setTimeout(markReady, 1000);
      } else {
        window.addEventListener('load', () => setTimeout(markReady, 600));
      }

      // Safety timeout (never block longer than 2.8s)
      setTimeout(() => {
        this.targetProgress = 100;
      }, 2400);
    }

    dismiss() {
      if (this.isDismissed) return;
      this.isDismissed = true;
      cancelAnimationFrame(this.animationFrame);

      if (this.progressBar) this.progressBar.style.width = '100%';
      if (this.gujNumText) this.gujNumText.textContent = '૧૦૦%';
      if (this.statusText) this.statusText.textContent = 'Ready!';

      setTimeout(() => {
        if (this.container) {
          this.container.classList.add('fade-out');
          setTimeout(() => {
            if (this.container && this.container.parentNode) {
              this.container.parentNode.removeChild(this.container);
            }
          }, 850);
        }
      }, 250);
    }
  }

  window.GujaratLoadingScreen = new GujaratLoadingScreen();
  // Auto initialize on DOMContentLoaded or immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.GujaratLoadingScreen.init());
  } else {
    window.GujaratLoadingScreen.init();
  }

})(window, document);
