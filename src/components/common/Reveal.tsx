import React, { useEffect, useRef, useState } from 'react';

type RevealVariant = 'up' | 'left' | 'right' | 'scale' | 'image';

type RevealProps = React.HTMLAttributes<HTMLElement> & {
  variant?: RevealVariant;
  delay?: number;
  as?: React.ElementType;
};

export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  as: Tag = 'div',
  style,
  ...rest
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return React.createElement(
    Tag,
    {
      ref,
      className: `reveal reveal-${variant} ${isVisible ? 'is-visible' : ''} ${className}`,
      style: { ...style, '--reveal-delay': `${delay}ms` } as React.CSSProperties,
      ...rest,
    },
    children,
  );
};
