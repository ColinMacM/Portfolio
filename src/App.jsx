// src/App.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const WHEEL_COOLDOWN_MS = 2000;
const MUSIC_URL = 'https://musescore.com/user/30634848/sets';
const OVERLAY_ANIM_MS = 700;
const OVERLAY_DEFAULT_PANEL = 'about';

// ---- Project data (all assets must live in /public/assets) ------------------
const SECTIONS = [
  {
    key: 'about',
    title: 'About Me',
    items: [
      { src: '/assets/1.png', title: 'Who Am I?', slug: 'about' },
      { src: '/assets/2.png', title: 'Music', slug: 'music' }, // stays in collage
    ],
  },
  {
    key: 'mechanical',
    title: 'Mechanical',
    items: [
      { src: '/assets/3.jpg', title: 'Baja Offroading', slug: 'baja' },
      { src: '/assets/4.png', title: 'Skygauge Mechanical', slug: 'skygauge' },
      { src: '/assets/5.jpg', title: 'Planetary Gearset', slug: 'planetary-gearset' },
    ],
  },
  {
    key: 'electrical',
    title: 'Electrical',
    items: [
      { src: '/assets/7.png', title: 'RC Car', slug: 'rc-car' },
      { src: '/assets/8.jpg', title: 'Keyboard', slug: 'keyboard' }, // ← fixed case
    ],
  },
  {
    key: 'software',
    title: 'Software',
    items: [
      { src: '/assets/9.png', title: 'Drone-Assisted Gaussian Splatting', slug: 'drone-assisted-gaussian-splatting' },
      { src: '/assets/10.png', title: 'ROS Car', slug: 'ros-car' },
      { src: '/assets/11.png', title: 'Horse Hearse', slug: 'horse-hearse' },
    ],
  },
];

const SECTION_NAMES = SECTIONS.map(s => s.key);

