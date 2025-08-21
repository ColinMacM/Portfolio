// src/components/projects/RCCar.jsx
import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiGitBranch } from "react-icons/fi";

// ---------- Assets ----------
const RC01 = "/assets/rc-01.jpg";     // hero photo
const RC02 = "/assets/rc-02.mp4";     // speed-up/slow-down clip
const RC03 = "/assets/rc-03.jpg";     // rice cooker internals
const RC04 = "/assets/rc-04.mp4";     // rice-cooker run clip

// ---------- Reusable reveal ----------
function Reveal({
  children,
  from = "up",
  delay = 0,
  once = false,
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

// 4:3 wrapper helper
const Media43 = ({ children, className = "" }) => (
  <div
    className={`w-full overflow-hidden rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)] ${className}`}
    style={{ aspectRatio: "4 / 3" }}
  >
    {children}
  </div>
);

export default function RCCar() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* top flair */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black to-transparent" />

      {/* TITLE + INTRO */}
      <Section className="pt-28">
        <Reveal from="up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            RC <span className="text-orange-400">Car</span>
          </h1>
        </Reveal>
        <Reveal from="up" delay={80}>
          <p className="mt-5 text-lg sm:text-xl leading-relaxed text-white/90 max-w-3xl">
            A scratch-built radio-controlled platform to explore power electronics, motor control,
            embedded firmware, and closed-loop steering on a lightweight chassis.
          </p>
        </Reveal>
      </Section>

      {/* HERO IMAGE (4:3) */}
      <Section className="pt-0">
        <Reveal from="zoom">
          <Media43>
            <img
              src={RC01}
              alt="RC car hero"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </Media43>
        </Reveal>
      </Section>

      {/* FIRMWARE HIGHLIGHTS */}
      <Section className="pt-0">
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Firmware & Control Highlights</h2>
        </Reveal>
        <Reveal from="up" delay={60}>
          <ul className="mt-6 space-y-2 text-white/90 text-lg">
            <li>PPM → command mapping w/ deadband</li>
            <li>Steering expo + end-point limits</li>
            <li>Basic telemetry over UART</li>
          </ul>
        </Reveal>
      </Section>

      {/* POWER PATH + TEST CLIP (4:3) */}
      <Section className="pt-0">
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Power & Packaging</h2>
        </Reveal>
        <Reveal from="up" delay={60}>
          <p className="mt-6 text-white/90 leading-relaxed max-w-4xl">
            Power path flows pack → switch → ESC with a dedicated BEC for 5&nbsp;V rails. The receiver sits
            on foam with ferrite beads on servo/ESC lines to tame noise. A small breakout consolidates
            telemetry, fan, and LED headers. I decided to put it to a hackathon.
          </p>
        </Reveal>

        <Reveal from="zoom" delay={80}>
          <Media43 className="mt-6">
            <video
              src={RC02}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls
              aria-label="Bench/track test showing speed changes"
            />
          </Media43>
        </Reveal>
      </Section>

      {/* HACKATHON: RICE COOKED */}
      <Section className="pt-0">
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Hackathon Build — “Rice cooked”</h2>
        </Reveal>

        <Reveal from="up" delay={60}>
          <p className="mt-6 text-white/90 leading-relaxed max-w-4xl">
            Introducing <span className="text-orange-300 font-semibold">Rice cooked</span>, built for the{" "}
            <a
              href="https://www.formulanull.racing/"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-white/40 hover:decoration-white"
            >
              Formula Null hackathon
            </a>
            . Instead of using a standard RC chassis, I replaced it with a{" "}
            <span className="text-white">rice cooker</span> and 3D-printed mounts for drivetrain, steering,
            and electronics—same control stack, very different packaging.
          </p>
        </Reveal>

        <Reveal from="up" delay={80}>
          <Media43 className="mt-6">
            <img
              src={RC03}
              alt="Rice cooker chassis with electronics and drivetrain inside"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </Media43>
        </Reveal>
      </Section>

      {/* RESULTS + CLIP (4:3) */}
      <Section className="pt-0">
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Results & Learnings</h2>
        </Reveal>
        <Reveal from="up" delay={60}>
          <p className="mt-6 text-white/90 leading-relaxed max-w-4xl">
            Unfortunately it didn’t reach the expected speed—our high-KV 3-phase motor favored top-end RPM
            over stall torque. With the added mass and moment of the rice cooker, the torque constant and
            gearing weren’t ideal, so launch and corner exits were limited. A lower-KV motor (higher K
            <sub>t</sub>), shorter gearing, or a sensored setup with current limits would improve low-speed
            authority without cooking the ESC (pun intended).
          </p>
        </Reveal>

        <Reveal from="zoom" delay={80}>
          <Media43 className="mt-6">
            <video
              src={RC04}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              controls
              aria-label="Rice cooker chassis driving demo"
            />
          </Media43>
        </Reveal>
      </Section>

      {/* CTA — back to Electrical panel on the collage */}
      <Section className="pb-28">
        <Reveal from="up">
          <div className="flex flex-wrap items-center gap-3 text-xl sm:text-2xl text-white/90">
            <FiGitBranch className="text-orange-300" />
            <span>See other things I&apos;ve done?</span>
            <Link
              to="/"
              state={{ openPanel: "electrical" }}
              className="underline decoration-orange-300 hover:text-orange-300"
            >
              Back to Electrical
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* bottom gradient fade */}
      <div className="pointer-events-none h-40 bg-gradient-to-t from-black via-black to-transparent" />
    </div>
  );
}

