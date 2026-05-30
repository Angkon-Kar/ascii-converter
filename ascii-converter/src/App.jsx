import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [keyInfo, setKeyInfo] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Prevent default scrolling when pressing Space
      if (event.key === ' ') {
        event.preventDefault();
      }
      
      setKeyInfo({
        key: event.key === ' ' ? 'Space' : event.key,
        ascii: event.keyCode 
      });
    };

    // Event listener add kora holo
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function jate memory leak na hoy
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="app-container">
      <h1>ASCII Key Converter</h1>
      
      <div className="display-box">
        {keyInfo ? (
          <>
            <p>You pressed:</p>
            <h2 className="key-name">{keyInfo.key}</h2>
            <p>ASCII Number:</p>
            <h1 className="ascii-value">{keyInfo.ascii}</h1>
          </>
        ) : (
          <p className="placeholder-text">Press any key on your keyboard...</p>
        )}
      </div>
    </div>
  );
}

export default App;