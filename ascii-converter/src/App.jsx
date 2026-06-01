import { useState, useEffect, useRef } from 'react';
import './App.css';

// 1. Easter Egg Dictionary (Word, Color, and Message)
const easterEggsConfig = {
  HACK: { color: 'rgba(255, 0, 0, 0.85)', title: 'SYSTEM COMPROMISED', subtitle: 'UNAUTHORIZED ACCESS DETECTED...' },
  ANGKON: { color: 'rgba(14, 165, 233, 0.9)', title: 'WELCOME ADMIN', subtitle: 'INITIATING MASTER PROTOCOLS...' },
  BUG: { color: 'rgba(255, 153, 0, 0.85)', title: 'VULNERABILITY FOUND', subtitle: 'EXPLOIT PAYLOAD READY...' },
  CODING: { color: 'rgba(51, 255, 51, 0.85)', title: 'DEV MODE ACTIVATED', subtitle: 'COMPILING SOURCE CODE...' },
  PUPIL: { color: 'rgba(0, 255, 255, 0.85)', title: 'CODEFORCES SYNC', subtitle: 'RATING UPLINK ESTABLISHED...' },
  SUDO: { color: 'rgba(255, 255, 255, 0.9)', title: 'ROOT PRIVILEGES', subtitle: 'USER ELEVATED TO SUPERUSER.', textDark: true }
};

function App() {
  const [keyInfo, setKeyInfo] = useState(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [history, setHistory] = useState([]);
  
  // Easter egg ke ebar object hisabe store korchi jate color/text pay
  const [activeEgg, setActiveEgg] = useState(null); 
  
  const sequenceRef = useRef(""); 

  const playSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (error) {
      console.log("Audio not supported");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        event.preventDefault();
      }
      
      playSound();

      const currentKey = event.key === ' ' ? 'Space' : event.key;
      const asciiVal = event.keyCode;
      const hexVal = asciiVal.toString(16).toUpperCase();
      const binVal = asciiVal.toString(2).padStart(8, '0');
      
      setKeyInfo({
        key: currentKey,
        ascii: asciiVal,
        hex: hexVal,
        bin: binVal
      });

      setHistory(prev => {
        const newLog = `> [${currentKey}] INTERCEPTED : ASCII ${asciiVal}`;
        return [newLog, ...prev].slice(0, 5);
      });

      // 2. Multi-word Easter Egg Logic
      const char = event.key.toUpperCase();
      if (char.length === 1) { 
        sequenceRef.current += char;
        // Buffer size 15 rakhlam jate boro word o dhorte pare
        if (sequenceRef.current.length > 15) {
          sequenceRef.current = sequenceRef.current.slice(-15);
        }
        
        // Check korchi kono word match holo kina
        for (const [word, data] of Object.entries(easterEggsConfig)) {
          if (sequenceRef.current.includes(word)) {
            setActiveEgg(data); // Set color and message
            sequenceRef.current = ""; 
            setTimeout(() => setActiveEgg(null), 3500); 
            break; 
          }
        }
      }

      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container">
      <div className="scanlines"></div>
      
      {/* Dynamic Easter Egg Overlay */}
      {activeEgg && (
        <div 
          className="easter-egg-overlay"
          style={{ backgroundColor: activeEgg.color }}
        >
          <h1 
            className="glitch-title easter-text" 
            data-text={activeEgg.title}
            style={{ color: activeEgg.textDark ? '#000' : '#fff', textShadow: activeEgg.textDark ? 'none' : '0 0 20px #fff' }}
          >
            {activeEgg.title}
          </h1>
          <p 
            className="easter-subtext"
            style={{ color: activeEgg.textDark ? '#222' : '#fff' }}
          >
            {activeEgg.subtitle}
          </p>
        </div>
      )}

      <div className="terminal-window">
        <header className="terminal-header">
          <div className="window-controls">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <p className="terminal-path">guest@nexus:~/ascii-decoder</p>
        </header>
        
        <div className="terminal-body">
          <h1 
            className={`glitch-title ${isGlitching ? 'glitch-active' : ''}`} 
            data-text="ASCII_DECODER"
          >
            ASCII_DECODER
          </h1>
          
          <div className="display-area">
            {keyInfo ? (
              <div className="active-interface">
                <div className="data-grid">
                  
                  <div className="data-block">
                    <span className="data-label">INPUT_KEY</span>
                    <div className="hologram-box">
                      <span className={`key-text ${keyInfo.key.length > 3 ? 'long-text' : ''}`}>
                        {keyInfo.key}
                      </span>
                      <div className="scanner"></div>
                    </div>
                  </div>
                  
                  <div className="data-block">
                    <span className="data-label">DECIMAL (ASCII)</span>
                    <div className="hologram-box success-box">
                      <span className="ascii-text">{keyInfo.ascii}</span>
                      <div className="scanner"></div>
                    </div>
                  </div>

                  <div className="data-block">
                    <span className="data-label">HEXADECIMAL</span>
                    <div className="hologram-box alt-box">
                      <span className="hex-text">{keyInfo.hex}</span>
                      <div className="scanner"></div>
                    </div>
                  </div>

                  <div className="data-block">
                    <span className="data-label">BINARY</span>
                    <div className="hologram-box alt-box">
                      <span className="bin-text">{keyInfo.bin}</span>
                      <div className="scanner"></div>
                    </div>
                  </div>

                </div>

                <div className="history-log">
                  <p className="log-header">--- REALTIME INTERCEPT LOG ---</p>
                  {history.map((log, index) => (
                    <p key={index} className="log-entry">{log}</p>
                  ))}
                </div>

              </div>
            ) : (
              <div className="idle-state">
                <p>SYSTEM.READY</p>
                <p>AWAITING_INPUT<span className="blinking-cursor">█</span></p>
                <p className="hint-text">Secret commands online...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;