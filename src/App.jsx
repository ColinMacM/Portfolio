// src/App.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';
import InteractiveHomeBG from './components/InteractiveHomeBG.jsx';

const WHEEL_COOLDOWN_MS = 2000;
const MUSIC_URL = 'https://musescore.com/user/30634848/sets';
const OVERLAY_ANIM_MS = 700;
const OVERLAY_DEFAULT_PANEL = 'about';

// ---- Project data (visual collage only; real assets are in manifest) --------
const SECTIONS = [
  { key: 'about', title: 'About Me', items: [
      { src: '/assets/1.png', title: 'Who Am I?', slug: 'about' },
      { src: '/assets/2.png', title: 'Music', slug: 'music' },
  ]},
  { key: 'mechanical', title: 'Mechanical', items: [
      { src: '/assets/3.jpg', title: 'Baja Offroading', slug: 'baja' },
      { src: '/assets/4.png', title: 'Skygauge Mechanical', slug: 'skygauge' },
      { src: '/assets/5.jpg', title: 'Planetary Gearset', slug: 'planetary-gearset' },
  ]},
  { key: 'electrical', title: 'Electrical', items: [
      { src: '/assets/7.png', title: 'RC Car', slug: 'rc-car' },
      { src: '/assets/8.jpg', title: 'Keyboard', slug: 'keyboard' },
  ]},
  { key: 'software', title: 'Software', items: [
      { src: '/assets/9.png', title: 'Drone-Assisted Gaussian Splatting', slug: 'drone-assisted-gaussian-splatting' },
      { src: '/assets/10.png', title: 'ROS Car', slug: 'ros-car' },
      { src: '/assets/11.png', title: 'Horse Hearse', slug: 'horse-hearse' },
  ]},
];

const SECTION_NAMES = SECTIONS.map(s => s.key);

// strong refs so images aren’t GC’d
const IMG_CACHE = new Map();

// --------- Preload helpers (images + videos) --------------------------------
async function preloadImages(srcs, onOneDone) {
  await Promise.all(
    srcs.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.loading = 'eager';
          img.fetchPriority = 'high';
          img.decoding = 'async';
          const finish = () => {
            const d = img.decode ? img.decode().catch(() => {}) : Promise.resolve();
            d.finally(() => {
              IMG_CACHE.set(src, img);
              onOneDone?.();
              resolve();
            });
          };
          img.onload = finish;
          img.onerror = finish;
          img.src = src;
        })
    )
  );
}

async function preloadVideos(urls, onOneDone) {
  const cache = 'caches' in window ? await caches.open('media-preload-v1') : null;
  await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, { credentials: 'same-origin', cache: 'force-cache' });
        if (cache && res && res.ok) await cache.put(url, res.clone());
      } catch {
        // ignore; still count progress
      } finally {
        onOneDone?.();
      }
    })
  );
}

async function preloadFromManifest(onProgress) {
  let manifest = { images: [], videos: [] };
  try {
    const r = await fetch('/assets/preload-manifest.json', { cache: 'no-cache' });
    if (r.ok) manifest = await r.json();
  } catch {}

  const homeIcons = [
    '/assets/bidoof.png',
    '/assets/bubble.png',
    '/assets/gear.png',
    '/assets/lightbulb.png',
    '/assets/monitor.png',
  ];
  const collageTiles = SECTIONS.flatMap((s) => s.items.map((it) => it.src));

  const images = Array.from(new Set([...(manifest.images || []), ...homeIcons, ...collageTiles]));
  const videos = Array.from(new Set([...(manifest.videos || [])]));

  const total = Math.max(1, images.length + videos.length);
  let done = 0;
  const bump = () => onProgress?.(++done / total);

  await Promise.all([preloadImages(images, bump), preloadVideos(videos, bump)]);
}

// ---- helpers to persist preloader state across navigation -------------------
const getBootReadyFromSession = () => {
  try { return sessionStorage.getItem('assetsReady') === '1'; } catch { return false; }
};
const setBootReadyInSession = () => { try { sessionStorage.setItem('assetsReady', '1'); } catch {} };

// --------- Layout helpers (responsive tiles per browser/viewport) ------------
const detectEnv = () => {
  const ua = navigator.userAgent;
  const isIOS = /iP(ad|hone|od)/i.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  return { isIOS, isSafari };
};

/**
 * Compute per-breakpoint sizes and crop position.
 * We keep object-fit: cover (cropped), make tiles TALLER,
 * and bias the crop slightly upward so heads aren't chopped.
 */
