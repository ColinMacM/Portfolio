// src/App.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const WHEEL_COOLDOWN_MS = 500;

// ---- Project data (sections + images) ---------------------------------------
const SECTIONS = [
  {
    key: 'about',
    title: 'About Me',
    items: [
      { src: '/src/assets/1.png', title: 'Who Am I?', slug: 'about' },
      { src: '/src/assets/2.png', title: 'Music', slug: 'music' },
    ],
  },
  {
    key: 'mechanical',
    title: 'Mechanical',
    items: [
      { src: '/src/assets/3.jpg', title: 'Baja Offroading', slug: 'baja' },
      { src: '/src/assets/4.png', title: 'Skygauge Mechanical', slug: 'skygauge' },
      { src: '/src/assets/5.jpg', title: 'Planetary Gearset', slug: 'planetary-gearset' },
      { src: '/src/assets/6.png', title: 'Straumbeest', slug: 'straumbeest' },
    ],
  },
  {
    key: 'electrical',
    title: 'Electrical',
    items: [
      { src: '/src/assets/7.png', title: 'RC Car', slug: 'rc-car' },
      { src: '/src/assets/8.jpg', title: 'Joystick Tester', slug: 'joystick-tester' },
    ],
  },
  {
    key: 'software',
    title: 'Software',
    items: [
      { src: '/src/assets/9.png', title: 'PokeAI', slug: 'pokeai' },
      { src: '/src/assets/10.jpeg', title: 'ROS Car', slug: 'ros-car' },
      { src: '/src/assets/11.png', title: 'Hackathon', slug: 'hackathon' },
    ],
  },
];

const SECTION_NAMES = SECTIONS.map(s => s.key);

