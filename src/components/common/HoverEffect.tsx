import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useAccessibility';

interface HoverEffectProps {
  children: React.ReactNode;
  effect?: 'lift' | 'scale' | 'glow' | 'tilt' | 'shimmer' | 'none';
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
  disabled?: boolean;
}

const getHoverVariants = (effect: string, intensity: string, reducedMotion: boolean) => {
  if (reducedMotion || effect === 'none') {
    return {
      hover: {}
    };
  }

  const intensityMultiplier = {
    subtle: 0.5,
    medium: 1,
    strong: 1.5
  }[intensity];

  switch (effect) {
    case 'lift':
      return {
        hover: {
          y: -4 * intensityMultiplier,
          boxShadow: `0 ${8 * intensityMultiplier}px ${16 * intensityMultiplier}px rgba(0, 0, 0, 0.1)`,
          transition: {
            duration: 0.2,
            ease: 'easeOut' as any
          }
        }
      };

    case 'scale':
      return {
        hover: {
          scale: 1 + (0.05 * intensityMultiplier),
          transition: {
            duration: 0.2,
            ease: 'easeOut' as any
          }
        }
      };

    case 'glow':
      return {
        hover: {
          boxShadow: `0 0 ${20 * intensityMultiplier}px rgba(229, 9, 20, ${0.3 * intensityMultiplier})`,
          transition: {
            duration: 0.3,
            ease: 'easeOut' as any
          }
        }
      };

    case 'tilt':
      return {
        hover: {
          rotateY: 5 * intensityMultiplier,
          rotateX: 5 * intensityMultiplier,
          transition: {
            duration: 0.3,
            ease: 'easeOut' as any
          }
        }
      };

    case 'shimmer':
      return {
        hover: {
          background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
          backgroundPosition: '200% 0',
          transition: {
            backgroundPosition: {
              duration: 0.6,
              ease: 'easeInOut'
            }
          }
        }
      };

    default:
      return {
        hover: {}
      };
  }
};

const HoverEffect: React.FC<HoverEffectProps> = ({
  children,
  effect = 'lift',
  intensity = 'medium',
  className,
  disabled = false
}) => {
  const reducedMotion = useReducedMotion();
  const variants = getHoverVariants(effect, intensity, reducedMotion);

  if (disabled || reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover="hover"
      variants={variants}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </motion.div>
  );
};

export default HoverEffect;
