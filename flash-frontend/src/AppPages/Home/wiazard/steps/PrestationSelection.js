import React, { forwardRef } from "react";
import { Grid, Row, Col, Button, Loader } from "rsuite";
import SelectionCard from "./SelectionCard";

const PrestationSelection = forwardRef(({
  selectedService,
  selectionDelay,
  handleServiceSelect,
  handleNext,
  handlePrevious,
  getSelectedServiceColor,
  isMobile,
}, ref) => {
  const prestation = [
    {
      id: "Service",
      name: "Service",
      description: "Renseignements généraux",
      color: "#3498db",
      imagePath:"assets/images/logos/services.svg"
    },
    {
      id: "Priorisation",
      name: "Priorisation",
      description: "Rencontrer un conseiller",
      color: "#9b59b6",
      imagePath:"assets/images/logos/prioritize.svg"
    },
    {
      id: "Satisfaction",
      name: "Satisfaction",
      description: "Effectuer un paiement",
      color: "#2ecc71",
      imagePath:"assets/images/logos/emoticone-excellent.svg"
    },
  ];

  // Vérifier si les services sont chargés
  if (!prestation || prestation.length === 0) {
    return (
      <div className="loading-container" ref={ref}>
        <Loader size="lg" content="Chargement des prestations..." vertical />
      </div>
    );
  }

  return (
    <div className="wizard-container" ref={ref}>
      <h3 className="wizard-step-title">Sélectionnez une prestation</h3>
      <p className="wizard-step-description">
        Choisissez la prestation qui correspond à votre besoin pour commencer.
      </p>
      
      <Grid fluid className="selection-grid">
        <Row gutter={isMobile ? 10 : 20}>
          {prestation.map((prestation) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              key={prestation.id}
              style={{ marginBottom: "20px" }}
              className="equal-height-col"
            >
              <SelectionCard
                item={prestation}
                isSelected={selectedService === prestation.id}
                disabled={selectionDelay && selectedService !== prestation.id}
                onSelect={() =>
                  !selectionDelay && handleServiceSelect(prestation.id)
                }
                icon={prestation.id} // On utilise l'ID comme clé pour l'icône
                type="prestation"
              />
            </Col>
          ))}
        </Row>
      </Grid>
      
      <div className="wizard-actions">
        <Button appearance="subtle"></Button>
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
});

export default PrestationSelection;