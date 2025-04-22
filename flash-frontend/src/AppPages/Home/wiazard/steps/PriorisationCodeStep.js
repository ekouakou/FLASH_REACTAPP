import React, { useState } from "react";
import { Form, Message, Button, Stack,Input } from "rsuite";
// Conditionnellement importer SelectionInfoBar s'il est disponible
// Si vous ne l'utilisez pas encore, vous pouvez le commenter
// import SelectionInfoBar from "./SelectionInfoBar";

const PriorisationCodeStep = ({
  handleNext,
  handlePrevious,
  handlePriorisationCodeChange,
  priorisationCode,
  handlePriorisationCodeSubmit,
  validationErrors,
  getSelectedPrestationColor,
  isMobile,
  // Nouvelles props, avec valeurs par défaut pour éviter les erreurs
  selectedPrestation,
  getSelectedPrestationName,
  prestationIcons
}) => {
  const [error, setError] = useState("");

  const validateCode = () => {
    if (!priorisationCode || priorisationCode.trim().length < 3) {
      setError("Veuillez saisir un code de priorisation valide (minimum 3 caractères)");
      return false;
    }
    setError("");
    return true;
  };

  const handleContinue = () => {
    if (validateCode()) {
      handlePriorisationCodeSubmit?.(); // Appel optionnel avec "?."
    }
  };

  // Utilise une valeur par défaut si getSelectedPrestationColor n'est pas fourni
  const prestationColor = getSelectedPrestationColor ? getSelectedPrestationColor() : "#9b59b6";

  return (
    <div className="wizard-container">
      <h3 className="wizard-step-title" style={{ "--primary": prestationColor }}>
        Code de priorisation
      </h3>
      <p className="wizard-step-description">
        Veuillez saisir votre code de priorisation pour continuer.
      </p>
      
      {/* Affiche SelectionInfoBar seulement si toutes les props nécessaires sont disponibles */}
      {prestationIcons && selectedPrestation && getSelectedPrestationName && (
        <div className="selection-info-container">
          <div className="selection-info">
            <span className="selection-info-label">Prestation sélectionnée :</span>
            <div className="selection-info-value">
              {prestationIcons[selectedPrestation] && (
                <span className="selection-info-icon">{prestationIcons[selectedPrestation]}</span>
              )}
              <span>{getSelectedPrestationName()}</span>
            </div>
          </div>
        </div>
      )}

      <Form fluid>
        <Form.Group>
          <Form.ControlLabel>Code de priorisation*</Form.ControlLabel>
          <Form.Control
            name="priorisationCode"
            size="lg"
            className="codepriorite"
            value={priorisationCode || ""}
            onChange={(value) => {
              handlePriorisationCodeChange(value);
              if (error) setError("");
            }}
            placeholder="Entrez votre code de priorisation"
            errorMessage={error || (validationErrors?.priorisationCode)}
            error={!!(error || (validationErrors?.priorisationCode))}
          />
          {/* <Input as="textarea" rows={3} ame="priorisationCode"
            value={priorisationCode || ""}
            onChange={(value) => {
              handlePriorisationCodeChange(value);
              if (error) setError("");
            }}
            placeholder="Entrez votre code de priorisation"
            errorMessage={error || (validationErrors?.priorisationCode)}
            error={!!(error || (validationErrors?.priorisationCode))}
           /> */}
        </Form.Group>

        <Message
          showIcon
          type="info"
          style={{ marginTop: '20px' }}
        >
          Le code de priorisation vous a été communiqué par votre conseiller. Si vous n'avez pas de code, veuillez revenir à l'étape précédente et choisir une autre prestation.
        </Message>
      </Form>

      <Stack spacing={10} direction="row" justifyContent="space-between" className="wizard-actions">
        <Button appearance="subtle" onClick={handlePrevious}>
          Retour
        </Button>
        <Button
          appearance="primary"
          onClick={handleContinue}
          style={{
            backgroundColor: prestationColor,
            borderColor: prestationColor,
            opacity: priorisationCode && priorisationCode.trim().length >= 3 ? 1 : 0.6
          }}
        >
          Continuer
        </Button>
      </Stack>
    </div>
  );
};

export default PriorisationCodeStep;