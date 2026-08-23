import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section";
  /** Stagger reveal of direct children instead of animating the wrapper as one block. */
  stagger?: boolean;
  y?: number;
  delay?: number;
  once?: boolean;
};

/**
 * Fade + slide-up reveal on scroll, built on GSAP ScrollTrigger.
 * Wrap any block of markup in it instead of hand-rolling a ScrollTrigger per component.
 */
export function ScrollReveal({
  children,
  className,
  as = "div",
  stagger = false,
  y = 32,
  delay = 0,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const targets = stagger ? Array.from(ref.current.children) : ref.current;

      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: "power3.out",
        stagger: stagger ? 0.08 : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: once ? "play none none none" : "play none none reverse",
        },
      });
    },
    { scope: ref }
  );

  const Tag = as;
  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
