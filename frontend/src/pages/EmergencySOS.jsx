import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmergencySOS.css';

const API_BASE = 'https://spokio.onrender.com';

const EmergencySOS = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [savedCaretaker, setSavedCaretaker] = useState(null);
  const [isTriggered, setIsTriggered] = useState(false);
  const [sosStatus, setSosStatus] = useState('READY');

  useEffect(() => {
    const fetchCaretaker = async () => {
      try {
        const res = await axios.get(API_BASE + '/api/caretaker/details');
        if (res.data) {
          setSavedCaretaker(res.data);
          setFormData(res.data);
        }
      } catch (err) {
        console.log("No caretaker found.");
      }
    };
    fetchCaretaker();
  }, []);

  const speakSystemMessage = (message) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const validateForm = () => {
    const { name, email, phone } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name.length < 2) return false;
    if (!emailRegex.test(email)) return false;
    if (phone.length < 10) return false;
    return true;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await axios.post(API_BASE + '/api/caretaker/save', formData);
        setSavedCaretaker(res.data);
        alert("SECURITY MODULE: Caretaker details saved to database.");
      } catch (err) {
        alert("SAVE FAILED: " + (err.response ? err.response.data.error : err.message));
      }
    } else {
      alert("Validation failed. Check name, email (@), and phone (10+ digits).");
    }
  };

  // ── Get GPS then send SOS email ──
  const triggerSOS = () => {
    if (!savedCaretaker) {
      alert("⚠️ No caretaker saved. Please fill and save caretaker details first.");
      return;
    }

    setIsTriggered(true);
    setSosStatus('LOCATING...');
    speakSystemMessage("Emergency alert activated. Getting your location.");

    // Ask browser for GPS
    if (!navigator.geolocation) {
      sendSOS(null, null, null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      function(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        setSosStatus('TRANSMITTING...');
        speakSystemMessage(
          'Location acquired. Sending emergency alert to ' + savedCaretaker.name + '.'
        );
        sendSOS(lat, lng, accuracy);
      },
      function(err) {
        console.warn('GPS denied or unavailable:', err.message);
        setSosStatus('TRANSMITTING WITHOUT LOCATION...');
        speakSystemMessage(
          'Location unavailable. Sending emergency alert to ' + savedCaretaker.name + ' without location.'
        );
        sendSOS(null, null, null);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const sendSOS = async (lat, lng, accuracy) => {
    try {
      const res = await axios.post(API_BASE + '/api/caretaker/sos', { lat, lng, accuracy });
      setSosStatus('ALERT SENT TO ' + res.data.sentTo.toUpperCase());
      speakSystemMessage("Emergency email sent successfully.");
    } catch (err) {
      console.error('SOS send error:', err);
      setSosStatus('TRANSMISSION FAILED');
      speakSystemMessage("Failed to send emergency alert. Please call for help.");
      alert("SOS FAILED: " + (err.response ? err.response.data.error : err.message));
    }
    setTimeout(function() {
      setIsTriggered(false);
      setSosStatus('READY');
    }, 8000);
  };

  return (
    <div className={"sos-bg " + (isTriggered ? 'emergency-active' : '')}>
      <div className="sos-animated-border"></div>
      <div className="sos-particles"></div>

      <div className="sos-container">
        <h1 className="sos-title" data-text="EMERGENCY SOS">EMERGENCY SOS</h1>

        <div className="sos-btn-wrapper">
          <button
            className={"sos-main-btn " + (isTriggered ? 'sos-triggered' : '')}
            onClick={triggerSOS}
            disabled={isTriggered}
          >
            {isTriggered ? '...' : 'SOS'}
          </button>
        </div>

        <div className={"sos-alert-banner " + (isTriggered ? 'visible' : '')}>
          ⚠ EMERGENCY PROTOCOL ACTIVATED — HELP IS ON THE WAY ⚠
        </div>

        <div className="sos-status">SYSTEM STATUS: {sosStatus}</div>

        <form className="sos-form-card" onSubmit={handleSave}>
          <div className="sos-field">
            <label className="sos-form-label">NAME OF CARETAKER</label>
            <input
              className="sos-input"
              type="text"
              placeholder="Enter Name..."
              value={formData.name}
              onChange={function(e) { setFormData({...formData, name: e.target.value}); }}
              required
            />
          </div>

          <div className="sos-field">
            <label className="sos-form-label">EMAIL ID</label>
            <input
              className="sos-input"
              type="email"
              placeholder="caretaker@email.com"
              value={formData.email}
              onChange={function(e) { setFormData({...formData, email: e.target.value}); }}
              required
            />
          </div>

          <div className="sos-field">
            <label className="sos-form-label">PHONE NUMBER</label>
            <input
              className="sos-input"
              type="tel"
              placeholder="PHONE (10 Digits)"
              required
              pattern="[0-9]{10,15}"
              title="Please enter only digits (10-15)"
              value={formData.phone}
              onChange={function(e) { setFormData({...formData, phone: e.target.value}); }}
            />
          </div>

          <button type="submit" className="sos-save-btn">SAVE DETAILS</button>
        </form>

        {savedCaretaker && (
          <div className="sos-location-badge">
            <div className="sos-location-dot"></div>
            <span>
              ACTIVE CONTACT: {savedCaretaker.name.toUpperCase()} <br />
              TEL: {savedCaretaker.phone}
            </span>
          </div>
        )}
      </div>

      {isTriggered && <div className="emergency-scanner"></div>}
    </div>
  );
};

export default EmergencySOS;