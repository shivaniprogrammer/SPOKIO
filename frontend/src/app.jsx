import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import VoicePanel from "./pages/VoicePanel";
import Community from "./pages/Community"; // Import this
import EmergencySOS from "./pages/EmergencySOS"; // Import this
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-layout d-flex">
        <Sidebar />
        <main className="main-content flex-grow-1">
          <Routes>
            <Route path="/" element={<VoicePanel />} />
            <Route path="/voice-panel" element={<VoicePanel />} />
            <Route path="/community" element={<Community />} />
            <Route path="/emergency" element={<EmergencySOS />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;