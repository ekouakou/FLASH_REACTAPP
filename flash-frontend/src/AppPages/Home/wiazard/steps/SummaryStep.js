// steps/SummaryStep.jsx
import React from 'react';
import { List, FlexboxGrid, Message, Button, Stack, Loader } from 'rsuite';

const SummaryStep = ({
  userData,
  selectedService,
  selectedOperation,
  getSelectedServiceName,
  getSelectedServiceColor,
  getSelectedOperationName,
  getSelectedOperationColor,
  handlePrevious,
  handleNext,
  serviceIcons,
  apiSubmitting,
  apiError
}) => {
  return (
    <div>
      <h3 className="wizard-step-title" style={{ "--primary": getSelectedServiceColor() }}>
        Résumé de votre demande
      </h3>
      <p className="wizard-step-description">
        Vérifiez que les informations suivantes sont correctes avant de confirmer.
      </p>

      <div className="summary-container">
        <List bordered style={{ borderRadius: '8px' }}>
          <List.Item>
            <FlexboxGrid justify="start" align="middle">
              <FlexboxGrid.Item colspan={6}>
                <strong className="summary-item-label">Service :</strong>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={18}>
                <div className="summary-item-value-container" style={{ backgroundColor: `${getSelectedServiceColor()}15` }}>
                  <span className="summary-item-icon" style={{ color: getSelectedServiceColor() }}>
                    {serviceIcons[selectedService]}
                  </span>
                  <span className="summary-item-value" style={{ color: getSelectedServiceColor() }}>
                    {getSelectedServiceName()}
                  </span>
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>
          <List.Item>
            <FlexboxGrid justify="start" align="middle">
              <FlexboxGrid.Item colspan={6}>
                <strong className="summary-item-label">Opération :</strong>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={18}>
                <div className="summary-item-value-container" style={{ backgroundColor: `${getSelectedOperationColor()}15` }}>
                  <span className="summary-item-icon" style={{ color: getSelectedOperationColor() }}>
                    {selectedOperation.charAt(0).toUpperCase()}
                  </span>
                  <span className="summary-item-value" style={{ color: getSelectedOperationColor() }}>
                    {getSelectedOperationName()}
                  </span>
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>
          <List.Item>
            <FlexboxGrid justify="start">
              <FlexboxGrid.Item colspan={6}>
                <strong className="summary-item-label">Nom :</strong>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={18}>
                {userData.name}
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>
          <List.Item>
            <FlexboxGrid justify="start">
              <FlexboxGrid.Item colspan={6}>
                <strong className="summary-item-label">Téléphone :</strong>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={18}>
                {userData.phone}
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>
          {userData.email && (
            <List.Item>
              <FlexboxGrid justify="start">
                <FlexboxGrid.Item colspan={6}>
                  <strong className="summary-item-label">Email :</strong>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={18}>
                  {userData.email}
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </List.Item>
          )}
        </List>

        <Message
          showIcon
          type="warning"
          style={{ marginTop: '20px' }}
        >
          Après confirmation, un ticket sera généré et vous serez appelé(e) à votre tour.
        </Message>

        {apiError && (
          <Message
            showIcon
            type="error"
            style={{ marginTop: '10px' }}
          >
            {apiError}
          </Message>
        )}
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