function App() {
  const [activePanel, setActivePanel] = useState(null);        // null | 'about' | 'mechanical' | ...
  const [isExiting, setIsExiting] = useState(false);
  const [focus, setFocus] = useState(null);                    // null | { src, title, slug, section }
  const collageRef = useRef(null);
  const lastWheelTime = useRef(0);
  const navigate = useNavigate();

  // Flattened list for the bottom thumbnails in the focus overlay
  const ALL_ITEMS = useMemo(() => {
    const arr = [];
    for (const sec of SECTIONS) {
      for (const it of sec.items) arr.push({ ...it, section: sec.key });
    }
    return arr;
  }, []);

  // 1) Prevent body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = activePanel ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [activePanel]);

  // 2) Parallax effect + manual drag scroll listener
  useEffect(() => {
    const collage = collageRef.current;
    if (!collage) return;

    const handleScroll = () => {
      // Parallax on each frame image (small shift)
      collage.querySelectorAll('.parallax-frame').forEach(frame => {
        const rect = frame.getBoundingClientRect();
        const offsetX = rect.left + frame.offsetWidth / 2 - window.innerWidth / 2;
        const img = frame.querySelector('img');
        if (img) {
          const shift = Math.max(-40, Math.min(40, offsetX * -0.05));
          img.style.transform = `translateX(${shift}px)`;
        }
      });

      // If user drags scrollbar, update activePanel
      const sectionWidth = collage.scrollWidth / SECTION_NAMES.length;
      const idx = Math.round(collage.scrollLeft / sectionWidth);
      const newPanel = SECTION_NAMES[idx];
      if (newPanel && newPanel !== activePanel) {
        setActivePanel(newPanel);
      }
    };

    collage.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => collage.removeEventListener('scroll', handleScroll);
  }, [activePanel]);

  // 3) Smooth scroll to a panel
  const scrollToSection = useCallback((panel) => {
    const collage = collageRef.current;
    if (!collage) return;
    const sectionWidth = collage.scrollWidth / SECTION_NAMES.length;
    const left = sectionWidth * SECTION_NAMES.indexOf(panel);
    collage.scrollTo({ left, behavior: 'smooth' });
  }, []);

  // Navigate by +/- 1 section
  const stepSection = useCallback((offset) => {
    if (!activePanel) return;
    const currIdx = SECTION_NAMES.indexOf(activePanel);
    const nextIdx = Math.max(0, Math.min(SECTION_NAMES.length - 1, currIdx + offset));
    const nextPanel = SECTION_NAMES[nextIdx];
    if (nextPanel !== activePanel) {
      setActivePanel(nextPanel);
      scrollToSection(nextPanel);
    }
  }, [activePanel, scrollToSection]);

  // 4) Wheel handler: snap to next/prev panel
  const handleWheelSnap = useCallback((e) => {
    if (!activePanel) return;
    if (focus) return; // while overlay is open, ignore snaps

    // Let inner strips (videos/images) handle their own scrolling
    if (e.target instanceof Element && e.target.closest('.panel-strip')) return;

    // Let primarily horizontal gestures scroll natively
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    e.preventDefault(); // only block native scroll for the big collage snap

    const now = Date.now();
    if (now - lastWheelTime.current < WHEEL_COOLDOWN_MS) return;
    lastWheelTime.current = now;

    const dir = e.deltaY > 0 ? 1 : -1;
    const currIdx = SECTION_NAMES.indexOf(activePanel);
    const nextIdx = Math.max(0, Math.min(SECTION_NAMES.length - 1, currIdx + dir));
    const nextPanel = SECTION_NAMES[nextIdx];

    if (nextPanel !== activePanel) {
      setActivePanel(nextPanel);
      scrollToSection(nextPanel);
    }
  }, [activePanel, focus, scrollToSection]);

  // 5) Attach non-passive wheel listener so preventDefault() works
  useEffect(() => {
    const el = collageRef.current;
    if (!el || !activePanel || focus) return; // don't bind when overlay is open
    const opts = { passive: false };
    el.addEventListener('wheel', handleWheelSnap, opts);
    return () => el.removeEventListener('wheel', handleWheelSnap, opts);
  }, [activePanel, focus, handleWheelSnap]);

  // 6) Arrow keys: when collage visible (no overlay), step sections
  useEffect(() => {
    if (!activePanel || focus) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') stepSection(-1);
      if (e.key === 'ArrowRight') stepSection(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activePanel, focus, stepSection]);

  // 6b) Overlay keyboard: any arrow or Escape closes overlay
  useEffect(() => {
    if (!focus) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Escape') {
        setFocus(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focus]);

  // Icons open panels
  const handlePanelClick = (panel) => {
    setActivePanel(panel);
    // wait for slide-up animation
    setTimeout(() => scrollToSection(panel), 700);
  };

  // Back to home
  const handleBackClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      setActivePanel(null);
      setIsExiting(false);
    }, 600);
  };

  // Small card -> focus overlay trigger
  const openFocus = (item, sectionKey) => {
    setFocus({ ...item, section: sectionKey });
  };

  // Helper to render each image frame (uses shared layoutId for Motion zoom)
  const renderImage = (item, sectionKey) => (
    <motion.div
      className="parallax-frame"
      key={`${item.src}-${item.title}`}
      layoutId={`frame-${item.slug}`}
      onClick={() => openFocus(item, sectionKey)}
      style={{ cursor: 'pointer' }}
    >
      <div className="parallax-inner">
        <img src={item.src} alt={item.title} draggable="false" />
      </div>
      <div className="frame-title">{item.title}</div>
    </motion.div>
  );

  return (
    <div className="gradient-bg">
      {/* Gooey gradient bg */}
      <svg>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </svg>
      <div className="gradients-container">
        <div className="g1" />
        <div className="g2" />
        <div className="g3" />
        <div className="g4" />
        <div className="g5" />
        <div className="interactive" />
      </div>

      {/* Home window */}
      {activePanel === null && (
        <div className="text-container">
          <div className="app">
            <div className="content-box">
              <div className="internal-tab">home</div>
              <h1 className="main-title">
                hey, <span className="highlight">i’m colin!</span>
              </h1>
              <h2 className="subtitle">Mechatronics Engineer who loves robotics, offroading, and AI</h2>
              <img className="bidoof" src="/src/assets/bidoof.png" alt="Bidoof" />
              <div className="icon-row">
                <div className="icon-item" onClick={() => handlePanelClick('about')}>
                  <img src="/src/assets/bubble.png" alt="About Me" />
                  <span>About Me</span>
                </div>
                <div className="icon-item" onClick={() => handlePanelClick('mechanical')}>
                  <img src="/src/assets/gear.png" alt="Mechanical" />
                  <span>Mechanical</span>
                </div>
                <div className="icon-item" onClick={() => handlePanelClick('electrical')}>
                  <img src="/src/assets/lightbulb.png" alt="Electrical" />
                  <span>Electrical</span>
                </div>
                <div className="icon-item" onClick={() => handlePanelClick('software')}>
                  <img src="/src/assets/monitor.png" alt="Software" />
                  <span>Software</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel overlay + collage */}
      {activePanel && (
        <div className={`panel-overlay ${isExiting ? 'slide-down' : 'slide-up'}`}>
          <button className="back-button" onClick={handleBackClick}>
            Back to Home
          </button>

          {/* Left/Right arrows to snap sections */}
          <div className="nav-arrows" aria-hidden="false">
            <button className="arrow left" onClick={() => stepSection(-1)} aria-label="Previous section">‹</button>
            <button className="arrow right" onClick={() => stepSection(1)} aria-label="Next section">›</button>
          </div>

          <div className="panel-collage" ref={collageRef}>
            {SECTIONS.map(sec => (
              <div key={sec.key} className="panel-section">
                <h2>{sec.title}</h2>
                <div className="panel-strip" onWheel={(e) => e.stopPropagation()}>
                  {sec.items.map(item => renderImage(item, sec.key))}
                </div>
              </div>
            ))}
          </div>

          {/* Focus overlay (giant photo + title + bottom thumbnails) */}
          <AnimatePresence>
            {focus && (
              <motion.div
                className="fixed inset-0 z-[1001] bg-black/90 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Big image area */}
                <div className="relative flex-1 flex items-center justify-center px-4">
                  <motion.div
                    layoutId={`frame-${focus.slug}`}
                    className="w-[min(92vw,1400px)] h-[min(78vh,850px)] overflow-hidden rounded-lg shadow-2xl"
                  >
                    <img
                      src={focus.src}
                      alt={focus.title}
                      className="w-full h-full object-cover select-none"
                      draggable="false"
                    />
                  </motion.div>

                  {/* Center clickable title → navigate to project */}
                  <motion.button
                    className="absolute inset-x-0 mx-auto text-white text-4xl md:text-6xl font-semibold leading-tight text-center px-4"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                    onClick={() => navigate(`/project/${focus.slug}`)}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                  >
                    {focus.title}
                  </motion.button>

                  {/* Close hit area (optional click anywhere dark to close) */}
                  <button
                    className="absolute top-4 right-4 text-white/80 hover:text-white text-xl px-3 py-1 rounded-md bg-white/10"
                    onClick={() => setFocus(null)}
                    aria-label="Close"
                  >
                    Esc
                  </button>
                </div>

                {/* Bottom thumbnail strip */}
                <div className="w-full shrink-0 border-t border-white/15 bg-black/60">
                  <div className="flex gap-2 md:gap-3 overflow-x-auto p-3">
                    {ALL_ITEMS.map(item => (
                      <button
                        key={item.slug}
                        className={`overflow-hidden rounded-md shrink-0 ${
                          item.slug === focus.slug ? 'ring-2 ring-white' : 'ring-1 ring-white/20'
                        }`}
                        onClick={() => setFocus(item)}
                        aria-label={item.title}
                        title={item.title}
                        style={{ width: '120px', height: '72px' }}
                      >
                        <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default App;
