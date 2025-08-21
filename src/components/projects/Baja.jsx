// src/components/projects/Baja.jsx
import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiAward,
  FiUsers,
  FiCalendar,
  FiExternalLink,
  FiTool,
  FiCpu,
  FiGitBranch,
} from "react-icons/fi";

// ---------- Assets (put these under src/assets/) ----------
const BajaCover = "/assets/Baja.JPG";

const IceBaja = "/assets/IceBaja.mp4";
const MichiganPhoto = "/assets/3.jpg";
const BajaFall = "/assets/BajaFall.jpg";

const SplineGen = "/assets/splineGen.png";
const CouplerWorks = "/assets/couplerWorks.png";
const TestFit = "/assets/testFit.jpg";
const InterferenceWheelhub = "/assets/InterferenceWheelhub.png";
const TorqueCalc = "/assets/TorqueCalc.png";
const WheelHubDrawing = "/assets/WheelHubDrawing.png";
const WheelHubReal = "/assets/WheelHubReal.jpg";

const SketchUpright = "/assets/SketchUpright.png";
const BearingCarrier = "/assets/BearingCarrier.jpg";
const AwfulWeld = "/assets/awfulWeld.jpg";
const UprightFinished = "/assets/UprightFinished.jpg";

const SteeringPlot = "/assets/Steering.png";
const Steering2 = "/assets/Steering2.png";
const Steering3 = "/assets/Steering3.png";
const Steering4 = "/assets/steering4.png";
const SteeringExt = "/assets/SteeringExt.png";
const Steering7 = "/assets/Steering7.jpg";
const Steering8 = "/assets/Steering8.mp4";

const ChassisRender = "/assets/ChassisRender.png";
const ChassisJig2 = "/assets/ChassisJig2.jpg";
const ChassisJig3 = "/assets/ChassisJig3.png";
const SafetyDoc = "/assets/SafetyDoc.png";

const Chassis01 = "/assets/chassis-01.png";
const Chassis02 = "/assets/chassis-02.png";
const Chassis03 = "/assets/chassis-03.png";
const Chassis04 = "/assets/chassis-04.png";
const Chassis05 = "/assets/chassis-05.png";
const Chassis06 = "/assets/chassis-06.jpg";

// ---------- Small, reusable scroll-reveal (same timing as About.jsx) ----------
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
      animate={
        inView ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, ...directions[from] }
      }
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

