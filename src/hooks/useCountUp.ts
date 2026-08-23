import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/**
 * Animates a number from 0 to `value` once it enters the viewport (or immediately
 * if `scrollTrigger` is false, e.g. inside an already-visible admin panel).
 */
export function useCountUp(value: number, { decimals = 0, scrollTrigger = true } = {}) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(0);

  useGSAP(
    () => {
      const counter = { val: 0 };
      const tween = gsap.to(counter, {
        val: value,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => setDisplay(Number(counter.val.toFixed(decimals))),
        ...(scrollTrigger && ref.current
          ? { scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } }
          : {}),
      });
      return () => { tween.kill(); };
    },
    { dependencies: [value], scope: ref }
  );

  return { ref, display };
}
