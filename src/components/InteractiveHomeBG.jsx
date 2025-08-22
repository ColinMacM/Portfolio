// src/components/InteractiveHomeBG.jsx
// React + Vite friendly Vanta.NET background (no TypeScript).
// Uses dynamic import so it only runs in the browser bundle.
import { useEffect, useRef } from "react";

export default function InteractiveHomeBG({ children }) {
  const hostRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduced.matches) {
      // Static fallback bg if reduced motion is requested
      if (hostRef.current) hostRef.current.style.background = "#23153c";
      return;
    }

    let canceled = false;

    (async () => {
      // Dynamic imports to avoid SSR / build-time issues
      const THREE = await import("three"); // namespace module
      const vantaModule = await import("vanta/dist/vanta.net.min"); // ESM default export
      const VANTA = vantaModule.default || vantaModule;

      if (canceled || !hostRef.current) return;

      // Your requested settings:
      effectRef.current = VANTA({
        el: hostRef.current,
        THREE,                 // pass the THREE namespace
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        color: 0xff3f81,       // pink-purple net
        backgroundColor: 0x23153c, // deep purple bg
        points: 10.0,
        maxDistance: 20.0,
        spacing: 15.0,
        showDots: true,
      });
    })();

    return () => {
      canceled = true;
      if (effectRef.current?.destroy) effectRef.current.destroy();
      effectRef.current = null;
    };
  }, []);

  return (
    <div ref={hostRef} className="relative min-h-screen">
      {/* Keep your page content above the canvas */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
