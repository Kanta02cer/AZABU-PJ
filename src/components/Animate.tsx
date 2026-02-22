import { ReactNode } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Animation type. Default is 'slide-up' */
  animation?: 'slide-up' | 'fade' | 'zoom' | 'slide-in-right' | 'slide-in-left';
  threshold?: number;
}

/**
 * A reusable wrapper for scroll-triggered entrance animations.
 */
export function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0, 
  animation = 'slide-up',
  threshold = 0.1
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  const getAnimationClasses = () => {
    switch (animation) {
      case 'fade':
        return isVisible ? 'opacity-100' : 'opacity-0';
      case 'zoom':
        return isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90';
      case 'slide-in-right':
        return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20';
      case 'slide-in-left':
        return isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20';
      default: // slide-up
        return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20';
    }
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClasses()} transition-all duration-1000 ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface StaggerChildrenProps {
  children: ReactNode;
  interval?: number;
  className?: string;
  threshold?: number;
}

/**
 * A wrapper to stagger the entrance animations of its children.
 * Works by injecting transitionDelay into each child.
 */
export function StaggerChildren({ 
  children, 
  interval = 100, 
  className = '',
  threshold = 0.1 
}: StaggerChildrenProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? children.map((child, index) => (
        <div
          key={index}
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: `${index * interval}ms` }}
        >
          {child}
        </div>
      )) : children}
    </div>
  );
}
