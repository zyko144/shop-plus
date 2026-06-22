import { useEffect, useRef } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        // We use transform to move it instantly with 0 delay
        glowRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none -z-10"
      style={{
        width: "2000px",
        height: "2000px",
        marginLeft: "-1000px", // center the glow on cursor
        marginTop: "-1000px",
        background: "radial-gradient(circle at center, rgba(255,0,0,0.15) 0%, rgba(220,38,38,0.05) 40%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}
