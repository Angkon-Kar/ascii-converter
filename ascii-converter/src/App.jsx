import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [keyInfo, setKeyInfo] = useState(null);
  const [isGlitching, setIsGlitching] = useState(false);
  const [history, setHistory] = useState([]);
  const [easterEgg, setEasterEgg] = useState(false);
  
  // Ref used to track sequence without re-rendering every time
  const sequenceRef = useRef(""); 

  // Sound Generator (Web Audio API - No external files needed!)
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
      console.log("Audio not supported in this browser");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        event.preventDefault();
      }
      
      // Play sound on press
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

      // Update History Log (Keep last 5)
      setHistory(prev => {
        const newLog = `> [${currentKey}] INTERCEPTED : ASCII ${asciiVal} | HEX ${hexVal}`;
        return [newLog, ...prev].slice(0, 5);
      });

      // Easter Egg Logic: Track "HACK"
      const char = event.key.toUpperCase();
      if (char.length === 1) { // Only track single letters
        sequenceRef.current += char;
        if (sequenceRef.current.length > 10) {
          sequenceRef.current = sequenceRef.current.slice(-10);
        }
        if (sequenceRef.current.includes("HACK")) {
          setEasterEgg(true);
          sequenceRef.current = ""; // Reset after trigger
          setTimeout(() => setEasterEgg(false), 3500); // Hide after 3.5s
        }
      }

      // Trigger Glitch Animation
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container">
      <div className="scanlines"></div>
      
      {/* Easter Egg Overlay */}
      {easterEgg && (
        <div className="easter-egg-overlay">
          <h1 className="glitch-title easter-text" data-text="SYSTEM COMPROMISED">SYSTEM COMPROMISED</h1>
          <p className="easter-subtext">UNAUTHORIZED ACCESS DETECTED...</p>
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
                  
                  {/* INPUT KEY */}
                  <div className="data-block">
                    <span className="data-label">INPUT_KEY</span>
                    <div className="hologram-box">
                      <span className={`key-text ${keyInfo.key.length > 3 ? 'long-text' : ''}`}>
                        {keyInfo.key}
                      </span>
                      <div className="scanner"></div>
                    </div>
                  </div>
                  
                  {/* ASCII VALUE */}
                  <div className="data-block">
                    <span className="data-label">DECIMAL (ASCII)</span>
                    <div className="hologram-box success-box">
                      <span className="ascii-text">{keyInfo.ascii}</span>
                      <div className="scanner"></div>
                    </div>
                  </div>

                  {/* HEX VALUE */}
                  <div className="data-block">
                    <span className="data-label">HEXADECIMAL</span>
                    <div className="hologram-box alt-box">
                      <span className="hex-text">{keyInfo.hex}</span>
                      <div className="scanner"></div>
                    </div>
                  </div>

                  {/* BINARY VALUE */}
                  <div className="data-block">
                    <span className="data-label">BINARY</span>
                    <div className="hologram-box alt-box">
                      <span className="bin-text">{keyInfo.bin}</span>
                      <div className="scanner"></div>
                    </div>
                  </div>

                </div>

                {/* HISTORY LOG */}
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
                <p className="hint-text">(Try typing 'HACK' for a surprise)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;