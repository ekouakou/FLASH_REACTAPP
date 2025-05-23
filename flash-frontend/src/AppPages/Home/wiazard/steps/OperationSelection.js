// steps/OperationSelection.jsx
import React from "react";
import { Grid, Row, Col, Button, Stack, Loader } from "rsuite";
import SelectionCard from "./SelectionCard";
import SelectionInfoBar from "./SelectionInfoBar";
import WizardStepHeader from "./WizardStepHeader";

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
  isMobile,
  getSelectedServiceData,
}) => {
  // Récupérer les données du service sélectionné pour afficher l'image
  const serviceData = getSelectedServiceData();

  // Vérifier si les opérations sont chargées
  if (!operations || operations.length === 0) {
    return (
      <div className="wizard-container">
        <div className="wizard-content">
          <WizardStepHeader
            title="Sélectionnez le type d'opération"
            description="Chargement des opérations disponibles..."
          />
          <SelectionInfoBar
            icon={
              serviceData.imagePath ? (
                <img
                  src={serviceData.imagePath}
                  alt="Service"
                  width={24}
                  height={24}
                />
              ) : (
                serviceIcons[selectedService]
              )
            }
            label="Service sélectionné :"
            value={getSelectedServiceName()}
          />
          <div className="loading-container">
            <Loader size="lg" content="Chargement des opérations..." vertical />
          </div>
        </div>
        <div className="wizard-actions">
          <Button appearance="subtle" onClick={handlePrevious}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-container">
      <div className="wizard-content">
        <div className="wizard-header">
          <WizardStepHeader
            title="Sélectionnez le type d'opération"
            description="Choisissez l'opération que vous souhaitez effectuer."
          />
          <SelectionInfoBar
            icon={
              serviceData.imagePath ? (
                <img
                  src={serviceData.imagePath}
                  alt="Service"
                  width={24}
                  height={24}
                />
              ) : (
                serviceIcons[selectedService]
              )
            }
            label="Service sélectionné :"
            value={getSelectedServiceName()}
          />
        </div>
        <Grid fluid className="selection-grid">
          <Row gutter={isMobile ? 10 : 20}>
            {operations.map((operation) => (
              <Col
                xs={24}
                sm={12}
                md={6}
                key={operation.id}
                className="equal-height-col"
              >
                <SelectionCard
                  item={operation}
                  isSelected={selectedOperation === operation.id}
                  disabled={
                    operationDelay && selectedOperation !== operation.id
                  }
                  onSelect={() =>
                    !operationDelay && handleOperationSelect(operation.id)
                  }
                  type="operation"
                />
              </Col>
            ))}
          </Row>
        </Grid>
      </div>

      <div className="wizard-actions">
        <Button appearance="subtle" onClick={handlePrevious}>
          Retour
        </Button>

        {selectedOperation && !operationDelay && (
          <Button
            appearance="primary"
            onClick={handleNext}
            style={{
              backgroundColor: getSelectedOperationColor(),
              borderColor: getSelectedOperationColor(),
            }}
          >
            Continuer
          </Button>
        )}
      </div>
    </div>
  );
};

export default OperationSelection;