import React from 'react';
import { List, FlexboxGrid, Message, Button, Stack, Loader } from 'rsuite';
import { serviceIcons, serviceColors } from "../constants";

const SummaryStep = ({
  userData,
  selectedService,
  selectedOperation,
  getSelectedServiceName,
  getSelectedServiceColor,
  getSelectedOperationName,
  getSelectedOperationColor,
  priorisationCode,
  selectedEmotion,
  emotions, // Array of emotion objects from SatisfactionFeedback
  handlePrevious,
  handleNext,
  apiSubmitting,
  apiError
}) => {
  // Find the selected emotion object if available
  const selectedEmotionData = emotions?.find(emotion => emotion.id === selectedEmotion);

  return (
    <div className="wizard-container">
      <h3 className="wizard-step-title" style={{ "--primary": getSelectedServiceColor() }}>
        Résumé de votre demande
      </h3>
      <p className="wizard-step-description">
        Vérifiez que les informations suivantes sont correctes avant de confirmer.
      </p>

      <div className="summary-container">
        <strong className="summary-item-label">Service :</strong>
        <div className="summary-item-value-container" style={{ backgroundColor: `${getSelectedServiceColor()}15` }}>
          <span className="summary-item-icon" style={{ color: getSelectedServiceColor() }}>
            {serviceIcons[selectedService]}
          </span>
          <span className="summary-item-value" style={{ color: getSelectedServiceColor() }}>
            {getSelectedServiceName()}
          </span>
        </div>

        <strong className="summary-item-label">Opération :</strong>
        <div className="summary-item-value-container" style={{ backgroundColor: `${getSelectedOperationColor()}15` }}>
          <span className="summary-item-value" style={{ color: getSelectedOperationColor() }}>
            {getSelectedOperationName()}
          </span>
        </div>

        {priorisationCode && (
          <>
            <strong className="summary-item-label">Code de priorisation :</strong>
            {priorisationCode}
          </>

        )}

        {selectedEmotionData && (
          <>
            <strong className="summary-item-label">Satisfaction :</strong>
            <div className="summary-item-value-container" style={{ backgroundColor: `${selectedEmotionData.color}15` }}>
              <span className="summary-item-icon" style={{ color: selectedEmotionData.color }}>
                {selectedEmotionData.iconName}
              </span>
              <span className="summary-item-value" style={{ color: selectedEmotionData.color }}>
                {selectedEmotionData.name}
              </span>
            </div>
          </>
        )}

        <strong className="summary-item-label">Nom :</strong>
        {userData.name}
        <strong className="summary-item-label">Téléphone :</strong>
        {userData.phone}

        {userData.email && (
          <>
            <strong className="summary-item-label">Email :</strong>
            {userData.email}
          </>
        )}

        <p
          showIcon
          type="warning"
          style={{ marginTop: '20px' }}
        >
          Après confirmation, un ticket sera généré et vous serez appelé(e) à votre tour.
        </p>

      </div>

      <Stack spacing={10} direction="row" justifyContent="space-between" className="wizard-actions">
        <Button appearance="subtle" onClick={handlePrevious} disabled={apiSubmitting}>
          Modifier
        </Button>
        <Button
          appearance="primary"
          color="green"
          onClick={handleNext}
          disabled={apiSubmitting}
          style={{ backgroundColor: "var(--success)", borderColor: "var(--success)" }}
        >
          {apiSubmitting ? <Loader content="Traitement..." /> : "Confirmer"}
        </Button>
      </Stack>
    </div>
  );
};

export default SummaryStep;