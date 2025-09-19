import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useAccessibility';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'stagger';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

const getAnimationVariants = (animation: string, reducedMotion: boolean) => {
  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    };
  }

  switch (animation) {
    case 'slideUp':
      return {
        hidden: { 
          opacity: 0, 
          y: 50,
          scale: 0.95
        },
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1
        }
      };

    case 'slideLeft':
      return {
        hidden: { 
          opacity: 0, 
          x: 50,
          scale: 0.95
        },
        visible: { 
          opacity: 1, 
          x: 0,
          scale: 1
        }
      };

    case 'slideRight':
      return {
        hidden: { 
          opacity: 0, 
          x: -50,
          scale: 0.95
        },
        visible: { 
          opacity: 1, 
          x: 0,
          scale: 1
        }
      };

    case 'scale':
      return {
        hidden: { 
          opacity: 0, 
          scale: 0.8,
          y: 20
        },
        visible: { 
          opacity: 1, 
          scale: 1,
          y: 0
        }
      };

    case 'stagger':
      return {
        hidden: { 
          opacity: 0
        },
        visible: { 
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      };

    default: // fadeIn
      return {
        hidden: { 
          opacity: 0,
          y: 20
        },
        visible: { 
          opacity: 1,
          y: 0
        }
      };
  }
};

const getChildVariants = (animation: string, reducedMotion: boolean) => {
  if (reducedMotion || animation !== 'stagger') {
    return {};
  }

  return {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1
    }
  };
};

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  className,
  once = true,
  staggerChildren = false,
  staggerDelay = 0.1
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    threshold, 
    once,
    margin: "-50px 0px"
  });
  const controls = useAnimation();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  const variants = getAnimationVariants(animation, reducedMotion);
  const childVariants = getChildVariants(animation, reducedMotion);

  const transition = {
    duration: reducedMotion ? 0.1 : duration,
    delay: reducedMotion ? 0 : delay,
    ease: 'easeOut'
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={transition}
      className={className}
    >
      {staggerChildren ? (
        <motion.div variants={childVariants}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
};

export default AnimatedSection;
