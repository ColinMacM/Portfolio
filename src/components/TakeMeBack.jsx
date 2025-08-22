// src/components/TakeMeBack.jsx
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";

export default function TakeMeBack({
  defaultPanel = "about",      // which collage panel to open on Home
  label = "Take me back",      // button text
  className = "",              // optional extra classes
}) {
  const navigate = useNavigate();

  const goBack = () => {
    // Prefer real back if user came from within the app.
    // React Router v6 puts an idx into history.state.
    if (window.history?.state?.idx > 0) {
      navigate(-1);
    } else {
      // Direct landings/bookmarks go to Home with the panel you want to show.
      navigate("/", { replace: true, state: { openPanel: defaultPanel } });
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`fixed left-4 top-4 z-50 ${className}`}>
      <motion.button
        onClick={goBack}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label={label}
      >
        <FiArrowLeft />
        {label}
      </motion.button>

      {/* No-JS fallback */}
      <noscript>
        <Link to="/" state={{ openPanel: defaultPanel }}>← {label}</Link>
      </noscript>
    </div>
  );
}
