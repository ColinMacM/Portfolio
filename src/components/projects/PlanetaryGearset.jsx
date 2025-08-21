// src/components/projects/PlanetaryGearset.jsx
import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiGitBranch, FiBookOpen, FiSettings } from "react-icons/fi";

// ---------- Small, reusable scroll-reveal (same timing as About/Baja/Skygauge) ----------
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

export default function PlanetaryGearset() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* top flair */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black to-transparent" />

      {/* TITLE */}
      <Section className="pt-28">
        <Reveal from="up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Planetary Gearset
          </h1>
        </Reveal>
        <Reveal from="up" delay={80}>
          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-white/90 max-w-3xl">
            A compact multi-ratio transmission that combines a sun gear (input), planet gears, a ring
            gear (internal teeth), and a carrier (output). By fixing one member and driving another,
            multiple reductions fit in the same envelope.
          </p>
        </Reveal>
      </Section>

      {/* HERO / COVER (from PDF) */}
      <Section className="pt-0">
        <Reveal from="zoom">
          <img
            src="/assets/gear-01.png"
            alt="Planetary gearset overview"
            className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
            loading="lazy"
          />
        </Reveal>
      </Section>

      {/* HOW IT WORKS */}
      <Section className="pt-0">
        <Reveal from="up">
          <div className="flex items-center gap-3 text-orange-300">
            <FiBookOpen aria-hidden />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How it works</h2>
          </div>
        </Reveal>

        <div className="mt-8 grid sm:grid-cols-3 gap-6">
          <Reveal from="up">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="font-semibold text-white">Ring Fixed</div>
              <div className="text-white/75 text-sm mt-1">Input: Sun → Output: Carrier</div>
              <div className="mt-3 text-white/90">
                i = 1 + Z<sub>ring</sub> / Z<sub>sun</sub>
              </div>
            </div>
          </Reveal>
          <Reveal from="up" delay={60}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="font-semibold text-white">Carrier Fixed</div>
              <div className="text-white/75 text-sm mt-1">Input: Sun → Output: Ring</div>
              <div className="mt-3 text-white/90">
                i = − Z<sub>ring</sub> / Z<sub>sun</sub>
              </div>
            </div>
          </Reveal>
          <Reveal from="up" delay={120}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="font-semibold text-white">Sun Fixed</div>
              <div className="text-white/75 text-sm mt-1">Input: Ring → Output: Carrier</div>
              <div className="mt-3 text-white/90">
                i = 1 + Z<sub>sun</sub> / Z<sub>ring</sub>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal from="up" delay={140}>
          <p className="mt-8 text-white/90 leading-relaxed max-w-4xl">
            Typical single-stage ranges are ~3:1 to 10:1. This build targets ~20:1 using two similar
            stages in series (≈4.5:1 × 4.5:1 ≈ 20.25:1).
          </p>
        </Reveal>

        <Reveal from="up" delay={160}>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/90">
            <div className="font-semibold">Example tooth counts</div>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>
                Z<sub>sun</sub> = 16,&nbsp; Z<sub>planet</sub> = 20,&nbsp; Z<sub>ring</sub> = 56
                &nbsp;→&nbsp; Z<sub>ring</sub> = Z<sub>sun</sub> + 2·Z<sub>planet</sub> (fitment)
              </li>
              <li>
                Even planet spacing: (Z<sub>sun</sub> + Z<sub>ring</sub>) / N<sub>planets</sub> should be integer
                &nbsp;→&nbsp; (16 + 56) / 3 = 24
              </li>
              <li>Choose relatively prime counts to spread wear and reduce repeat meshing.</li>
            </ul>
          </div>
        </Reveal>
      </Section>

      {/* DIMENSIONS & FITMENT */}
      <Section className="pt-0">
        <Reveal from="up">
          <div className="flex items-center gap-3 text-orange-300">
            <FiSettings aria-hidden />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Design & Fitment</h2>
          </div>
        </Reveal>

        <Reveal from="up" delay={60}>
          <p className="mt-6 text-white/90 leading-relaxed max-w-4xl">
            Using common Diametral Pitch (DP) = 20&nbsp;TPI and a 20° pressure angle:
            d<sub>sun</sub>=Z<sub>sun</sub>/DP = 16/20=0.8″,&nbsp;
            d<sub>planet</sub>=20/20=1.0″,&nbsp; d<sub>ring</sub>=56/20=2.8″.
            Addendum a=1/DP,&nbsp; Dedendum b≈1.25/DP. Interference checks clear minimum-tooth
            limits for both sun↔planet and planet↔ring meshes.
          </p>
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Reveal from="left">
            <img
              src="/assets/gear-02.png"
              alt="Gear train layout and spacing"
              className="w-full rounded-xl"
              loading="lazy"
            />
          </Reveal>
          <Reveal from="right">
            <img
              src="/assets/gear-03.png"
              alt="Tooth geometry and base circles"
              className="w-full rounded-xl"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* PARAMETRIC CAD & PROTOTYPING */}
      <Section className="pt-0">
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Parametric CAD & Prototyping</h2>
        </Reveal>
        <Reveal from="up" delay={60}>
          <p className="mt-6 text-white/90 leading-relaxed max-w-4xl">
            Used <strong>parametric, ANSI-based</strong> gear models so{" "}
            <em>diametral pitch</em>, <em>number of teeth</em>, and <em>pressure angle</em> can be
            changed quickly while preserving involute correctness and clearances. Designed to
            accommodate <strong>rapid prototyping</strong> (support-free orientations, printable
            fillets, and light draft on contact faces) for fast CAD→bench iteration.
          </p>
        </Reveal>

        <div className="mt-8 grid sm:grid-cols-3 gap-6">
          <Reveal from="up">
            <img
              src="/assets/gear-04.png"
              alt="Parametric sketch driving tooth form"
              className="w-full rounded-xl"
              loading="lazy"
            />
          </Reveal>
          <Reveal from="up" delay={60}>
            <img
              src="/assets/gear-05.png"
              alt="Configurable gear set variants"
              className="w-full rounded-xl"
              loading="lazy"
            />
          </Reveal>
          <Reveal from="up" delay={120}>
            <img
              src="/assets/gear-06.png"
              alt="Printable layout and stage stack"
              className="w-full rounded-xl"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* ASSEMBLY / TESTING */}
      <Section className="pt-0">
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Assembly & Testing</h2>
        </Reveal>

        <Reveal from="up" delay={60}>
          <p className="mt-6 text-white/90 leading-relaxed max-w-4xl">
            Two similar stages (ring fixed) feed a carrier-to-sun stack to reach the overall target
            reduction (~20:1). Backlash and center distances were tuned for printed tolerances and
            grease. Bench runs confirm smooth mesh without undercutting or binding.
          </p>
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Reveal from="left">
            <img
              src="/assets/gear-07.png"
              alt="Exploded view and carrier detail"
              className="w-full rounded-xl"
              loading="lazy"
            />
          </Reveal>
          <Reveal from="right">
            <img
              src="/assets/5.jpg"
              alt="Bench test and enclosure fit"
              className="w-full rounded-xl"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* CTA — back to Mechanical on the home collage */}
      <Section className="pb-28">
        <Reveal from="up">
          <div className="flex flex-wrap items-center gap-3 text-xl sm:text-2xl text-white/90">
            <FiGitBranch className="text-orange-300" />
            <span>See other things I&apos;ve done?</span>
            <Link
              to="/"
              state={{ openPanel: "mechanical" }}
              className="underline decoration-orange-300 hover:text-orange-300"
            >
              Back to Mechanical
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* bottom gradient fade */}
      <div className="pointer-events-none h-40 bg-gradient-to-t from-black via-black to-transparent" />
    </div>
  );
}
