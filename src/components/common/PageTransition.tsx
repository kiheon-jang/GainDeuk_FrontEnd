import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: 'fade' | 'slide' | 'scale' | 'flip' | 'custom';
  direction?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
}

// 다양한 페이지 전환 애니메이션 정의
const getPageVariants = (type: string, direction: string, reducedMotion: boolean) => {
  if (reducedMotion) {
    return {
      initial: { opacity: 0 },
      in: { opacity: 1 },
      out: { opacity: 0 }
    };
  }


  switch (type) {
    case 'slide':
      const slideDistance = 100;
      const slideVariants = {
        initial: { 
          opacity: 0,
          x: direction === 'left' ? slideDistance : direction === 'right' ? -slideDistance : 0,
          y: direction === 'up' ? slideDistance : direction === 'down' ? -slideDistance : 0
        },
        in: { 
          opacity: 1,
          x: 0,
          y: 0
        },
        out: { 
          opacity: 0,
          x: direction === 'left' ? -slideDistance : direction === 'right' ? slideDistance : 0,
          y: direction === 'up' ? -slideDistance : direction === 'down' ? slideDistance : 0
        }
      };
      return slideVariants;

    case 'scale':
      return {
        initial: { 
          opacity: 0,
          scale: 0.8,
          y: 20
        },
        in: { 
          opacity: 1,
          scale: 1,
          y: 0
        },
        out: { 
          opacity: 0,
          scale: 1.1,
          y: -20
        }
      };

    case 'flip':
      return {
        initial: { 
          opacity: 0,
          rotateY: 90,
          scale: 0.8
        },
        in: { 
          opacity: 1,
          rotateY: 0,
          scale: 1
        },
        out: { 
          opacity: 0,
          rotateY: -90,
          scale: 0.8
        }
      };

    case 'custom':
      return {
        initial: { 
          opacity: 0,
          y: 30,
          scale: 0.95,
          filter: 'blur(10px)'
        },
        in: { 
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)'
        },
        out: { 
          opacity: 0,
          y: -30,
          scale: 1.05,
          filter: 'blur(10px)'
        }
      };

    default: // fade
      return {
        initial: { 
          opacity: 0,
          y: 20
        },
        in: { 
          opacity: 1,
          y: 0
        },
        out: { 
          opacity: 0,
          y: -20
        }
      };
  }
};

const getPageTransition = (type: string, duration: number, reducedMotion: boolean) => {
  if (reducedMotion) {
    return {
      type: 'tween',
      ease: 'easeInOut',
      duration: 0.1
    };
  }

  const baseTransition = {
    type: 'tween' as const,
    ease: 'easeInOut' as const,
    duration
  };

  switch (type) {
    case 'slide':
      return {
        ...baseTransition,
        ease: 'anticipate'
      };
    case 'scale':
      return {
        ...baseTransition,
        ease: 'backOut'
      };
    case 'flip':
      return {
        ...baseTransition,
        ease: 'easeInOut'
      };
    case 'custom':
      return {
        ...baseTransition,
        ease: 'easeOut'
      };
    default:
      return {
        ...baseTransition,
        ease: 'anticipate'
      };
  }
};

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  transitionType = 'fade',
  direction = 'up',
  duration = 0.4
}) => {
  const location = useLocation();
  // Check for reduced motion preference using CSS media query
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pageVariants = useMemo(() => 
    getPageVariants(transitionType, direction, reducedMotion), 
    [transitionType, direction, reducedMotion]
  );

  const pageTransition = useMemo(() => 
    getPageTransition(transitionType, duration, reducedMotion) as any, 
    [transitionType, duration, reducedMotion]
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{ 
          width: '100%',
          minHeight: '100%'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