function App() {
  const [activePanel, setActivePanel] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [focus, setFocus] = useState(null);
  const collageRef = useRef(null);
  const overlayRef = useRef(null);
  const lastWheelTime = useRef(0);
  const pendingPanelRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const ALL_ITEMS = useMemo(() => {
    const arr = [];
    for (const sec of SECTIONS) {
      for (const it of sec.items) arr.push({ ...it, section: sec.key });
    }
    return arr;
  }, []);

  // Deep-link handling --------------------------------------------------------
  useEffect(() => {
    const state = location.state || {};
    const openPanel = state.openPanel;
    const openItem = state.openItem;

    if (openPanel && SECTION_NAMES.includes(openPanel)) {
      pendingPanelRef.current = { panel: openPanel, item: openItem || null };
      setActivePanel(OVERLAY_DEFAULT_PANEL);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!activePanel || !pendingPanelRef.current) return;
    const overlayEl = overlayRef.current;
    if (!overlayEl) return;

    let done = false;
    const { panel, item } = pendingPanelRef.current;

    const tryScrollToTarget = () => {
      if (done) return;
      const collage = collageRef.current;
      const el = collage?.querySelector(`[data-panel-key="${panel}"]`);
      if (el && el.offsetWidth > 0) {
        done = true;
        collage.scrollTo({ left: el.offsetLeft, behavior: 'smooth' });
        setActivePanel(panel);
        if (item) {
          const sec = SECTIONS.find(s => s.key === panel);
          const found = sec?.items.find(it => it.slug === item);
          if (found) setFocus({ ...found, section: panel });
        }
        pendingPanelRef.current = null;
      } else {
        requestAnimationFrame(tryScrollToTarget);
      }
    };

    const onOverlayShown = () => requestAnimationFrame(tryScrollToTarget);

    overlayEl.addEventListener('animationend', onOverlayShown, { once: true });
    overlayEl.addEventListener('transitionend', onOverlayShown, { once: true });
    const fallback = setTimeout(onOverlayShown, OVERLAY_ANIM_MS + 50);
    return () => {
      overlayEl.removeEventListener('animationend', onOverlayShown);
      overlayEl.removeEventListener('transitionend', onOverlayShown);
      clearTimeout(fallback);
    };
  }, [activePanel]);

  // Housekeeping --------------------------------------------------------------
  useEffect(() => {
    document.body.style.overflow = activePanel ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [activePanel]);

  useEffect(() => {
    const collage = collageRef.current;
    if (!collage) return;
    const handleScroll = () => {
      collage.querySelectorAll('.parallax-frame').forEach(frame => {
        const rect = frame.getBoundingClientRect();
        const offsetX = rect.left + frame.offsetWidth / 2 - window.innerWidth / 2;
        const img = frame.querySelector('img');
        if (img) {
          const shift = Math.max(-40, Math.min(40, offsetX * -0.05));
          img.style.transform = `translateX(${shift}px)`;
        }
      });
      const sections = Array.from(collage.querySelectorAll('[data-panel-key]'));
      const scrollLeft = collage.scrollLeft;
      let nearestKey = null, nearestDist = Infinity;
      sections.forEach(el => {
        const dist = Math.abs(el.offsetLeft - scrollLeft);
        if (dist < nearestDist) { nearestDist = dist; nearestKey = el.getAttribute('data-panel-key'); }
      });
      if (nearestKey && nearestKey !== activePanel) setActivePanel(nearestKey);
    };
    collage.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => collage.removeEventListener('scroll', handleScroll);
  }, [activePanel]);

  const scrollToSection = useCallback((panel) => {
    const collage = collageRef.current;
    if (!collage) return;
    const el = collage.querySelector(`[data-panel-key="${panel}"]`);
    const left = el ? el.offsetLeft : (collage.scrollWidth / SECTION_NAMES.length) * SECTION_NAMES.indexOf(panel);
    collage.scrollTo({ left, behavior: 'smooth' });
  }, []);

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

  const handleWheelSnap = useCallback((e) => {
    if (!activePanel) return;
    if (focus) return;
    if (e.target instanceof Element && e.target.closest('.panel-strip')) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    e.preventDefault();
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

  useEffect(() => {
    const el = collageRef.current;
    if (!el || !activePanel || focus) return;
    const opts = { passive: false };
    el.addEventListener('wheel', handleWheelSnap, opts);
    return () => el.removeEventListener('wheel', handleWheelSnap, opts);
  }, [activePanel, focus, handleWheelSnap]);

  useEffect(() => {
    if (!activePanel || focus) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') stepSection(-1);
      if (e.key === 'ArrowRight') stepSection(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activePanel, focus, stepSection]);

  useEffect(() => {
    if (!focus) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Escape') setFocus(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focus]);

  const handlePanelClick = (panel) => {
    setActivePanel(panel);
    setTimeout(() => scrollToSection(panel), OVERLAY_ANIM_MS);
  };

  const handleBackClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      setActivePanel(null);
      setIsExiting(false);
    }, 600);
  };

  const openItem = (item, sectionKey) => {
    setFocus({ ...item, section: sectionKey });
  };

  // Better affordance (pointer + keyboard)
  const renderImage = (item, sectionKey) => {
    const onTileKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openItem(item, sectionKey);
      }
    };
    return (
      <motion.div
        className="parallax-frame tile"
        key={`${item.src}-${item.title}`}
        layoutId={`frame-${item.slug}`}
        onClick={() => openItem(item, sectionKey)}
        onKeyDown={onTileKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Open ${item.title}`}
      >
        <div className="parallax-inner">
          <img src={item.src} alt={item.title} draggable="false" />
        </div>
        <div className="frame-title clickable">{item.title}</div>
      </motion.div>
    );
  };

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
              <h1 className="main-title">hey, <span className="highlight">i’m colin!</span></h1>
              <h2 className="subtitle">Mechatronics Engineer who loves robotics, offroading, and AI</h2>
              <img className="bidoof" src="/assets/bidoof.png" alt="Bidoof" />
              <div className="icon-row">
                <div className="icon-item" onClick={() => handlePanelClick('about')}>
                  <img src="/assets/bubble.png" alt="About Me" />
                  <span>About Me</span>
                </div>
                <div className="icon-item" onClick={() => handlePanelClick('mechanical')}>
                  <img src="/assets/gear.png" alt="Mechanical" />
                  <span>Mechanical</span>
                </div>
                <div className="icon-item" onClick={() => handlePanelClick('electrical')}>
                  <img src="/assets/lightbulb.png" alt="Electrical" />
                  <span>Electrical</span>
                </div>
                <div className="icon-item" onClick={() => handlePanelClick('software')}>
                  <img src="/assets/monitor.png" alt="Software" />
                  <span>Software</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel overlay + collage */}
      {activePanel && (
        <div ref={overlayRef} className={`panel-overlay ${isExiting ? 'slide-down' : 'slide-up'}`}>
          <button className="back-button" onClick={handleBackClick}>Back to Home</button>

          {/* Left/Right arrows */}
          <div className="nav-arrows" aria-hidden="false">
            <button className="arrow left" onClick={() => stepSection(-1)} aria-label="Previous section">‹</button>
            <button className="arrow right" onClick={() => stepSection(1)} aria-label="Next section">›</button>
          </div>

          <div className="panel-collage" ref={collageRef} id="projects">
            {SECTIONS.map(sec => (
              <div key={sec.key} className="panel-section" data-panel-key={sec.key}>
                <h2>{sec.title}</h2>
                <div className="panel-strip" onWheel={(e) => e.stopPropagation()}>
                  {sec.items.map(item => renderImage(item, sec.key))}
                </div>
              </div>
            ))}
          </div>

          {/* Focus overlay */}
          <AnimatePresence>
            {focus && (
              <motion.div
                className="fixed inset-0 z-[1001] bg-black/90 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
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

                  <motion.button
                    className="focus-title absolute inset-x-0 mx-auto text-white text-4xl md:text-6xl font-semibold leading-tight text-center px-4"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                    onClick={() => {
                      if (focus.slug === 'music') {
                        window.open(MUSIC_URL, '_blank', 'noopener,noreferrer');
                      } else {
                        navigate(`/project/${focus.slug}`);
                      }
                    }}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                  >
                    {focus.title}
                  </motion.button>

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
                        className={`thumb-btn overflow-hidden rounded-md shrink-0 ${
                          item.slug === focus?.slug ? 'ring-2 ring-white' : 'ring-1 ring-white/20'
                        }`}
                        onClick={() => {
                          if (item.slug === 'music') {
                            window.open(MUSIC_URL, '_blank', 'noopener,noreferrer');
                          } else {
                            setFocus(item);
                          }
                        }}
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

