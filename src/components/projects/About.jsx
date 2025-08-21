import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiDownload, FiAward, FiCpu, FiTool, FiMusic, FiBookOpen } from "react-icons/fi";

// ---------- Assets (place these files under src/assets/) ----------
// Adjust paths if this file lives elsewhere.
const Mythic = "/assets/Mythic.png";
const Scenic = "/assets/scenic.png";
const LegoRobot = "/assets/LegoRobot.png";
const FRC = "/assets/FRC.png";
const FRCGroup = "/assets/FRCGroup.jpg"; // still used in media grid
const FRCTechnical = "/assets/FRCTechnical.jpg"; // replaces full-bleed group photo
const RobotMove = "/assets/RobotMove.mp4";
const JazzBand = "/assets/JazzBand.jpg"; // replaces FishMongy attachment
const ResumePDF = "/assets/Resume.pdf"; // change name if different

// ---------- Small, reusable scroll-reveal component ----------
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

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* background flair at the very top (matches gradient/black vibe) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black to-transparent" />

      {/* TAGLINE */}
      <Section className="pt-28">
        <Reveal from="up" once={false}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Hello, I <span className="text-orange-400">am</span> Colin!
          </h1>
        </Reveal>
      </Section>

      {/* SHORT BIO + images beneath (Mythic + Scenic side-by-side) */}
      <Section>
        <div className="space-y-8 max-w-4xl">
          <Reveal from="up">
            <p className="text-lg sm:text-xl leading-relaxed text-white/90">
              I am a mechatronics engineer from the University of Waterloo. Whenever I am not tinkering,
              you can find me playing Volleyball, Music, and MTG.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6">
            <Reveal from="up" delay={60}>
              <img
                src={Scenic}
                alt="My Beautiful ahh face"
                className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
                loading="lazy"
              />
            </Reveal>
            <Reveal from="up" delay={120}>
              <img
                src={Mythic}
                alt="Colin playing MTG — Mythic rank screenshot"
                className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
                loading="lazy"
              />
            </Reveal>
          </div>
        </div>
      </Section>


      {/* LONGER STORY — two-column: text (left) + photo (right) */}
      <Section>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <div className="space-y-6">
              <p className="text-lg sm:text-xl leading-relaxed text-white/90">
                I grew up on the outskirts of Toronto, near{" "}
                <a
                  href="https://www.youtube.com/watch?v=D0n84uTDdkY"
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-300 underline decoration-orange-400/40 hover:decoration-orange-300"
                >
                  Weston Road
                </a>
                , to a family of Korean and Scottish descent. I started my career in Lego Robotics, where I focused more on trying to get a pile of plastic bricks to pick up a ring than doing my homework.
              </p>
            </div>
          </Reveal>
          <Reveal from="right">
            <img
              src={LegoRobot}
              alt="Lego robotics build"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* FRC SECTION — text full-width, then media below */}
      <Section>
        <div className="space-y-10">
          <Reveal from="up">
            <p className="text-lg sm:text-xl leading-relaxed text-white/90 max-w-4xl">
              I then entered high school and did First Robotics Competition (FRC), and later became the President of the
              Robotics Club. I was responsible for the drivetrain, where we used a 6‑wheel drive train, and I wired up
              the RoboRIO, wheels, and CAN‑Bus lines during the pandemic.
            </p>
          </Reveal>

          {/* full-bleed photo block (photo takes the entire block) — now FRCTechnical */}
          <Reveal from="zoom" once={false}>
            <img
              src={FRCGroup}
              alt="FRC technical build close-up"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>

          {/* media grid: two pictures + 1s looping video (unchanged aside from alt text) */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Reveal from="left">
              <img src={FRC} alt="FRC robot" className="w-full rounded-xl" loading="lazy" />
            </Reveal>
            <Reveal from="up" delay={80}>
              <video
                src={RobotMove}
                className="w-full rounded-xl"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Robot drivetrain moving"
              />
            </Reveal>
            <Reveal from="right" delay={160}>
              <img src={FRCTechnical} alt="FRC team" className="w-full rounded-xl" loading="lazy" />
            </Reveal>
          </div>
        </div>
      </Section>

      {/* MUSIC + FRENCH + FISHMONGER — two-column with Jazz Band image (attachment removed) */}
      <Section>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <Reveal from="up">
            <div className="space-y-6">
              <p className="text-lg sm:text-xl leading-relaxed text-white/90">
                I have done music and I am up to Level 8 in RCM Piano, and Level 10 in RCM Music History. In high school,
                I played Baritone Sax in Jazz Band and completed my French Immersion certificate. I was also a fish
                monger throughout this time.
              </p>
            </div>
          </Reveal>

          <Reveal from="right">
            <img
              src={JazzBand}
              alt="Jazz band performance"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)] object-cover"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* RESUME CTA */}
      <Section>
        <Reveal from="up" once={false}>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={ResumePDF}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-5 py-3 text-base font-medium text-orange-300 hover:bg-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
            >
              <FiDownload /> Download Resume
            </a>
            <span className="text-sm text-white/60">PDF • opens in a new tab</span>
          </div>
        </Reveal>
      </Section>

      {/* FINAL QUESTION / LINK BACK HOME */}
      <Section className="pb-28">
        <Reveal from="up">
          <p className="text-xl sm:text-2xl text-white/90">
            Do you want to see the stuff that I have done in {" "}
              <Link to="/" state={{ openPanel: "mechanical" }} className="text-orange-300 underline decoration-orange-400/40 hover:decoration-orange-300">
                University
              </Link>
            ?
          </p>
        </Reveal>
      </Section>

      {/* bottom gradient fade */}
      <div className="pointer-events-none h-40 bg-gradient-to-t from-black via-black to-transparent" />
    </div>
  );
}

