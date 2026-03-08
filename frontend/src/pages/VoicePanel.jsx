import React, { useState, useEffect } from 'react';
import './VoicePanel.css';

const VoicePanel = () => {
  // --- 1. STARTING: State Hooks ---
  const [text, setText] = useState("");
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // --- 2. DATA: The Word List (with Emojis and Warning Signs) ---
  const words = [
    "HELLO 👋",  "PLEASE 🙏","PAIN ⚠️", "HELP ⚠️","YES ✅", "NO ❌", 
    "THANKS 😊", "HUNGRY 🍕", "THIRSTY 🥤", 
    "WATER 💧", "UP ⬆️", "DOWN ⬇️", "STOP 🛑", 
    "LEFT ⬅️", "RIGHT ➡️", "GO 🟢", "STAY 🏠", 
    "MORE ➕", "LESS ➖", "GOOD 👍", "BAD 👎",
    "MEDICINE 💊", "BATHROOM 🚽", "TIRED 😴"
  ];

  // --- 3. LOGIC: Helper function for clean language names ---
  const getLanguageName = (langCode) => {
    if (langCode.startsWith('en')) return 'ENGLISH';
    if (langCode.startsWith('ta')) return 'TAMIL';
    if (langCode.startsWith('fr')) return 'FRENCH';
    if (langCode.startsWith('de')) return 'GERMAN';
    if (langCode.startsWith('es')) return 'SPANISH';
    return langCode.toUpperCase();
  };

  // --- 4. LOGIC: Load exactly 5 voices ---
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const targetLangs = ['en', 'ta', 'fr', 'de', 'es']; 
      const filtered = [];

      targetLangs.forEach(langCode => {
        const match = allVoices.find(v => v.lang.startsWith(langCode));
        if (match) filtered.push(match);
      });

      const finalFive = filtered.slice(0, 5);
      setVoices(finalFive);
      if (finalFive.length > 0 && !selectedVoice) {
        setSelectedVoice(finalFive[0].name);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  // --- 5. LOGIC: The Speech Function ---
  const speak = (msg) => {
    if (!msg) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(msg);
    const voiceMatch = voices.find(v => v.name === selectedVoice);
    if (voiceMatch) utterance.voice = voiceMatch;
    utterance.volume = volume;
    utterance.rate = 0.9; 
    window.speechSynthesis.speak(utterance);
  };

  // --- 6. LAST: The UI (What you see) ---
  return (
    <div className="voice-panel-page">
      <div className="page-wrapper">
        <div className="animated-border"></div>
        
        <div className="voice-container">
          <h1 className="neon-title">SPOKIO</h1>

          {/* Voice Module Selector */}
          <div className="voice-selector-group">
            <label className="selector-label">LINGUISTIC MODULE</label>
            <select 
              className="neon-select"
              value={selectedVoice || ""} 
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {voices.map(voice => (
                <option key={voice.name} value={voice.name}>
                  VOICE {voices.indexOf(voice) + 1} - {getLanguageName(voice.lang)}
                </option>
              ))}
            </select>
          </div>

          {/* Text Input Area */}
          <div className="input-group">
            <textarea 
              className="neon-input" 
              placeholder="SYSTEM READY..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>

          <div className="action-group">
            <button className="neon-main-btn" onClick={() => speak(text)}>
              EXECUTE VOICE
            </button>
          </div>

          {/* Volume Control */}
          <div className="volume-group">
            <label className="volume-label">OUTPUT VOLUME</label>
            <input 
              type="range" 
              className="neon-slider" 
              min="0" max="1" step="0.1" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
            />
          </div>

          {/* Word Grid with Emergency Highlight Logic */}
          <div className="word-grid">
            {words.map((word) => {
              const isUrgent = word.includes("HELP") || word.includes("PAIN");
              return (
                <button 
                  key={word} 
                  className="dynamic-word-btn"
                  data-urgent={isUrgent}
                  onClick={() => speak(word.split(' ')[0])}
                  style={isUrgent ? { 
                    borderColor: '#ff1e1e', 
                    color: '#ff1e1e', 
                    boxShadow: '0 0 15px rgba(255, 30, 30, 0.4)',
                    fontWeight: '900'
                  } : {}}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoicePanel;