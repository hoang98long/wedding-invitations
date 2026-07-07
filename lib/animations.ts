import type { Transition } from "framer-motion";

export const viewportOnce = { once: true, amount: 0.24 };

export const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 }
};

export const fadeLeft = {
  hidden: { opacity: 0, x: 44 },
  visible: { opacity: 1, x: 0 }
};

export const fadeRight = {
  hidden: { opacity: 0, x: -44 },
  visible: { opacity: 1, x: 0 }
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 }
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

export const smoothTransition: Transition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1]
};
