// steps/ServiceSelection.jsx
import React from 'react';
import { Grid, Row, Col, Button } from 'rsuite';
import SelectionCard from './SelectionCard';

const ServiceSelection = ({
  services,
  selectedService,
  selectionDelay,
  handleServiceSelect,
  handleNext,
  getSelectedServiceColor,
  isMobile
}) => {
  return (
    <div>
      <h3 className="wizard-step-title">
        Sélectionnez le service souhaité
      </h3>
      <p className="wizard-step-description">
        Choisissez le service qui correspond à votre besoin pour commencer.
      </p>

      <Grid fluid className="selection-grid">
        <Row gutter={isMobile ? 10 : 20}>
          {services.map((service) => (
            <Col xs={24} sm={12} md={8} key={service.id} style={{ marginBottom: '20px' }}>
              <SelectionCard
                item={service}
                isSelected={selectedService === service.id}
                disabled={selectionDelay && selectedService !== service.id}
                onSelect={() => !selectionDelay && handleServiceSelect(service.id)}
                icon={service.id} // On utilise l'ID comme clé pour l'icône
                type="service"
              />
            </Col>
          ))}
        </Row>
      </Grid>

      {selectedService && !selectionDelay && (
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
      )}
    </div>
  );
};

export default ServiceSelection;