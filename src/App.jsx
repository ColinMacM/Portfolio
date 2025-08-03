// src/App.jsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade, A11y } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import './App.css';

function App() {
  const [activePanel, setActivePanel] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const collageRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = activePanel ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [activePanel]);

  useEffect(() => {
    const collage = collageRef.current;
    if (!collage) return;

    const handleScroll = () => {
      const frames = collage.querySelectorAll('.parallax-frame');
      frames.forEach((frame) => {
        const rect = frame.getBoundingClientRect();
        const offsetX = rect.left + frame.offsetWidth / 2 - window.innerWidth / 2;
        const image = frame.querySelector('img');
        if (image) {
          const shift = Math.max(-40, Math.min(40, offsetX * -0.05));
          image.style.transform = `translateX(${shift}px)`;
        }
      });
    };

    collage.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => collage.removeEventListener('scroll', handleScroll);
  }, [activePanel]);

  const scrollToSection = (panel) => {
    const collage = collageRef.current;
    if (!collage) return;
    const sectionWidth = collage.scrollWidth / 4;
    const scrollTo = {
      about: 0,
      mechanical: sectionWidth,
      electrical: sectionWidth * 2,
      software: sectionWidth * 3
    }[panel];

    const duration = 800;
    const start = collage.scrollLeft;
    const distance = scrollTo - start;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      collage.scrollLeft = start + distance * easeInOutQuad(progress);
      if (progress < 1) requestAnimationFrame(animateScroll);
    };

    const easeInOutQuad = (t) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    requestAnimationFrame(animateScroll);
  };

  const handlePanelClick = (panel) => {
    setActivePanel(panel);
    setTimeout(() => scrollToSection(panel), 700);
  };

  const handleBackClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      setActivePanel(null);
      setIsExiting(false);
    }, 600);
  };

  const renderImage = (src, alt, routeSlug) => (
    <div
      className="parallax-frame"
      key={`${src}-${alt}`}
      onClick={() => navigate(`/project/${routeSlug}`)}
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
              <img
                className="bidoof"
                src="/src/assets/bidoof.png"
                alt="Bidoof"
              />
              <div className="icon-row">
                <div
                  className="icon-item"
                  onClick={() => handlePanelClick('about')}
                >
                  <img src="/src/assets/bubble.png" alt="About Me" />
                  <span>About Me</span>
                </div>
                <div
                  className="icon-item"
                  onClick={() => handlePanelClick('mechanical')}
                >
                  <img src="/src/assets/gear.png" alt="Mechanical" />
                  <span>Mechanical</span>
                </div>
                <div
                  className="icon-item"
                  onClick={() => handlePanelClick('electrical')}
                >
                  <img src="/src/assets/lightbulb.png" alt="Electrical" />
                  <span>Electrical</span>
                </div>
                <div
                  className="icon-item"
                  onClick={() => handlePanelClick('software')}
                >
                  <img src="/src/assets/monitor.png" alt="Software" />
                  <span>Software</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activePanel && (
        <div className={`panel-overlay ${isExiting ? 'slide-down' : 'slide-up'}`}>
          <button className="back-button" onClick={handleBackClick}>
            Back to Home
          </button>

          <div className="panel-collage" ref={collageRef}>
            {/* About Me Slider */}
            <div className="panel-section">
              <h2>About Me</h2>
              <Swiper
                modules={[Navigation, Pagination, EffectFade, A11y]}
                navigation
                pagination={{ clickable: true }}
                loop
                effect="fade"
                speed={600}
                className="about-slider"
                style={{ width: '90%', maxWidth: 800, margin: '1rem auto' }}
                a11y={{
                  prevSlideMessage: 'Previous slide',
                  nextSlideMessage: 'Next slide'
                }}
              >
                <SwiperSlide>
                  <div className="slide-content">
                    {renderImage('/src/assets/1.png', 'Who Am I?', 'about')}
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="slide-content">
                    {renderImage('/src/assets/2.png', 'Music', 'music')}
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>

            {/* Mechanical */}
            <div className="panel-section">
              <h2>Mechanical</h2>
              <div className="panel-strip">
                {renderImage('/src/assets/3.jpg', 'Baja Offroading', 'baja')}
                {renderImage('/src/assets/4.png', 'Skygauge Mechanical', 'skygauge')}
                {renderImage(
                  '/src/assets/5.jpg',
                  'Planetary Gearset',
                  'planetary-gearset'
                )}
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
                {renderImage(
                  '/src/assets/10.jpeg',
                  'ROS Car',
                  'ros-car'
                )}
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
