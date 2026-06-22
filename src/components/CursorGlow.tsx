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
        width: "1200px",
        height: "1200px",
        marginLeft: "-600px", // center the glow on cursor
        marginTop: "-600px",
        background: "radial-gradient(circle at center, rgba(255,0,0,0.2) 0%, rgba(255,0,0,0.08) 30%, transparent 60%)",
        willChange: "transform",
      }}
    />
  );
}
