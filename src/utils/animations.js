// Smooth scroll utility
export const smoothScroll = (targetId) => {
  const element = document.getElementById(targetId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// Enable smooth scrolling globally
export const enableSmoothScroll = () => {
  document.documentElement.style.scrollBehavior = 'smooth';
};

// Intersection Observer hook for fade-in animations
export const useFadeInAnimation = (ref, threshold = 0.1) => {
  if (typeof window === 'undefined') return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    },
    { threshold, rootMargin: '0px 0px -100px 0px' }
  );

  if (ref.current) {
    observer.observe(ref.current);
  }

  return () => {
    if (ref.current) {
      observer.unobserve(ref.current);
    }
  };
};

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.4, ease: 'easeOut' }
};
