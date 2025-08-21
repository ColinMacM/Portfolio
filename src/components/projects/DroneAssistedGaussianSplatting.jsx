// src/components/projects/DroneAssistedGaussianSplatting.jsx
import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiGitBranch } from "react-icons/fi";

/* ---------- Small, reusable scroll-reveal (same timing as the others) ---------- */
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

export default function DroneAssistedGaussianSplatting() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* top flair */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black to-transparent" />

      {/* TITLE */}
      <Section className="pt-28">
        <Reveal from="up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Drone-Assisted <span className="text-orange-400">Gaussian Splatting</span>
          </h1>
        </Reveal>
        <Reveal from="up" delay={80}>
          <p className="mt-4 text-lg sm:text-xl leading-relaxed text-white/90 max-w-4xl">
            I led the design and delivery of a depth-assisted, multi-date 3D reconstruction
            model for IVISION-Drone that fuses imagery from repeated site visits into a single,
            consistent scene. Using DJI LiDAR point-clouds to initialize scale and alignment,
            I solved the real operational problem of drift and fragmented reconstructions from
            photos alone. I took the model from concept to field-ready practice—defining the
            data standards, validation steps, and quality gates needed so runs are reproducible
            with minimal manual touch, and ensuring outputs land in a unified coordinate frame
            that stakeholders can inspect, visualize, and compare over time. The result is faster
            turnaround from flight to usable 3D, tighter metric accuracy through LiDAR-anchored
            initialization, and reliable week-over-week change detection for decision-makers. This
            work underpins an upcoming 2026 research release.
          </p>
        </Reveal>
      </Section>

      {/* HERO (placeholder image or short clip) */}
      <Section className="pt-0">
        <Reveal from="zoom">
          {/* Replace with your hero image/video when ready */}
          <img
            src="/src/assets/dags-hero.jpg"
            alt="Depth-assisted multi-date Gaussian Splatting reconstruction"
            className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
            loading="lazy"
          />
        </Reveal>
      </Section>

      {/* HIGHLIGHTS */}
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          <Reveal from="up">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full">
              <h3 className="text-xl font-semibold text-orange-300">Why depth-assist?</h3>
              <ul className="mt-4 space-y-2 text-white/90">
                <li>Anchors global scale &amp; orientation with DJI LiDAR.</li>
                <li>Reduces drift across long flights and revisits.</li>
                <li>Improves metric fidelity for inspections &amp; change-detection.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal from="up" delay={70}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full">
              <h3 className="text-xl font-semibold text-orange-300">What I delivered</h3>
              <ul className="mt-4 space-y-2 text-white/90">
                <li>Multi-date fusion into a unified coordinate frame.</li>
                <li>Data standards &amp; quality gates for reproducible runs.</li>
                <li>Depth-initialized Gaussian Splatting training pipeline.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal from="up" delay={140}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full">
              <h3 className="text-xl font-semibold text-orange-300">Operational outcomes</h3>
              <ul className="mt-4 space-y-2 text-white/90">
                <li>Faster flight-to-model turnaround.</li>
                <li>Consistent, comparable scenes across weeks/months.</li>
                <li>Cleaner stakeholder reviews &amp; decision-making.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* PIPELINE AT A GLANCE */}
      <Section>
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Pipeline at a glance</h2>
        </Reveal>

        <div className="mt-8 grid gap-10 md:grid-cols-2 items-center">
          <Reveal from="up">
            <ol className="list-decimal pl-6 space-y-3 text-white/90">
              <li>
                <span className="text-white">Flight &amp; capture:</span> RGB photo sets across dates +
                DJI LiDAR sweeps for initial scale/pose anchors.
              </li>
              <li>
                <span className="text-white">Sensor prep:</span> EXIF &amp; trajectory cleaning; LiDAR scrub and
                ground removal; unit checks.
              </li>
              <li>
                <span className="text-white">Initialization:</span> Robust alignment of RGB cameras to LiDAR frame
                to fix global scale/orientation.
              </li>
              <li>
                <span className="text-white">GS training:</span> Depth-assisted Gaussian Splatting with calibrated
                intrinsics/extrinsics.
              </li>
              <li>
                <span className="text-white">Multi-date fusion:</span> Register sessions into a common frame; prune
                outliers and balance densities.
              </li>
              <li>
                <span className="text-white">QA &amp; packaging:</span> Metric checks; export for viz/inspection; write-once
                metadata for traceability.
              </li>
            </ol>
          </Reveal>

          <Reveal from="right">
            {/* Replace with a pipeline diagram when ready */}
            <img
              src="/src/assets/dags-pipeline.png"
              alt="High-level pipeline diagram"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* FIELD WORKFLOW */}
      <Section>
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Field workflow</h2>
        </Reveal>

        <div className="mt-8 grid gap-10 md:grid-cols-2 items-center">
          <Reveal from="up">
            <ul className="list-disc pl-6 space-y-3 text-white/90">
              <li>Standardized capture paths, altitudes, and overlap for RGB.</li>
              <li>LiDAR sweep checkpoints to anchor each sortie.</li>
              <li>Per-site coordinate charter so repeats align over time.</li>
              <li>On-site validation steps to catch issues before packing up.</li>
            </ul>
          </Reveal>

          <Reveal from="right">
            <img
              src="/src/assets/dags-field-01.jpg"
              alt="Capture setup and alignment markers"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* TECH NOTES */}
      <Section>
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Technical notes</h2>
        </Reveal>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Reveal from="up">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full">
              <h3 className="text-lg font-semibold text-orange-300">Alignment &amp; scale</h3>
              <p className="mt-3 text-white/90">
                Camera poses initialized against DJI LiDAR in a rigid frame to lock metric scale and
                orientation before optimization—stabilizing long sequences and multi-date merges.
              </p>
            </div>
          </Reveal>

          <Reveal from="up" delay={60}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full">
              <h3 className="text-lg font-semibold text-orange-300">Depth-assisted GS</h3>
              <p className="mt-3 text-white/90">
                Depth priors regularize splat radii/positions, improving convergence on texture-poor
                surfaces and reducing floaters in low-parallax regions.
              </p>
            </div>
          </Reveal>

          <Reveal from="up" delay={120}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full">
              <h3 className="text-lg font-semibold text-orange-300">Multi-date fusion</h3>
              <p className="mt-3 text-white/90">
                Sessions registered into a common site frame; duplicate geometry reconciled and
                per-epoch radiance blended to preserve appearance while enabling change views.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* GALLERY (placeholders you can swap in later) */}
      <Section>
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Gallery</h2>
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal from="left">
            <img src="/src/assets/dags-01.png" alt="Scene view 1" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="up">
            <img src="/src/assets/dags-02.png" alt="Scene view 2" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="right">
            <img src="/src/assets/dags-03.png" alt="Scene view 3" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="left">
            <img src="/src/assets/dags-04.png" alt="LiDAR alignment overlay" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="up">
            <img src="/src/assets/dags-05.png" alt="Multi-date fused result" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="right">
            <img src="/src/assets/dags-06.png" alt="Change visualization example" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
        </div>
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

