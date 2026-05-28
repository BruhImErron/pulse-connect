import { useCallback, useEffect } from 'react';

export const useRipple = () => {
  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const rect = button.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple-effect');

    const ripple = button.getElementsByClassName('ripple-effect')[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);

    // Scale background grid
    document.body.classList.add('ripple-active');
    setTimeout(() => {
      document.body.classList.remove('ripple-active');
    }, 600);

    // Remove ripple after animation
    setTimeout(() => {
      circle.remove();
    }, 600);
  }, []);

  return { createRipple };
};

export const useGlobalRipple = () => {
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('[data-impact-action]') || target.closest('[data-cursor-hover]')) {
        // Create global ripple wave
        const rippleWave = document.createElement('div');
        rippleWave.style.position = 'fixed';
        rippleWave.style.left = `${event.clientX}px`;
        rippleWave.style.top = `${event.clientY}px`;
        rippleWave.style.width = '0px';
        rippleWave.style.height = '0px';
        rippleWave.style.borderRadius = '50%';
        rippleWave.style.background = 'radial-gradient(circle, rgba(227, 0, 15, 0.2) 0%, rgba(227, 0, 15, 0.1) 50%, transparent 70%)';
        rippleWave.style.transform = 'translate(-50%, -50%)';
        rippleWave.style.pointerEvents = 'none';
        rippleWave.style.zIndex = '9999';
        rippleWave.style.transition = 'width 0.8s ease-out, height 0.8s ease-out, opacity 0.8s ease-out';

        document.body.appendChild(rippleWave);

        // Trigger animation
        requestAnimationFrame(() => {
          rippleWave.style.width = '2000px';
          rippleWave.style.height = '2000px';
          rippleWave.style.opacity = '0';
        });

        // Increase grid opacity briefly
        document.body.classList.add('ripple-active');

        // Cleanup
        setTimeout(() => {
          if (rippleWave.parentNode) {
            rippleWave.parentNode.removeChild(rippleWave);
          }
          document.body.classList.remove('ripple-active');
        }, 800);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);
};