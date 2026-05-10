import React from 'react';
import '../styles/Loader.css';

export const Loader = () => (
  <div className="loader-container">
    <div className="spinner"></div>
    <p>Chargement...</p>
  </div>
);

export const ErrorMessage = ({ message, onDismiss }) => (
  <div className="error-message">
    <span>{message}</span>
    {onDismiss && (
      <button onClick={onDismiss} className="error-close">✕</button>
    )}
  </div>
);

export const EmptyState = ({ message = "Aucune donnée à afficher" }) => (
  <div className="empty-state">
    <p>{message}</p>
  </div>
);