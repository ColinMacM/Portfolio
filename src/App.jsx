// src/App.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const SECTION_NAMES = ['about', 'mechanical', 'electrical', 'software'];
const WHEEL_COOLDOWN_MS = 500; // ms between snaps

function App() {
  const [activePanel, setActivePanel] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const collageRef = useRef(null);
  const navigate = useNavigate();
  const lastWheelTime = useRef(0);

  // 1) Prevent body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = activePanel ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activePanel]);

  // 2) Parallax effect + manual‐drag scroll listener
  useEffect(() => {
    const collage = collageRef.current;
    if (!collage) return;

    const handleScroll = () => {
      // Parallax
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
  const scrollToSection = useCallback(panel => {
    const collage = collageRef.current;
    if (!collage) return;
    const sectionWidth = collage.scrollWidth / SECTION_NAMES.length;
    const left = sectionWidth * SECTION_NAMES.indexOf(panel);
    collage.scrollTo({ left, behavior: 'smooth' });
  }, []);

  // 4) Wheel handler: snap to next/prev panel
  const handleWheelSnap = useCallback(e => {
    if (!activePanel) return;
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
  }, [activePanel, scrollToSection]);

  // 5) Attach non-passive wheel listener so preventDefault() works
  useEffect(() => {
    const el = collageRef.current;
    if (!el) return;
    if (!activePanel) return;

    const opts = { passive: false };
    el.addEventListener('wheel', handleWheelSnap, opts);
    return () => {
      el.removeEventListener('wheel', handleWheelSnap, opts);
    };
  }, [activePanel, handleWheelSnap]);

  // 6) Icons open panels
  const handlePanelClick = panel => {
    setActivePanel(panel);
    // wait for slide-up animation
    setTimeout(() => scrollToSection(panel), 700);
  };

  // 7) Back to home
  const handleBackClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      setActivePanel(null);
      setIsExiting(false);
    }, 600);
  };

  // 8) Helper to render each image frame
  const renderImage = (src, alt, slug) => (
    <div
      className="parallax-frame"
      key={`${src}-${alt}`}
      onClick={() => navigate(`/project/${slug}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="parallax-inner">
        <img src={src} alt={alt} />
      </div>
      <div className="frame-title">{alt}</div>
    </div>
  );

  return (
    <div className="gradient-bg">
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
              <h2 className="subtitle">
                Mechatronics Engineer who loves robotics, offroading, and AI
              </h2>
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
          <div className="panel-collage" ref={collageRef}>
            {/* About */}
            <div className="panel-section">
              <h2>About Me</h2>
              <div className="panel-strip">
                {renderImage('/src/assets/1.png', 'Who Am I?', 'about')}
                {renderImage('/src/assets/2.png', 'Music', 'music')}
              </div>
            </div>
            {/* Mechanical */}
            <div className="panel-section">
              <h2>Mechanical</h2>
              <div className="panel-strip">
                {renderImage('/src/assets/3.jpg', 'Baja Offroading', 'baja')}
                {renderImage('/src/assets/4.png', 'Skygauge Mechanical', 'skygauge')}
                {renderImage('/src/assets/5.jpg', 'Planetary Gearset', 'planetary-gearset')}
                {renderImage('/src/assets/6.png', 'Straumbeest', 'straumbeest')}
              </div>
            </div>
            {/* Electrical */}
            <div className="panel-section">
              <h2>Electrical</h2>
              <div className="panel-strip">
                {renderImage('/src/assets/7.png', 'RC Car', 'rc-car')}
                {renderImage('/src/assets/8.jpg', 'Joystick Tester', 'joystick-tester')}
              </div>
            </div>
            {/* Software */}
            <div className="panel-section">
              <h2>Software</h2>
              <div className="panel-strip">
                {renderImage('/src/assets/9.png', 'PokeAI', 'pokeai')}
                {renderImage('/src/assets/10.jpeg', 'ROS Car', 'ros-car')}
                {renderImage('/src/assets/11.png', 'Hackathon', 'hackathon')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
