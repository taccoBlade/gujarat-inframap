export interface MotionTransition {
  type: 'tween' | 'spring' | 'keyframes' | 'inertia';
  duration?: number;
  ease?: number[] | string;
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export const MOTION_TOKENS = {
  // 100-160ms: Immediate button/control feedback
  immediate: {
    type: 'tween',
    duration: 0.13,
    ease: [0.22, 1, 0.36, 1]
  } as MotionTransition,

  // 160-240ms: Small interface transitions (search dropdowns, layer pills)
  micro: {
    type: 'tween',
    duration: 0.2,
    ease: [0.22, 1, 0.36, 1]
  } as MotionTransition,

  // 220-360ms: Panel and layout transitions (Asset Inspector drawer, Mode switcher)
  panelSpring: {
    type: 'spring',
    stiffness: 340,
    damping: 32,
    mass: 0.85
  } as MotionTransition,

  // 350-600ms: Occasional editorial reveals & stepwell line drawing
  editorialReveal: {
    type: 'tween',
    duration: 0.45,
    ease: [0.16, 1, 0.3, 1]
  } as MotionTransition
};
