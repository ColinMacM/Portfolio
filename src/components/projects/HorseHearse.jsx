// src/components/projects/HorseHearse.jsx
import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiGitBranch, FiGithub, FiMonitor, FiSmartphone, FiMap, FiExternalLink } from "react-icons/fi";

// ---- Assets (place these files in src/assets/) ----
const HHGameplay = "/assets/hh-gameplay.mp4";
const HHDashboard = "/assets/hh-dashboard.png";
const HHPhone = "/assets/hh-phone.png";
const HHMap = "/assets/hh-map.png";
const HHStart = "/assets/hh-start.png";
const HHGameOver = "/assets/hh-gameover.png";

// ---------- Small, reusable scroll-reveal ----------
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
      <div className="pointer-events-none absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent via-white/5 to-transparent opacity-30" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export default function HorseHearse() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* top flair */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black to-transparent" />

      {/* TITLE */}
      <Section className="pt-28">
        <Reveal from="up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-orange-400">Horse Hearse</span>
          </h1>
        </Reveal>
        <Reveal from="up" delay={80}>
          <p className="mt-4 text-lg sm:text-xl leading-relaxed text-white/90 max-w-3xl">
            I helped build the in-game <em>dashboard</em>, start/end screens, and HUD animations for{" "}
            <span className="text-orange-300">Horse Hearse</span> (Godot 4). The work included an
            embedded 3D SubViewport, wheel-steer animation, a phone HUD that transitions into the
            game-over screen, and a simple start menu flow.
          </p>
        </Reveal>

        {/* Itch + GitHub links */}
        <Reveal from="up" delay={120}>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <a
              href="https://oman276.itch.io/horse-hearse"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-orange-200 hover:text-white hover:bg-orange-400/20 transition"
            >
              <FiExternalLink /> Play it on itch.io
            </a>
            <a
              href="https://github.com/zanada/horse-hearse/tree/main/scenes"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-orange-300 hover:text-orange-200 underline decoration-white/30"
            >
              <FiGithub /> Scenes on GitHub
            </a>
          </div>
        </Reveal>

        {/* Game blurb */}
        <Reveal from="up" delay={160}>
          <p className="mt-3 text-white/80 italic max-w-4xl">
            Play as a horse, delivering your fellow (fallen) horses to the glue factory. But the
            factory bosses don&apos;t want rotten horses, so you need to make sure they stay fresh and
            don&apos;t rot before you deliver them… no matter how recklessly you need to drive to do it!
          </p>
        </Reveal>
      </Section>

      {/* HERO CLIP */}
      <Section className="pt-0">
        <Reveal from="zoom">
          <video
            src={HHGameplay}
            className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
            autoPlay
            muted
            loop
            playsInline
            controls
            aria-label="Horse Hearse gameplay"
          />
        </Reveal>
      </Section>

      {/* DASHBOARD */}
      <Section>
        <Reveal from="up">
          <div className="flex items-center gap-3 text-orange-300">
            <FiMonitor className="shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard & SubViewport</h2>
          </div>
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <p className="text-white/90 leading-relaxed">
              The dashboard scene composites a 2D UI with a live 3D view of the world using a{" "}
              <code className="text-orange-300">SubViewportContainer</code> +{" "}
              <code className="text-orange-300">SubViewport</code> (render target update mode set to
              “Always”). That lets the “windshield” area show the game world while the UI overlays
              remain crisp for speed, wheel, map, and phone. Everything is sized/positioned for a
              clean 16:9 layout and scaled to keep pixels sharp.
            </p>
          </Reveal>
          <Reveal from="right">
            <img
              src={HHDashboard}
              alt="Dashboard composite"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* WHEEL ANIMATION */}
      <Section>
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Steering Wheel Animation</h2>
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <p className="text-white/90 leading-relaxed">
              A compact <code className="text-orange-300">AnimatedSprite2D</code> drives the wheel:
              three clips—<em>left</em>, <em>right</em>, and <em>straight</em>—switch based on the
              current steering input. We tuned playback speed and z-index so the wheel sits on top of
              the dash art without aliasing or tearing.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* PHONE + GAME OVER */}
      <Section>
        <Reveal from="up">
          <div className="flex items-center gap-3 text-orange-300">
            <FiSmartphone className="shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Phone HUD & Game Over</h2>
          </div>
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <p className="text-white/90 leading-relaxed">
              The phone lives on the dash as a sprite during play. On crash, an{" "}
              <code className="text-orange-300">AnimationPlayer</code> blends the phone out and the
              “Game Over” card in—coordinated <em>position/rotation/scale</em> tracks keep the motion
              cohesive. The restart button visibility flips at the end of the timeline so it’s not
              focusable early.
            </p>
          </Reveal>
          <Reveal from="right">
            <img
              src={HHPhone}
              alt="Phone HUD on the dash"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>

        <div className="mt-6">
          <Reveal from="up">
            <img
              src={HHGameOver}
              alt="Game over card"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* MAP / MINI-MAP */}
      <Section>
        <Reveal from="up">
          <div className="flex items-center gap-3 text-orange-300">
            <FiMap className="shrink-0" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Mini-Map & Layout</h2>
          </div>
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <p className="text-white/90 leading-relaxed">
              A simple map sprite anchors the lower-right with a subtle rotation + scale to match the
              dash perspective. It’s independent from gameplay logic and safe to update without
              touching the world scene. The rest of the overlay (needles, text, buttons) follows the
              same pattern for clean separation of concerns.
            </p>
          </Reveal>
          <Reveal from="right">
            <img
              src={HHMap}
              alt="Mini-map placement"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* START / END SCREENS */}
      <Section>
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Start & End Screens</h2>
        </Reveal>

        <div className="mt-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="left">
            <img
              src={HHStart}
              alt="Start screen (Clock In / Tutorial / Quit)"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
          <Reveal from="right">
            <img
              src={HHGameOver}
              alt="Game over screen"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
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

