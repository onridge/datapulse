import gsap from "gsap";
import { useEffect, useRef } from "react";

export const useGsapReveal = (delay = 0) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, delay, ease: "power3.out" }
    );
  }, [delay]);

  return ref;
};
