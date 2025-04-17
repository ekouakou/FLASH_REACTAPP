// steps/OperationSelection.jsx
import React from 'react';
import { Grid, Row, Col, Button, Stack } from 'rsuite';
import SelectionCard from './SelectionCard.js';
import SelectionInfoBar from './SelectionInfoBar';

const OperationSelection = ({
  operations,
  selectedOperation,
  operationDelay,
  selectedService,
  handleOperationSelect,
  handlePrevious,
  handleNext,
  getSelectedServiceName,
  getSelectedOperationColor,
  serviceIcons,
  isMobile
}) => {
  return (
    <div>
      <h3 className="wizard-step-title">
        Sélectionnez le type d'opération
      </h3>
      <p className="wizard-step-description">
        Choisissez l'opération que vous souhaitez effectuer.
      </p>

      <SelectionInfoBar
        icon={serviceIcons[selectedService]}
        label="Service sélectionné :"
        value={getSelectedServiceName()}
      />

      <Grid fluid className="selection-grid">
        <Row gutter={isMobile ? 10 : 20}>
          {operations.map((operation) => (
            <Col xs={24} sm={12} md={8} key={operation.id} style={{ marginBottom: '20px' }}>
              <SelectionCard
                item={operation}
                isSelected={selectedOperation === operation.id}
                disabled={operationDelay && selectedOperation !== operation.id}
                onSelect={() => !operationDelay && handleOperationSelect(operation.id)}
                icon={operation.id.charAt(0).toUpperCase()}
                type="operation"
              />
            </Col>
          ))}
        </Row>
      </Grid>

      <Stack spacing={10} direction="row" justifyContent="space-between" className="wizard-actions">
        <Button appearance="subtle" onClick={handlePrevious}>
          Retour
        </Button>

        {selectedOperation && !operationDelay && (
          <Button
            appearance="primary"
            onClick={handleNext}
            style={{
              backgroundColor: getSelectedOperationColor(),
              borderColor: getSelectedOperationColor()
            }}
          >
            Continuer
          </Button>
        )}
      </Stack>
    </div>
  );
};

export default OperationSelection;