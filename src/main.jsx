// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Straumbeest from './components/projects/Straumbeest.jsx';
import Baja from './components/projects/Baja.jsx';
import Music from './components/projects/Music.jsx';
import PokeAI from './components/projects/PokeAI.jsx';
import ROSCar from './components/projects/ROSCar.jsx';
import Hackathon from './components/projects/Hackathon.jsx';
import JoystickTester from './components/projects/JoystickTester.jsx';
import RCCar from './components/projects/RCCar.jsx';
import PlanetaryGearset from './components/projects/PlanetaryGearset.jsx';
import Skygauge from './components/projects/Skygauge.jsx';
import About from './components/projects/About.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/project/straumbeest" element={<Straumbeest />} />
        <Route path="/project/baja" element={<Baja />} />
        <Route path="/project/music" element={<Music />} />
        <Route path="/project/pokeai" element={<PokeAI />} />
        <Route path="/project/ros-car" element={<ROSCar />} />
        <Route path="/project/hackathon" element={<Hackathon />} />
        <Route path="/project/joystick-tester" element={<JoystickTester />} />
        <Route path="/project/rc-car" element={<RCCar />} />
        <Route path="/project/planetary-gearset" element={<PlanetaryGearset />} />
        <Route path="/project/skygauge" element={<Skygauge />} />
        <Route path="/project/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
