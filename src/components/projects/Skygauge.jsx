// src/components/projects/Skygauge.jsx
import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiGitBranch } from "react-icons/fi";

// ---------- Assets (place under src/assets/) ----------
const DroneFlying = "/assets/droneflying.mp4";

// Servo Attachment
const Servo01 = "/assets/servo-01.jpg";
const Servo02 = "/assets/servo-02.png";
const Servo03 = "/assets/servo-03.png";
const Servo04 = "/assets/servo-04.png";
const Servo05 = "/assets/servo-05.png";

// GCS Battery Cap
const Gcs01 = "/assets/gcs-cap-01.png";
const Gcs02 = "/assets/gcs-cap-02.png";
const Gcs03 = "/assets/gcs-cap-03.jpg";
const Gcs04 = "/assets/gcs-cap-04.jpg";
const Gcs05 = "/assets/gcs-cap-05.jpg";
const Gcs06 = "/assets/gcs-cap-06.jpg";
const Gcs07 = "/assets/gcs-cap-07.jpg";

// Tubby Caddy
// If you have a "before" image later, import it and add to the two-up grid.
// const TubbyCaddyBefore = "/assets/TubbyCaddy_before.jpg";
const TubbyCaddyAfter = "/assets/TubbyCaddy_after.jpg";

// ---------- Small, reusable scroll-reveal (same timing as About/Baja) ----------
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

