/**
 * Gujarat InfraMap — 3D Motion & Tactile Physics Engine
 * 
 * Provides hardware-accelerated 3D card tilt, specular light glint, 
 * magnetic button pull, and tactile spring physics inspired by Framer Motion.
 */

(function (window, document) {
  'use strict';

  class GujaratMotionEngine {
    constructor() {
      this.cards = new Set();
      this.magneticButtons = new Set();
      this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    init() {
      if (this.isTouch) return; // Avoid 3D tilt on mobile touch devices
      this.injectStyles();
      this.scanAndBind();
      this.observeDOM();
    }

    injectStyles() {
      const style = document.createElement('style');
      style.id = 'gujaratMotionStyles';
      style.textContent = `
        /* 3D Motion Surfaces */
        .dir-card, .gu-card, .dest-card, .explore-editorial-deck {
          transform-style: preserve-3d;
          perspective: 1000px;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .glare-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          border-radius: inherit;
          opacity: 0;
          background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 70%);
          transition: opacity 0.25s ease-out;
          z-index: 10;
        }

        /* Tactile Button Press Spring */
        .dir-action-btn, .gu-btn-read-deep, .eed-link-pill, .header-icon-btn, .btn-primary-action {
          transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s ease;
        }

        .dir-action-btn:active, .gu-btn-read-deep:active, .eed-link-pill:active, .header-icon-btn:active, .btn-primary-action:active {
          transform: translate(2px, 2px) scale(0.98) !important;
          box-shadow: 1px 1px 0px var(--color-ink-black, #20201D) !important;
        }
      `;
      document.head.appendChild(style);
    }

    scanAndBind() {
      // 1. 3D Tilt Cards
      const cardSelectors = ['.dir-card', '.gu-card', '.dest-card', '.eed-content-body'];
      cardSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(card => this.bindTiltCard(card));
      });

      // 2. Magnetic Buttons
      const buttonSelectors = ['.eed-link-pill', '.dir-action-btn', '.gu-btn-read-deep', '.header-icon-btn'];
      buttonSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(btn => this.bindMagneticButton(btn));
      });
    }

    bindTiltCard(card) {
      if (this.cards.has(card)) return;
      this.cards.add(card);

      // Add specular glare element if absent
      let glare = card.querySelector('.glare-overlay');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'glare-overlay';
        card.appendChild(glare);
      }

      let bounds = null;

      card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();
        glare.style.opacity = '1';
      });

      card.addEventListener('mousemove', (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        // Normalized: -1 to 1
        const normX = (mouseX / bounds.width - 0.5) * 2;
        const normY = (mouseY / bounds.height - 0.5) * 2;

        const maxTilt = 7; // Max tilt degrees
        const tiltX = -normY * maxTilt;
        const tiltY = normX * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(6px)`;

        // Update specular highlight position
        glare.style.background = `radial-gradient(circle at ${(mouseX / bounds.width * 100).toFixed(1)}% ${(mouseY / bounds.height * 100).toFixed(1)}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 65%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        glare.style.opacity = '0';
        bounds = null;
      });
    }

    bindMagneticButton(btn) {
      if (this.magneticButtons.has(btn)) return;
      this.magneticButtons.add(btn);

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - btnCenterX) * 0.22;
        const deltaY = (e.clientY - btnCenterY) * 0.22;

        btn.style.transform = `translate(${deltaX.toFixed(1)}px, ${deltaY.toFixed(1)}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    }

    observeDOM() {
      const observer = new MutationObserver(() => {
        this.scanAndBind();
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  window.GujaratMotion = new GujaratMotionEngine();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.GujaratMotion.init());
  } else {
    window.GujaratMotion.init();
  }

})(window, document);
