// steps/ServiceSelection.jsx
import React from "react";
import { Grid, Row, Col, Button, Loader } from "rsuite";
import SelectionCard from "./SelectionCard";

const ServiceSelection = ({
  services,
  selectedService,
  selectionDelay,
  handleServiceSelect,
  handleNext,
  handlePrevious,
  getSelectedServiceColor,
  isMobile,
}) => {
  // Vérifier si les services sont chargés
  if (!services || services.length === 0) {
    return (
      <div className="loading-container">
        <Loader size="lg" content="Chargement des services..." vertical />
      </div>
    );
  }

  return (
    <div className="wizard-container">
      <h3 className="wizard-step-title">Sélectionnez le service souhaité</h3>
      <p className="wizard-step-description">
        Choisissez le service qui correspond à votre besoin pour commencer.
      </p>

      <Grid fluid className="selection-grid">
        <Row gutter={isMobile ? 10 : 20}>
          {services.map((service) => (
            <Col
              xs={24}
              sm={12}
              md={6}
              key={service.id}
              style={{ marginBottom: "20px" }}
              className="equal-height-col"
            >
              <SelectionCard
                item={service}
                isSelected={selectedService === service.id}
                disabled={selectionDelay && selectedService !== service.id}
                onSelect={() =>
                  !selectionDelay && handleServiceSelect(service.id)
                }
                icon={service.id} // On utilise l'ID comme clé pour l'icône
                type="service"
              />
            </Col>
          ))}
        </Row>
      </Grid>

      {/* {selectedService && !selectionDelay && (
        <div className="wizard-actions">
          <div></div>
          <Button
            appearance="primary"
            onClick={handleNext}
            style={{
              backgroundColor: getSelectedServiceColor(),
              borderColor: getSelectedServiceColor()
            }}
          >
            Continuer
          </Button>
        </div>
      )} */}
      <div className="wizard-actions">
        <Button appearance="subtle" onClick={handlePrevious}>Retour</Button>

        {selectedService && !selectionDelay && (
          <Button
            appearance="primary"
            onClick={handleNext}
            style={{
              backgroundColor: getSelectedServiceColor(),
              borderColor: getSelectedServiceColor(),
            }}
          >
            Continuer
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServiceSelection;
