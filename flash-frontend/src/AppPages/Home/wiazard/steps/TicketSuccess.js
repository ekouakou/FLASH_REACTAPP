// steps/TicketSuccess.jsx
import React, { useEffect } from 'react';
import { Button } from 'rsuite';

const TicketSuccess = ({
  ticketNumber,
  userData,
  getSelectedServiceName,
  getSelectedOperationName,
  handleConfirm,
  handleReset  // Nous devons ajouter ce prop pour pouvoir réinitialiser après le délai
}) => {
  // Ajouter un effet pour rediriger automatiquement après 5 secondes
  useEffect(() => {
    // Créer un timer qui réinitialisera le wizard après 5 secondes
    const redirectTimer = setTimeout(() => {
      handleReset(); // Appel direct à handleReset pour revenir à l'étape 1
    }, 5000);

    // Nettoyage du timer si le composant est démonté
    return () => {
      clearTimeout(redirectTimer);
    };
  }, [handleReset]);  // Dépendance au handleReset pour éviter les problèmes de stale closure

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
        Redirection automatique dans 5 secondes...
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