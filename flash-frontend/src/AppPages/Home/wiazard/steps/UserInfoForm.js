// steps/UserInfoForm.jsx
import React from 'react';
import { Form, Message, Button, Stack } from 'rsuite';
import SelectionInfoBar from './SelectionInfoBar';

const UserInfoForm = ({
  userData,
  validationErrors,
  handleUserDataChange,
  handlePrevious,
  handleNext,
  validateUserData,
  selectedService,
  getSelectedServiceName,
  getSelectedServiceColor,
  serviceIcons
}) => {
  return (
    <div>
      <h3 className="wizard-step-title" style={{ "--primary": getSelectedServiceColor() }}>
        Vos informations
      </h3>
      <p className="wizard-step-description">
        Veuillez renseigner vos coordonnées pour que nous puissions vous appeler.
      </p>

      <SelectionInfoBar
        icon={serviceIcons[selectedService]}
        label="Service sélectionné :"
        value={getSelectedServiceName()}
      />

      <Form fluid>
        <Form.Group>
          <Form.ControlLabel>Nom complet*</Form.ControlLabel>
          <Form.Control
            name="name"
            value={userData.name}
            onChange={(value) => handleUserDataChange(value, 'name')}
            placeholder="Entrez votre nom et prénom"
            errorMessage={validationErrors.name}
            error={!!validationErrors.name}
          />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Téléphone*</Form.ControlLabel>
          <Form.Control
            name="phone"
            value={userData.phone}
            onChange={(value) => handleUserDataChange(value, 'phone')}
            placeholder="Ex: 0612345678"
            errorMessage={validationErrors.phone}
            error={!!validationErrors.phone}
          />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Email (optionnel)</Form.ControlLabel>
          <Form.Control
            name="email"
            type="email"
            value={userData.email}
            onChange={(value) => handleUserDataChange(value, 'email')}
            placeholder="votre@email.com"
            errorMessage={validationErrors.email}
            error={!!validationErrors.email}
          />
          <Form.HelpText>Nous vous enverrons une confirmation si fourni</Form.HelpText>
        </Form.Group>

        <Message
          showIcon
          type="info"
          style={{ marginTop: '20px' }}
        >
          Les champs marqués d'un * sont obligatoires
        </Message>
      </Form>

      <Stack spacing={10} direction="row" justifyContent="space-between" className="wizard-actions">
        <Button appearance="subtle" onClick={handlePrevious}>
          Retour
        </Button>
        <Button
          appearance="primary"
          onClick={handleNext}
          disabled={!validateUserData()}
          style={{
            backgroundColor: getSelectedServiceColor(),
            borderColor: getSelectedServiceColor(),
            opacity: validateUserData() ? 1 : 0.6
          }}
        >
          Continuer
        </Button>
      </Stack>
    </div>
  );
};

export default UserInfoForm;