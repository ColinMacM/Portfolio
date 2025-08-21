// src/components/projects/ROSCar.jsx
import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiGitBranch } from "react-icons/fi";

/* ---------- Small, reusable scroll-reveal (same timing as others) ---------- */
function Reveal({
  children,
  from = "up",
  delay = 0,
  once = false, // false => animate in AND out as it leaves/enters the viewport
  amount = 0.25,
  className = "",
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount, once });
  const reduce = useReducedMotion();

  const directions = {
    up: { y: 24, scale: 0.98 },
    down: { y: -24, scale: 0.98 },
    left: { x: 24, scale: 0.98 },
    right: { x: -24, scale: 0.98 },
    zoom: { scale: 0.95 },
  };

  const duration = reduce ? 0 : 0.6;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[from] }}
      animate={inView ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, ...directions[from] }}
      transition={{ duration, delay: delay / 1000, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Section({ children, className = "" }) {
  return (
    <section className={`relative py-20 sm:py-28 ${className}`}>
      {/* subtle gradient divider above */}
      <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-30" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export default function ROSCar() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* top flair */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black to-transparent" />

      {/* TITLE */}
      <Section className="pt-28">
        <Reveal from="up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-orange-400">ROS</span> Car
          </h1>
        </Reveal>
      </Section>

      {/* STATUS MESSAGE */}
      <Section className="pt-0">
        <Reveal from="up" delay={60}>
          <p className="text-lg sm:text-xl leading-relaxed text-white/90 max-w-3xl">
            Not at a finished stage yet. <strong>Come back in 2 months!</strong>
          </p>
        </Reveal>
      </Section>

      {/* CTA — back to Software on the home collage */}
      <Section className="pb-28">
        <Reveal from="up">
          <div className="flex flex-wrap items-center gap-3 text-xl sm:text-2xl text-white/90">
            <FiGitBranch className="text-orange-300" />
            <span>See other things I&apos;ve done?</span>
            <Link
              to="/"
              state={{ openPanel: "software" }}
              className="underline decoration-orange-300 hover:text-orange-300"
            >
              Back to Software
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* bottom gradient fade */}
      <div className="pointer-events-none h-40 bg-gradient-to-t from-black via-black to-transparent" />
    </div>
  );
}