const computeLayout = () => {
  const { isSafari } = detectEnv();
  const w = Math.max(320, window.innerWidth || 1280);

  // breakpoints
  const mobile = w <= 640;
  const tablet = w > 640 && w <= 1024;

  // base widths (px) per breakpoint
  let tileW = mobile ? Math.min(0.84 * w, 360)
           : tablet ? Math.min(0.36 * w, 440)
           : Math.min(0.28 * w, 480);

  // Safari tends to render a touch larger; nudge down a bit
  if (isSafari) tileW *= 0.92;

  // TALLER aspect (height/width). Previously ~0.62 (landscape-ish).
  // Now we go portrait-leaning for richer vertical composition.
  const aspectHOverW = mobile ? 1.05 : tablet ? 0.95 : 0.85;
  const tileH = Math.round(tileW * aspectHOverW);

  // Thumbnails: also taller
  const thumbW = mobile ? 90 : 120;
  const thumbH = Math.round(thumbW * 0.9);

  // Upward crop bias (percent from top). Higher = show more upper content.
  const cropY = mobile ? 42 : tablet ? 38 : 35;

  return {
    tileW: `${Math.round(tileW)}px`,
    tileH: `${Math.round(tileH)}px`,
    thumbW: `${thumbW}px`,
    thumbH: `${thumbH}px`,
    gap: mobile ? '10px' : '14px',
    cropY, // used in objectPosition
  };
};

// ----------------------------------------------------------------------------

