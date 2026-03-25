import React from 'react';
import { useInView } from 'react-intersection-observer';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right';
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fade-in',
  delay = 0
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const animationClasses = {
    'fade-in': inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
    'slide-up': inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    'slide-left': inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
    'slide-right': inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${animationClasses[animation]} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;