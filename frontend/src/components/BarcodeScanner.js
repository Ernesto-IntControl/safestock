import React, { useState, useRef, useEffect } from 'react';
import '../styles/BarcodeScanner.css';

const BarcodeScanner = ({ onScan, onClose }) => {
  const [barcode, setBarcode] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && barcode.trim()) {
      onScan(barcode);
      setBarcode('');
    }
  };

  return (
    <div className="barcode-scanner">
      <div className="scanner-overlay" onClick={onClose}></div>
      <div className="scanner-box">
        <div className="scanner-header">
          <h2>Scanner un code-barres</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        <div className="scanner-content">
          <input
            ref={inputRef}
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Scannez le code-barres..."
            className="barcode-input"
          />
          <p className="scanner-hint">Positionnez le lecteur de code-barres et scannez</p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;