export default function Baja() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* top flair */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black via-black to-transparent" />

      {/* TITLE */}
      <Section className="pt-28">
        <Reveal from="up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            UW <span className="text-orange-400">BAJA</span> OFFROADING
          </h1>
        </Reveal>
      </Section>

      {/* INTRO + COVER IMAGE */}
      <Section>
        <div className="space-y-8 max-w-3xl">
          <Reveal from="up">
            <p className="text-lg sm:text-xl leading-relaxed text-white/90">
              Baja SAE is a student-led design team competition for Off-Road Internal Combustion
              Engine (ICE), where we are expected to design, build and race off-road vehicles. The
              vehicles are expected to survive harsh conditions such as steep-inclines, huge bumps,
              mud, rocks, or snow.
            </p>
          </Reveal>

          <Reveal from="up" delay={100}>
            <img
              src={BajaCover}
              alt="UW Baja vehicle cover photo"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* HIGHLIGHTS — single column */}
      <Section>
        <div className="space-y-6">
          <Reveal from="up">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-orange-300">
                <FiTool aria-hidden className="shrink-0" />
                <h3 className="text-xl font-semibold">My Roles</h3>
              </div>
              <ul className="mt-4 space-y-2 text-white/90">
                <li>2024: <em>Steering Lead, Safety Captain</em></li>
                <li>2025: <em>Chassis Lead, Supervisor</em></li>
              </ul>
            </div>
          </Reveal>

          <Reveal from="up" delay={70}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-orange-300">
                <FiUsers aria-hidden className="shrink-0" />
                <h3 className="text-xl font-semibold">Team & Years</h3>
              </div>
              <ul className="mt-4 space-y-2 text-white/90">
                <li>Team Size: 10–20 people</li>
                <li>Years: 2022–2025</li>
              </ul>
            </div>
          </Reveal>

          <Reveal from="up" delay={140}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center gap-3 text-orange-300">
                <FiCalendar aria-hidden className="shrink-0" />
                <h3 className="text-xl font-semibold">Competitions</h3>
              </div>

              <div className="mt-4 space-y-5 text-white/90">
                {/* Laval 2024 */}
                <div>
                  <a
                    href="https://www.instagram.com/p/C28PBWuM4i_/?img_index=1"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 underline decoration-white/40 hover:decoration-white"
                  >
                    Epreuve du Nord (Laval, Quebec), 2024 <FiExternalLink />
                  </a>
                  <div className="text-white/70">Result: 18th</div>
                  <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                    <video
                      src={IceBaja}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  </div>
                </div>

                {/* Michigan 2025 */}
                <div>
                  <a
                    href="https://www.bajasae.net/res/EventResults.aspx?competitionid=d699778a-2071-460d-971e-a88d0a49cc50&eventkey=OVR"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 underline decoration-white/40 hover:decoration-white"
                  >
                    Michigan Baja SAE, 2025 <FiExternalLink />
                  </a>
                  <div className="text-white/70">Result: 49th</div>
                  <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={MichiganPhoto}
                      alt="Michigan 2025 Baja SAE event photo"
                      className="w-full"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Laval 2025 */}
                <div>
                  <a
                    href="https://www.instagram.com/p/DGHXMMsPqXq/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 underline decoration-white/40 hover:decoration-white"
                  >
                    Epreuve du Nord (Laval, Quebec), 2025 <FiExternalLink />
                  </a>
                  <div className="text-white/70">Result: 19th</div>
                  <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={BajaFall}
                      alt="Laval 2025 Baja event photo"
                      className="w-full"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* STORY: VEHICLE DYNAMICS (2024) */}
      <Section>
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Vehicle Dynamics — 2024</h2>
        </Reveal>

        {/* Wheelhub */}
        <div className="mt-10 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Wheelhub</h3>
              <p className="text-white/90 leading-relaxed">
                Needed to determine the off-the-shelf half-shaft <em>male</em> splines on the
                half-shaft which connected to the wheel hub. I used measurement over pins to find
                the closest whole-number diametral pitch from the major/minor diameters per AGMA
                spline standards; then I recreated the <em>female</em> spline in{" "}
                <a
                  href="https://splinegen.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-white/30 hover:decoration-white"
                >
                  splinegen.com
                </a>
                , imported it into SolidWorks, and 3D-printed a coupler for a test fit (see trio
                below).
              </p>
              <p className="text-white/90 leading-relaxed">
                Once the fit was confirmed, I designed the front wheel-hub. Front hubs transmit
                torque from the half-shaft to the wheel and must integrate cleanly with the brake
                package, upright, suspension, and wheel without interference. The hub length was
                constrained—long enough for the wheelbase and bearing stack, but short enough to
                keep clearance to the brake caliper and rim. The image beside shows the integration
                &amp; interference study.
              </p>
              <p className="text-white/90 leading-relaxed">
                I ran basic torque FEA in SolidWorks Simulation and targeted a factor of safety ≈ 3.
                I then produced a detailed manufacturing guide and drawing package to ensure precise,
                repeatable fabrication.
              </p>
            </div>
          </Reveal>
          <Reveal from="right">
            <img
              src={InterferenceWheelhub}
              alt="Wheel-hub system integration and interference study"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>

        {/* Wheelhub: image trio under */}
        <div className="mt-8 grid sm:grid-cols-3 gap-6">
          <Reveal from="left">
            <img src={SplineGen} alt="Spline generator output" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="up">
            <img src={CouplerWorks} alt="Spline coupler CAD" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="right">
            <img src={TestFit} alt="3D-printed test fit" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
        </div>

        {/* Torque calc + drawings + real part */}
        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          <Reveal from="up">
            <img src={TorqueCalc} alt="Torque FEA / calc" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="up" delay={80}>
            <img src={WheelHubDrawing} alt="Wheel-hub manufacturing drawing" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
        </div>
        <div className="mt-6">
          <Reveal from="up">
            <img src={WheelHubReal} alt="Manufactured wheel-hub" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
        </div>

        <Reveal from="up" delay={60}>
          <p className="mt-6 text-white/80">
            Successfully endured extensive testing and completed in the 2024 season.
          </p>
        </Reveal>

        {/* Upright — image beside the text */}
        <div className="mt-16">
          <Reveal from="up">
            <h3 className="text-xl font-semibold">Upright</h3>
          </Reveal>

          <div className="mt-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <Reveal from="up">
              <div>
                <p className="text-white/90 leading-relaxed">
                  The front uprights in a Baja SAE vehicle are integral structural components that
                  mount the suspension and steering mechanisms, house wheel hubs, and absorb
                  off-road stresses—ensuring robust maneuverability. Together with the control arms,
                  the geometry began with basic sketches to set desirable king-pin and caster angles
                  and to guarantee full motion from full droop to full bump. We then optimized the
                  layout to remove as much interference as possible.
                </p>
                <p className="mt-6 text-white/90 leading-relaxed">
                  The upright was manufactured from 10&nbsp;ga mild steel sheet and 4140 solid round
                  stock. Tab-and-slot sheet metal pieces were water-jetted, and I handled the rest of
                  the fabrication: welding, milling, and drilling/machining the bearing carrier.
                </p>
              </div>
            </Reveal>

            <Reveal from="right">
              <img
                src={SketchUpright}
                alt="Upright sketch and geometry"
                className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
                loading="lazy"
              />
            </Reveal>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-6">
            <Reveal from="left">
              <img src={BearingCarrier} alt="Bearing carrier machining" className="w-full rounded-xl" loading="lazy" />
            </Reveal>
            <Reveal from="up">
              <img src={AwfulWeld} alt="Weld iteration" className="w-full rounded-xl" loading="lazy" />
            </Reveal>
            <Reveal from="right">
              <img src={UprightFinished} alt="Finished upright" className="w-full rounded-xl" loading="lazy" />
            </Reveal>
          </div>

          <Reveal from="up" delay={60}>
            <p className="mt-6 text-white/80">
              Successfully endured extensive testing and completed in the 2024 season.
            </p>
          </Reveal>
        </div>

        {/* Steering */}
        <div className="mt-16">
          <Reveal from="up">
            <h3 className="text-xl font-semibold">Steering</h3>
          </Reveal>
          <Reveal from="up" delay={60}>
            <p className="text-white/90 leading-relaxed">
              I led UW Baja’s steering from kinematics to driver fit under tight nose packaging and
              off-road loads: using a MATLAB multi-link Ackermann script I sized rack offset,
              tie-rod length, and steering arm (plot shows ~2.80″ rack–axle offset, ~15.38″ tie-rods,
              ~2.01″ arms, 85% Ackermann at max steer; see plot). I translated that into a compact
              column with two sealed bearings and vendor U-joints, keeping shafts parallel and joint
              operating angles equal-and-opposite (layout &amp; phasing below), verified clearances with
              section studies, simplified the rack extension for manufacturability, and validated fit
              and service access in the chassis. A quick steering-wheel FEA guided fillet/thickness
              tweaks to stay below yield. Result: meets kinematic targets, builds with shop-friendly
              ops and off-the-shelf components, and gives clean effort &amp; clearance.
            </p>
          </Reveal>

          <div className="mt-6 grid sm:grid-cols-3 gap-6">
            <Reveal from="left">
              <img src={SteeringPlot} alt="Ackermann/steering kinematic plot" className="w-full rounded-xl" loading="lazy" />
            </Reveal>
            <Reveal from="up">
              <img src={Steering2} alt="Steering layout study" className="w-full rounded-xl" loading="lazy" />
            </Reveal>
            <Reveal from="right">
              <img src={Steering3} alt="Steering phasing diagram" className="w-full rounded-xl" loading="lazy" />
            </Reveal>
          </div>

          <div className="mt-6 grid sm:grid-cols-3 gap-6">
            <Reveal from="left">
              <img src={Steering4} alt="Steering section study" className="w-full rounded-xl" loading="lazy" />
            </Reveal>
            <Reveal from="up">
              <img src={SteeringExt} alt="Rack extension manufacturing design" className="w-full rounded-xl" loading="lazy" />
            </Reveal>
            <Reveal from="right">
              <img src={Steering7} alt="Chassis mock-up for steering" className="w-full rounded-xl" loading="lazy" />
            </Reveal>
          </div>

          <div className="mt-6">
            <Reveal from="up">
              <video
                src={Steering8}
                className="w-full rounded-xl"
                autoPlay
                muted
                loop
                playsInline
                controls
                aria-label="Steering movement demo"
              />
            </Reveal>
          </div>

          <Reveal from="up" delay={60}>
            <p className="mt-6 text-white/80">
              Successfully endured extensive testing and completed in the 2024 season.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* 2025 CHASSIS */}
      <Section>
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">2025 Chassis</h2>
        </Reveal>

        <Reveal from="up" delay={60}>
          <p className="text-white/90 leading-relaxed max-w-4xl">
            For the 2025 chassis I led the rules envelope, load-path layout, material selection, and
            FEA in one loop from driver fit to fabrication: we began with a fully dimensioned cockpit
            sketch (H-point, helmet arc, pedal reach, hoops &amp; bulkheads) anchoring the tube network.
            From that baseline I trialed triangulation, re-angled the upper front node for continuous
            force paths into the lower rails &amp; dash bar, then cleaned up joint concurrency and cope
            access. Event scenarios were converted to equivalent forces (frontal/side/rear/roll/10-ft
            drop) against a 1.5 FoS; a short material study (1018/1020/4130) led to AISI&nbsp;4130 at our
            gauges. First frontal run concentrated stress at the front node — we tilted the nose ~7°,
            added an X-brace, and upsized two members (0.065″→0.083″). Frontal met FoS ≈ 1.53 and others
            stayed in margin. We tacked the frame to validate jigging, weld reach, member fit, and
            egress before full weld and inspection.
          </p>
        </Reveal>

        {/* Layout & node work */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Reveal from="up">
            <img src={Chassis01} alt="Chassis cockpit sketch / layout" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="up" delay={80}>
            <img src={Chassis02} alt="Upper front node re-angle and triangulation" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
        </div>

        {/* Equivalent force cases */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <Reveal from="up">
            <img src={Chassis03} alt="Equivalent force cases & boundary setup" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="up" delay={60}>
            <img src={Chassis05} alt="Post-iteration frontal case results" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
        </div>

        {/* 👉 Side-by-side: materials table + tacked frame */}
        <div className="mt-6 grid md:grid-cols-2 gap-6 items-start">
          <Reveal from="up">
            <img src={Chassis04} alt="Material comparison study" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="up" delay={60}>
            <img src={Chassis06} alt="Chassis tacked up for validation" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
        </div>
      </Section>

      {/* OTHER STUFF */}
      <Section>
        <Reveal from="up">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Other Stuff</h2>
        </Reveal>

        {/* Chassis Jig block */}
        <div className="mt-8 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">2024 Chassis Jig</h3>
              <ul className="list-disc pl-5 text-white/90 space-y-2">
                <li>Laser-cut MDF tab &amp; slot interlocking pieces; self-supporting.</li>
                <li>Ensured weld clearance and access; supported full chassis.</li>
                <li>Successfully manufactured and used without issues.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal from="right">
            <img
              src={ChassisRender}
              alt="Chassis jig render"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 gap-6">
          <Reveal from="left">
            <img src={ChassisJig2} alt="Chassis jig build photo 1" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
          <Reveal from="right">
            <img src={ChassisJig3} alt="Chassis jig build photo 2" className="w-full rounded-xl" loading="lazy" />
          </Reveal>
        </div>

        {/* Safety Officer — image beside */}
        <div className="mt-16 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <Reveal from="up">
            <div>
              <h3 className="text-xl font-semibold">Safety Officer</h3>
              <ul className="mt-4 list-disc pl-5 text-white/90 space-y-2">
                <li>Maintained safety binders of MSDS &amp; SOPs for all equipment.</li>
                <li>Implemented 5S and bay cleanliness instructions.</li>
                <li>Handled hazardous waste; enforced &lt; 2&nbsp;weeks retention.</li>
                <li>Tracked training eligibility for members.</li>
              </ul>
            </div>
          </Reveal>
          <Reveal from="right">
            <img
              src={SafetyDoc}
              alt="Safety documentation snapshot"
              className="w-full rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.15)]"
              loading="lazy"
            />
          </Reveal>
        </div>
      </Section>

      {/* CTA */}
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

      <div className="pointer-events-none h-40 bg-gradient-to-t from-black via-black to-transparent" />
    </div>
  );
}

