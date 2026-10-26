import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({ children, direction = "up", delay = 0, duration = 700, threshold = 0.05, rootMargin = "0px 0px -40px 0px", once = true, className = "" }) {
  const ref = useRef(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const isSupported =
    typeof window !== "undefined" && "IntersectionObserver" in window;

  const [isVisible, setIsVisible] = useState(prefersReducedMotion || !isSupported);

  useEffect(() => {
    if (isVisible && once) return undefined;
    if (!isSupported || prefersReducedMotion) return undefined;

    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, once, isSupported, prefersReducedMotion, isVisible]);

  const hiddenClasses = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8",
    none: "",
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
      className={`
        transition-all
        ease-out
        motion-reduce:transition-none
        motion-reduce:transform-none
        motion-reduce:opacity-100
        ${
          isVisible
            ? "translate-x-0 translate-y-0 opacity-100"
            : `${hiddenClasses[direction] || ""} opacity-0`
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}
