import { useState, useEffect } from "react";

const RotatePrompt = () => {
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => {
      const portrait = window.innerHeight > window.innerWidth;
      const mobile = window.innerWidth <= 900;
      setIsPortrait(portrait && mobile);
      if (!portrait) setDismissed(false); // reset if they rotate back
    };
    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);
    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  if (!isPortrait || dismissed) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');

        .rotate-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: #020202;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 28px;
          animation: overlayIn 0.4s ease both;
        }

        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .rotate-scanline {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(188,19,254,0.015) 3px,
            rgba(188,19,254,0.015) 4px
          );
          pointer-events: none;
        }

        .rotate-glow-top {
          position: absolute;
          top: -80px; left: 50%;
          transform: translateX(-50%);
          width: 300px; height: 300px;
          background: radial-gradient(circle, rgba(188,19,254,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        .rotate-icon-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 110px;
          height: 110px;
        }

        .rotate-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1.5px solid rgba(188,19,254,0.4);
          animation: ringPulse 2s ease-in-out infinite;
        }
        .rotate-ring:nth-child(2) {
          inset: -14px;
          border-color: rgba(188,19,254,0.15);
          animation-delay: 0.4s;
        }
        .rotate-ring:nth-child(3) {
          inset: -28px;
          border-color: rgba(188,19,254,0.06);
          animation-delay: 0.8s;
        }

        @keyframes ringPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.04); }
        }

        .rotate-phone-svg {
          animation: phoneTilt 1.8s cubic-bezier(0.34,1.56,0.64,1) infinite;
          filter: drop-shadow(0 0 16px rgba(188,19,254,0.8));
        }

        @keyframes phoneTilt {
          0%   { transform: rotate(0deg);   }
          30%  { transform: rotate(-85deg); }
          60%  { transform: rotate(-90deg); }
          80%  { transform: rotate(-90deg); }
          100% { transform: rotate(0deg);   }
        }

        .rotate-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1rem;
          font-weight: 900;
          letter-spacing: 6px;
          color: #fff;
          text-shadow: 0 0 20px rgba(188,19,254,0.9), 0 0 40px rgba(188,19,254,0.4);
          text-align: center;
          animation: textGlow 2.5s ease-in-out infinite;
        }

        @keyframes textGlow {
          0%, 100% { text-shadow: 0 0 14px rgba(188,19,254,0.7), 0 0 30px rgba(188,19,254,0.3); }
          50%       { text-shadow: 0 0 28px rgba(188,19,254,1),   0 0 60px rgba(188,19,254,0.5); }
        }

        .rotate-sub {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.55rem;
          letter-spacing: 4px;
          color: rgba(188,19,254,0.5);
          text-align: center;
          line-height: 1.8;
          padding: 0 32px;
        }

        .rotate-bar {
          width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, #bc13fe, transparent);
          animation: barFlow 2s ease-in-out infinite;
        }
        @keyframes barFlow {
          0%, 100% { opacity: 0.4; width: 80px; }
          50%       { opacity: 1;   width: 140px; }
        }

        .rotate-dismiss {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.5rem;
          letter-spacing: 3px;
          color: #2a2a2a;
          background: none;
          border: 1px solid #1a1a1a;
          border-radius: 6px;
          padding: 8px 20px;
          cursor: pointer;
          transition: color 0.3s, border-color 0.3s;
          margin-top: 8px;
        }
        .rotate-dismiss:hover {
          color: rgba(188,19,254,0.5);
          border-color: rgba(188,19,254,0.3);
        }
      `}</style>

      <div className="rotate-overlay">
        <div className="rotate-scanline" />
        <div className="rotate-glow-top" />

        <div className="rotate-icon-wrapper">
          <div className="rotate-ring" />
          <div className="rotate-ring" />
          <div className="rotate-ring" />
          <svg
            className="rotate-phone-svg"
            width="48" height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#bc13fe"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <circle cx="12" cy="18" r="1" fill="#bc13fe" />
          </svg>
        </div>

        <div className="rotate-bar" />

        <div className="rotate-title">ROTATE DEVICE</div>

        <div className="rotate-sub">
          FOR OPTIMAL EXPERIENCE<br />
          PLEASE ROTATE YOUR PHONE<br />
          TO LANDSCAPE MODE
        </div>

        <div className="rotate-bar" />

        <button className="rotate-dismiss" onClick={() => setDismissed(true)}>
          CONTINUE ANYWAY
        </button>
      </div>
    </>
  );
};

export default RotatePrompt;