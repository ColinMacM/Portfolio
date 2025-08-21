// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import Baja from "./components/projects/Baja.jsx";
import ROSCar from "./components/projects/ROSCar.jsx";
import Keyboard from "./components/projects/Keyboard.jsx";
import RCCar from "./components/projects/RCCar.jsx";
import PlanetaryGearset from "./components/projects/PlanetaryGearset.jsx";
import Skygauge from "./components/projects/Skygauge.jsx";
import About from "./components/projects/About.jsx";

// NEW/REPLACEMENTS
import HorseHearse from "./components/projects/HorseHearse.jsx";
import DroneAssistedGaussianSplatting from "./components/projects/DroneAssistedGaussianSplatting.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        {/* Mechanical */}
        <Route path="/project/baja" element={<Baja />} />
        <Route path="/project/planetary-gearset" element={<PlanetaryGearset />} />
        <Route path="/project/skygauge" element={<Skygauge />} />

        {/* Electrical */}
        <Route path="/project/rc-car" element={<RCCar />} />
        <Route path="/project/keyboard" element={<Keyboard />} />

        {/* Software */}
        <Route
          path="/project/drone-assisted-gaussian-splatting"
          element={<DroneAssistedGaussianSplatting />}
        />
        <Route path="/project/ros-car" element={<ROSCar />} />
        <Route path="/project/horse-hearse" element={<HorseHearse />} />

        {/* About */}
        <Route path="/project/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

