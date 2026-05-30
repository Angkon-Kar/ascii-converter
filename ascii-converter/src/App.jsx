import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [keyInfo, setKeyInfo] = useState(null);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ' ') {
        event.preventDefault();
      }
      
      setKeyInfo({
        key: event.key === ' ' ? 'Space' : event.key,
        ascii: event.keyCode 
      });

      // Glitch effect trigger on key press
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container">
      <div className="scanlines"></div>
      <div className="terminal-window">
        <header className="terminal-header">
          <div className="window-controls">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <p className="terminal-path">user@angkon:~/ascii-nexus</p>
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
              <div className="data-box">
                <div className="data-block">
                  <span className="data-label">INPUT_KEY</span>
                  <div className="hologram-box">
                    <span className="key-text">{keyInfo.key}</span>
                    <div className="scanner"></div>
                  </div>
                </div>
                
                <div className="connection">
                  <span className="arrow">⟿</span>
                </div>
                
                <div className="data-block">
                  <span className="data-label">DECIMAL_VAL</span>
                  <div className="hologram-box success-box">
                    <span className="ascii-text">{keyInfo.ascii}</span>
                    <div className="scanner"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="idle-state">
                <p>SYSTEM.READY</p>
                <p>WAITING_FOR_KEYSTROKE<span className="blinking-cursor">█</span></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;