export default function Skygauge() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* top flair */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black to-transparent" />

      {/* TITLE */}
      <Section className="pt-28">
        <Reveal from="up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-orange-400">Skygauge</span>
          </h1>
        </Reveal>
        <Reveal from="up" delay={80}>
          <p className="mt-4 text-lg sm:text-xl leading-relaxed text-white/90 max-w-3xl">
            Skygauge is a drone startup company focused on UT inspection in Hamilton, Ontario.
          </p>
        </Reveal>
      </Section>

      {/* HERO VIDEO */}
      <Section className="pt-0">
        <Reveal from="zoom">
          <video
            src={DroneFlying}
            className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
            autoPlay
            muted
            loop
            playsInline
            controls
            aria-label="Skygauge drone flying"
          />
        </Reveal>
      </Section>

      {/* STORY — SERVO ATTACHMENT */}
      <Section>
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Servo Attachment</h2>
        </Reveal>

        <Reveal from="up" delay={60}>
          <p className="mt-6 text-white/90 leading-relaxed max-w-4xl">
            At Skygauge, the servo-attachment redesign started from a simple failure mode that kept
            biting us: cable jackets snagging on a sharp front hardpoint during inspection spins and
            in-flight oscillations, so the team framed strict requirements around snag prevention,
            zero new sharp edges even when 3D printed, no interference with adjacent hardware, and
            retention robust enough not to shake loose while keeping BOM impact near zero{" "}
            <span className="text-white/70">(see below)</span>.
          </p>
        </Reveal>

        <Reveal from="up" delay={80}>
          <img
            src={Servo01}
            alt="Baseline hardpoint & constraints"
            className="mt-6 w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
            loading="lazy"
          />
        </Reveal>

        <div className="mt-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <p className="text-white/90 leading-relaxed">
              The only thing that kept the piece in was two screws, which the piece could slide out of.
              Early concepts ranged from a screw-in plunger to fit in servo cap; the plunger was an elegant solution
              on CAD but risked leaving a broken stud trapped inside the servo case, which killed the idea on
              serviceability grounds.
            </p>
          </Reveal>
          <Reveal from="right">
            <img
              src={Servo02}
              alt="Rejected screw-in plunger concept"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>

        <Reveal from="up" delay={60}>
          <p className="mt-6 text-white/90 leading-relaxed max-w-4xl">
            A 0.1&nbsp;mm friction capture passed the eyeball test but failed a push-out check, so we added
            conservative retention, blended large radii around the screw boss to redirect cables over a safe
            surface, and a flathead-access pry slot so removal doesn’t flex thin sections.
          </p>
        </Reveal>

        <Reveal from="up" delay={80}>
          <img
            src={Servo03}
            alt="Retention / radii / service access iteration"
            className="mt-6 w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
            loading="lazy"
          />
        </Reveal>

        <Reveal from="up" delay={80}>
          <img
            src={Servo04}
            alt="Final flange replacing sharp clips; support strategy"
            className="mt-6 w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
            loading="lazy"
          />
        </Reveal>

        <Reveal from="up" delay={100}>
          <img
            src={Servo05}
            alt="Final documentation / decision trail"
            className="mt-6 mx-auto w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
            loading="lazy"
          />
        </Reveal>
      </Section>

      {/* STORY — GCS BATTERY CAP */}
      <Section>
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">GCS Battery Cap</h2>
        </Reveal>

        <Reveal from="up" delay={60}>
          <p className="mt-6 text-white/90 leading-relaxed max-w-4xl">
            The inherited cap failed when drivers torqued fasteners, cracking at the ear–web junction and
            ovalizing the holes. We changed the geometry to carry torque through the fastener cone instead of
            the plastic edge: lowered the upper wall for perpendicular driver access, swapped pan heads for
            flat heads in 90° countersinks to spread clamp load, nudged hole centers away from free edges and
            added raised rings, enlarged inside fillets at ear roots, and added underside triangular gussets.
            Print parameters were localized with thicker perimeters at bosses and the part was oriented so
            layers run across the ear–web interface. Lead-in chamfers protect countersink lips and a surface
            relief prevents the driver from camming into the web.
          </p>
        </Reveal>

        <Reveal from="up" delay={80}>
          <img
            src={Gcs01}
            alt="Baseline CAD and revised features"
            className="mt-6 w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
            loading="lazy"
          />
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <p className="text-white/90 leading-relaxed">
              The lightweight underside and gusseting (right) were tuned from a quick bearing-pressure check
              and print trials. Early prints cracked at the ears during torque tests, guiding the countersunk
              and filleted-boss direction that ultimately held spec.
            </p>
          </Reveal>
          <Reveal from="right">
            <img
              src={Gcs02}
              alt="Underside tessellation and gusseting"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>

        {/* Early prints (3-wide) */}
        <div className="mt-6 grid sm:grid-cols-3 gap-6">
          <Reveal from="left">
            <img src={Gcs03} alt="Early print #1 (ear crack)" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="up">
            <img src={Gcs04} alt="Early print #2 (ear crack)" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="right">
            <img src={Gcs05} alt="Early print #3 (ear crack)" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
        </div>

        <Reveal from="up" delay={60}>
          <img
            src={Gcs06}
            alt="First countersunk print that passed full-spec torque"
            className="mt-6 w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
            loading="lazy"
          />
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <p className="text-white/90 leading-relaxed">
              Installation clearance on the carbon deck was verified with the lowered wall providing straight-on
              driver access.
            </p>
          </Reveal>
          <Reveal from="right">
            <img
              src={Gcs07}
              alt="In-situ driver access on the deck"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section> {/* <-- This was missing and caused the error */}

      {/* STORY — TUBBY CADDY UPDATE */}
      <Section>
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Tubby Caddy Update</h2>
        </Reveal>

        <Reveal from="up" delay={60}>
          <p className="mt-6 text-white/90 leading-relaxed max-w-4xl">
            Inherited a caddy that let the drone’s “tub” (radios, antennas, camera) sit too low and scuff
            antennas. The update raised posts/perimeter for ground clearance, thickened walls with large
            internal fillets, added relief slots so the tub can rest on its side without pinching cables,
            applied chamfers/soft fillets to remove sharp edges, and integrated a debossed logo rib that
            stiffens the base. Geometry prints support-free and contact faces include light draft to avoid
            elephant’s foot. The result is a taller, tougher cradle that protects antennas and tolerates
            repeated handling while keeping the mounting footprint unchanged for drop-in use.
          </p>
        </Reveal>

        {/* Two-up before/after; uncomment the left image once you add it */}
        <div className="mt-8 grid md:grid-cols-2 gap-6 items-center">
          {/* <Reveal from="left">
            <img
              src={TubbyCaddyBefore}
              alt="Tubby Caddy — before"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal> */}
          <Reveal from="right">
            <img
              src={TubbyCaddyAfter}
              alt="Tubby Caddy — after"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
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

