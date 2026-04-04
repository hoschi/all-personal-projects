import React from "react";

interface ErrorModalProps {
  error: Error | null;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div className="error-modal-overlay">
      <div className="error-modal">
        <div className="error-modal-header">
          <h3>Fehler bei der Transkription</h3>
          <button className="error-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="error-modal-body">
          <p>Die Transkription ist fehlgeschlagen.</p>
          <p className="error-message">{error.message}</p>
        </div>
        <div className="error-modal-footer">
          <button className="error-modal-button" onClick={onClose}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
