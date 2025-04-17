// steps/TicketSuccess.jsx
import React from 'react';
import { Button } from 'rsuite';

const TicketSuccess = ({
  ticketNumber,
  userData,
  getSelectedServiceName,
  getSelectedOperationName,
  handleConfirm
}) => {
  return (
    <div className="ticket-success-container">
      <div className="ticket-success-icon">✅</div>
      <h3 className="ticket-success-title">Votre ticket est prêt !</h3>

      <div className="ticket-card">
        <div className="ticket-card-label">VOTRE NUMÉRO</div>
        <div className="ticket-number">{ticketNumber}</div>

        <div className="ticket-detail" style={{ borderTop: "1px solid var(--gray)" }}>
          <div>Service</div>
          <div style={{ fontWeight: '600' }}>{getSelectedServiceName()}</div>
        </div>

        <div className="ticket-detail">
          <div>Opération</div>
          <div style={{ fontWeight: '600' }}>{getSelectedOperationName()}</div>
        </div>

        <div className="ticket-detail" style={{ borderBottom: "0" }}>
          <div>Client</div>
          <div style={{ fontWeight: '600' }}>{userData.name}</div>
        </div>
      </div>

      <p className="ticket-message">
        Veuillez patienter, nous vous appellerons bientôt.
      </p>

      <Button
        appearance="primary"
        onClick={handleConfirm}
        className="ticket-finish-button"
        style={{ backgroundColor: "var(--success)", borderColor: "var(--success)" }}
      >
        Terminer
      </Button>
    </div>
  );
};

export default TicketSuccess;