function App() {
  // ✅ Persist preloader across routes (only once per tab)
  const [bootReady, setBootReady] = useState(getBootReadyFromSession());
  const [progress, setProgress] = useState(0); // 0..1

  const [activePanel, setActivePanel] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [focus, setFocus] = useState(null);
  const collageRef = useRef(null);
  const overlayRef = useRef(null);
  const lastWheelTime = useRef(0);
  const pendingPanelRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // responsive layout state
  const [layout, setLayout] = useState(() => computeLayout());

  const ALL_ITEMS = useMemo(() => {
    const arr = [];
    for (const sec of SECTIONS) for (const it of sec.items) arr.push({ ...it, section: sec.key });
    return arr;
  }, []);

  // Setup dynamic 1vh = innerHeight * 0.01 for iOS Safari and update on resize
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      setLayout(computeLayout());
    };
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // Preload ALL assets only if not already done this session
  useEffect(() => {
    if (bootReady) return;
    let cancelled = false;
    (async () => {
      await preloadFromManifest((p) => !cancelled && setProgress(p));
      if (!cancelled) {
        setBootReady(true);
        setBootReadyInSession(); // remember for this tab
      }
    })();
    return () => { cancelled = true; };
  }, [bootReady]);

  // Deep-link handling
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
          img.style.willChange = 'transform';
          img.style.backfaceVisibility = 'hidden';
          img.style.transformStyle = 'preserve-3d';
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

  // Responsive tile renderer (taller + biased crop)
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
        style={{ width: layout.tileW, height: layout.tileH }}
      >
        <div className="parallax-inner" style={{ width: '100%', height: '100%' }}>
          <img
            src={item.src}
            alt={item.title}
            loading="eager"
            decoding="sync"
            fetchPriority="high"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              // <-- key change: slightly higher vertical focus across browsers
              objectPosition: `50% ${layout.cropY}%`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
            }}
            draggable="false"
          />
        </div>
        <div className="frame-title clickable">{item.title}</div>
      </motion.div>
    );
  };

  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));

  return (
    <div className="gradient-bg">
      {/* Boot loader shows ONCE per tab/session */}
      {!bootReady && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black text-white">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-40 h-40">
              <svg className="absolute inset-0 m-auto w-28 h-28" viewBox="0 0 100 100" style={{ animation: 'spin 6s linear infinite' }}>
                <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                  <circle cx="50" cy="50" r="20" />
                  {[...Array(12)].map((_, i) => {
                    const a = (i * Math.PI * 2) / 12;
                    const x1 = 50 + Math.cos(a) * 28; const y1 = 50 + Math.sin(a) * 28;
                    const x2 = 50 + Math.cos(a) * 38; const y2 = 50 + Math.sin(a) * 38;
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
                  })}
                </g>
              </svg>
              <svg className="absolute right-2 bottom-2 w-16 h-16 opacity-80" viewBox="0 0 100 100" style={{ animation: 'spin 4s linear infinite reverse' }}>
                <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                  <circle cx="50" cy="50" r="14" />
                  {[...Array(10)].map((_, i) => {
                    const a = (i * Math.PI * 2) / 10;
                    const x1 = 50 + Math.cos(a) * 22; const y1 = 50 + Math.sin(a) * 22;
                    const x2 = 50 + Math.cos(a) * 30; const y2 = 50 + Math.sin(a) * 30;
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
                  })}
                </g>
              </svg>
            </div>

            <div className="w-72 h-2 rounded-full bg-white/15 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${pct}%`, transition: 'width 300ms ease' }} />
            </div>
            <div className="text-white/80 text-sm tracking-wide">{pct}%</div>

            <button
              className="mt-2 text-xs px-3 py-1 rounded-md bg-white/10 hover:bg-white/15"
              onClick={() => { setBootReady(true); setBootReadyInSession(); }}
            >
              Skip
            </button>
          </div>
          <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
        </div>
      )}

      {/* Home (interactive background replaces old gradient) */}
      {bootReady && activePanel === null && (
        <InteractiveHomeBG>
          <div className="text-container">     {/* <-- centers the card */}
            <div className="content-box">
              <div className="internal-tab">home</div>
              <h1 className="main-title">hey, <span className="highlight">i’m colin!</span></h1>
              <h2 className="subtitle">Mechatronics Engineer who loves robotics, offroading, and AI</h2>
              <img className="bidoof" src="/assets/bidoof.png" alt="Bidoof" loading="eager" fetchPriority="high" />
            <div className="icon-row">
              <div className="icon-item" onClick={() => handlePanelClick('about')}>
                <img src="/assets/bubble.png" alt="About Me" loading="eager" fetchPriority="high" />
                <span>About Me</span>
              </div>
              <div className="icon-item" onClick={() => handlePanelClick('mechanical')}>
                <img src="/assets/gear.png" alt="Mechanical" loading="eager" fetchPriority="high" />
                <span>Mechanical</span>
              </div>
              <div className="icon-item" onClick={() => handlePanelClick('electrical')}>
                <img src="/assets/lightbulb.png" alt="Electrical" loading="eager" fetchPriority="high" />
                <span>Electrical</span>
              </div>
              <div className="icon-item" onClick={() => handlePanelClick('software')}>
                <img src="/assets/monitor.png" alt="Software" loading="eager" fetchPriority="high" />
                <span>Software</span>
              </div>
            </div>
            </div>
          </div>
        </InteractiveHomeBG>
      )}

      {/* Panel overlay + collage */}
      {bootReady && activePanel && (
        <div ref={overlayRef} className={`panel-overlay ${isExiting ? 'slide-down' : 'slide-up'}`}>
          <button className="back-button" onClick={handleBackClick}>Back to Home</button>

          <div className="nav-arrows" aria-hidden="false">
            <button className="arrow left" onClick={() => stepSection(-1)} aria-label="Previous section">‹</button>
            <button className="arrow right" onClick={() => stepSection(1)} aria-label="Next section">›</button>
          </div>

          <div
            className="panel-collage"
            ref={collageRef}
            id="projects"
            style={{
              // allow a bit more vertical room for taller tiles (uses --vh for iOS)
              height: 'min(calc(var(--vh, 1vh) * 74), 820px)',
            }}
          >
            {SECTIONS.map(sec => (
              <div key={sec.key} className="panel-section" data-panel-key={sec.key}>
                <h2>{sec.title}</h2>
                <div className="panel-strip" onWheel={(e) => e.stopPropagation()} style={{ gap: layout.gap }}>
                  {sec.items.map((item) => renderImage(item, sec.key))}
                </div>
              </div>
            ))}
          </div>

          {/* Focus overlay */}
          <AnimatePresence>
            {focus && (
              <motion.div className="fixed inset-0 z-[1001] bg-black/90 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="relative flex-1 flex items-center justify-center px-4">
                  <motion.div
                    layoutId={`frame-${focus.slug}`}
                    className="overflow-hidden rounded-lg shadow-2xl"
                    style={{
                      width: 'min(92vw, 1400px)',
                      // use --vh so iOS Safari doesn't hide the title / overflow
                      height: 'min(calc(var(--vh, 1vh) * 78), 850px)',
                    }}
                  >
                    <img
                      src={focus.src}
                      alt={focus.title}
                      loading="eager"
                      decoding="sync"
                      fetchPriority="high"
                      className="w-full h-full object-cover select-none"
                      draggable="false"
                      style={{
                        // keep crop consistent with tiles but a tad more centered
                        objectPosition: '50% 40%',
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d'
                      }}
                    />
                  </motion.div>

                  <motion.button
                    className="focus-title absolute inset-x-0 mx-auto text-white text-4xl md:text-6xl font-semibold leading-tight text-center px-4"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                    onClick={() => {
                      if (focus.slug === 'music') window.open(MUSIC_URL, '_blank', 'noopener,noreferrer');
                      else navigate(`/project/${focus.slug}`);
                    }}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                  >
                    {focus.title}
                  </motion.button>

                  <button className="absolute top-4 right-4 text-white/80 hover:text-white text-xl px-3 py-1 rounded-md bg-white/10" onClick={() => setFocus(null)} aria-label="Close">
                    Esc
                  </button>
                </div>

                <div className="w-full shrink-0 border-t border-white/15 bg-black/60">
                  <div className="flex gap-2 md:gap-3 overflow-x-auto p-3">
                    {ALL_ITEMS.map(item => (
                      <button
                        key={item.slug}
                        className={`thumb-btn overflow-hidden rounded-md shrink-0 ${item.slug === focus?.slug ? 'ring-2 ring-white' : 'ring-1 ring-white/20'}`}
                        onClick={() => {
                          if (item.slug === 'music') window.open(MUSIC_URL, '_blank', 'noopener,noreferrer');
                          else setFocus(item);
                        }}
                        aria-label={item.title}
                        title={item.title}
                        style={{ width: layout.thumbW, height: layout.thumbH }}
                      >
                        <img
                          src={item.src}
                          alt={item.title}
                          loading="eager"
                          decoding="sync"
                          fetchPriority="high"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: `50% ${layout.cropY}%` }}
                        />
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
