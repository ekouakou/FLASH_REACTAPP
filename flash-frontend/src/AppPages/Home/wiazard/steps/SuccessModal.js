// components/SuccessModal.jsx
import React from 'react';
import { Modal, Button } from 'rsuite';

const SuccessModal = ({ showSuccess, handleReset }) => {
  return (
    <Modal
      open={showSuccess}
      onClose={handleReset}
      size="xs"
    >
      <Modal.Header>
        <Modal.Title>Merci pour votre visite</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="success-modal-content">
          <div className="success-modal-icon">
            🎉
          </div>
          <p className="success-modal-message">
            Votre demande a bien été enregistrée. Merci d'avoir utilisé notre service de tickets !
          </p>
          <p className="success-modal-redirect">
            Redirection automatique dans 2 secondes...
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" onClick={handleReset} block>
          Nouveau ticket
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;