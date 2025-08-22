// src/components/projects/Keyboard.jsx
import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiCpu, FiGitBranch } from "react-icons/fi";
import TakeMeBack from "../TakeMeBack.jsx";

// ---- Assets (put these in src/assets/) ----
const Keyboard01 = "/assets/keyboard-01.png"; // schematic (matrix w/ diodes)
const Keyboard02 = "/assets/keyboard-02.png"; // PCB layout (routing)
const Keyboard03 = "/assets/keyboard-03.png"; // 3D render
const Keyboard04 = "/assets/keyboard-04.jpg"; // fabricated PCB
const Keyboard05 = "/assets/keyboard-05.mp4"; // assembly / demo video #1
const Keyboard06 = "/assets/keyboard-06.mp4"; // demo video #2

// ---------- Small, reusable scroll-reveal (same timing as About/Baja/etc.) ----------
function Reveal({
  children,
  from = "up",
  delay = 0,
  once = false, // animate in and out while entering/leaving viewport
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

export default function Keyboard() {
  return (
    <div className="min-h-screen bg-black text-white">
      <TakeMeBack defaultPanel="mechanical" />
      {/* top flair */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black to-transparent" />

      {/* TITLE */}
      <Section className="pt-28">
        <Reveal from="up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-orange-400">Macro Keypad</span> — 3×3 Matrix
          </h1>
        </Reveal>
        <Reveal from="up" delay={80}>
          <p className="mt-4 text-lg sm:text-xl leading-relaxed text-white/90 max-w-3xl">
            A nine-key macropad designed around an Arduino Pro Micro with a
            diode-isolated row/column matrix. Built to explore matrix scanning,
            debouncing, and simple HID macros on custom hardware.
          </p>
        </Reveal>
      </Section>

      {/* SCHEMATIC */}
      <Section className="pt-0">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 text-orange-300">
                <FiCpu aria-hidden />
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Matrix + Diodes</h2>
              </div>
              <p className="text-white/90 leading-relaxed">
                The keypad uses a 3×3 matrix (Rows 0–2, Columns 0–2) with
                per-switch diodes to prevent ghosting. The Pro Micro drives
                columns low one at a time and reads row states with internal
                pull-ups enabled. Firmware does per-key debounce and supports
                press/hold macros.
              </p>
              <ul className="list-disc pl-5 text-white/85 space-y-1">
                <li>Arduino Pro Micro (ATmega32U4) for native USB HID</li>
                <li>NKRO safety via diode-isolated switches</li>
                <li>Configurable scan rate and debounce window</li>
              </ul>
            </div>
          </Reveal>
          <Reveal from="right">
            <img
              src={Keyboard01}
              alt="Schematic: Pro Micro with 3×3 matrix and per-switch diodes"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* LAYOUT + 3D */}
      <Section className="pt-0">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <img
              src={Keyboard02}
              alt="PCB layout and routing for the 3×3 keypad"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
          <Reveal from="right">
            <img
              src={Keyboard03}
              alt="3D render showing switch footprints, Pro Micro and diode bank"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>

        <Reveal from="up" delay={60}>
          <p className="mt-8 text-white/90 leading-relaxed max-w-4xl">
            Routing keeps rows/columns short and parallel to reduce cross-talk.
            Diodes are grouped along the controller edge for clean assembly and
            probing. Mounting and switch footprints follow MX spacing, with
            silkscreen legends for rows/columns to simplify debug.
          </p>
        </Reveal>
      </Section>

      {/* FABRICATION PHOTO */}
      <Section className="pt-0">
        <Reveal from="up">
          <img
            src={Keyboard04}
            alt="Fabricated PCB: 3×3 switch pads and Pro Micro header legend"
            className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
            loading="lazy"
          />
        </Reveal>
        <Reveal from="up" delay={60}>
          <p className="mt-6 text-white/90 leading-relaxed">
            Board spec: 1.6&nbsp;mm FR-4, 1&nbsp;oz Cu, HASL, black soldermask. Switches solder
            straight into plated MX footprints; the Pro Micro solders to a
            through-hole header. Firmware exposes simple layers and macro slots
            over serial for quick rebinds.
          </p>
        </Reveal>
      </Section>

      {/* DEMO VIDEOS */}
      <Section className="pt-0">
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Bring-up & Demos</h2>
        </Reveal>

        <div className="mt-6 grid md:grid-cols-2 gap-10 md:gap-16">
          <Reveal from="up">
            <video
              src={Keyboard05}
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              autoPlay
              muted
              loop
              playsInline
              controls
              aria-label="Key scanning and USB HID demo"
            />
          </Reveal>
          <Reveal from="right">
            <video
              src={Keyboard06}
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              autoPlay
              muted
              loop
              playsInline
              controls
              aria-label="Macro layers / debounce test"
            />
          </Reveal>
        </div>

        <Reveal from="up" delay={60}>
          <ul className="mt-6 grid sm:grid-cols-3 gap-4 text-white/90">
            <li className="rounded-xl border border-white/10 bg-white/5 p-4">
              Per-key debounce & hold-tap behavior
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-4">
              Simple layer system + serial macro config
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-4">
              Diode isolation prevents ghosting
            </li>
          </ul>
        </Reveal>
      </Section>

      {/* CTA — back to Electrical on the home collage */}
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

