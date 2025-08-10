// src/components/Straumbeest.jsx
import { useEffect, useRef } from 'react';
import { createStraumbeestViewer } from "../../utils/straumbeestViewer";
// import './Straumbeest.css';  // your styles

export default function Straumbeest() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Pass the container DOM node and the .glb URL
      viewerRef.current = createStraumbeestViewer(
        containerRef.current,
        '/models/straumbeest.glb'
      );
    }
    return () => {
      // Cleanup: remove renderer’s <canvas>
      if (viewerRef.current) {
        containerRef.current.removeChild(viewerRef.current.renderer.domElement);
        // Optionally dispose scene, controls, etc.
      }
    };
  }, []);

  return (
    <div className="straumbeest-page">
      <h1>Straumbeest 3D Viewer</h1>
      <div
        className="straumbeest-viewer-container"
        ref={containerRef}
        style={{ width: '100%', height: '600px' }}
      />
    </div>
  );
}
