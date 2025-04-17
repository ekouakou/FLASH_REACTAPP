import React, { useState, useEffect } from 'react';
import {
  Steps, Panel, Button, Stack, Grid, Row, Col, Form, FlexboxGrid, List, Message, Modal, useMediaQuery, Loader, Animation
} from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import './Wizard.css'; // Importation du fichier CSS externalisé
import WizardNavbar from './WizardNavbar';
import WizardFooter from './WizardFooter';


// Utiliser des emojis au lieu d'icônes pour éviter les problèmes d'importation
const serviceIcons = {
  information: "ℹ️",
  consultation: "📅",
  paiement: "💳",
  reclamation: "💬",
  livraison: "📦",
  reparation: "🔧"
};

// Animation de fade pour les transitions
const { Fade } = Animation;

const VerticalTicketWizard = () => {
  // États principaux
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [ticketNumber, setTicketNumber] = useState('');
  const [waitTime, setWaitTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [selectionDelay, setSelectionDelay] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [operationDelay, setOperationDelay] = useState(false);

  // Media queries pour le responsive design
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isExtraSmall = useMediaQuery('(max-width: 480px)');

  // Liste des services disponibles
  const services = [
    { id: 'information', name: 'Operations de caisse', description: 'Renseignements généraux', color: '#3498db' },
    { id: 'consultation', name: 'Moyens de paiement', description: 'Rencontrer un conseiller', color: '#9b59b6' },
    { id: 'paiement', name: 'RDV conseillers', description: 'Effectuer un paiement', color: '#2ecc71' },
    { id: 'reclamation', name: 'Operations Spécifiques', description: 'Déposer une réclamation', color: '#e74c3c' },
    { id: 'livraison', name: 'Satisfaction client', description: 'Retrait de commande', color: '#f39c12' },
    { id: 'reparation', name: 'Réparation', description: 'Service après-vente', color: '#1abc9c' }
  ];

  // Liste des opérations disponibles
  const operations = [
    { id: 'depot', name: 'Dépôt', description: 'Faire un dépôt d\'argent', color: '#3498db' },
    { id: 'retrait', name: 'Retrait', description: 'Effectuer un retrait', color: '#9b59b6' },
    { id: 'virement', name: 'Virement', description: 'Réaliser un virement', color: '#2ecc71' },
    { id: 'change', name: 'Change', description: 'Service de change', color: '#e74c3c' },
    { id: 'credit', name: 'Crédit', description: 'Demander un crédit', color: '#f39c12' },
    { id: 'conseil', name: 'Conseil', description: 'Obtenir un conseil', color: '#1abc9c' }
  ];


  useEffect(() => {
    // Générer un numéro de ticket aléatoire mais consistant
    setTicketNumber(`AFG-${Math.floor(Math.random() * 1000)}`);
  }, []);

  useEffect(() => {
    // Générer un numéro de ticket aléatoire quand on arrive à l'étape finale
    if (step === 3) {
      const randomTicket = `A-${Math.floor(Math.random() * 100)}`;
      const randomWait = Math.floor(Math.random() * 20) + 5; // Entre 5 et 25 minutes
      setTicketNumber(randomTicket);
      setWaitTime(randomWait);
    }
  }, [step]);

  // Effet pour la redirection automatique après le modal de succès
  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        handleReset();
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccess]);

  // Fonctions utilitaires
  const getSelectedServiceName = () => {
    const service = services.find(s => s.id === selectedService);
    return service ? service.name : '';
  };

  const getSelectedServiceColor = () => {
    const service = services.find(s => s.id === selectedService);
    return service ? service.color : '';
  };

  const getSelectedOperationName = () => {
    const operation = operations.find(o => o.id === selectedOperation);
    return operation ? operation.name : '';
  };

  const getSelectedOperationColor = () => {
    const operation = operations.find(o => o.id === selectedOperation);
    return operation ? operation.color : '';
  };

  // Gestionnaires d'événements
  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setSelectionDelay(true);

    setTimeout(() => {
      setSelectionDelay(false);
      setTimeout(() => {
        setIsLoading(false);
        setStep(1);
      }, 100);
    }, 700);
  };

  const handleOperationSelect = (operationId) => {
    setSelectedOperation(operationId);
    setOperationDelay(true);

    setTimeout(() => {
      setOperationDelay(false);
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 100);
    }, 700);
  };

  const handleUserDataChange = (value, name) => {
    setUserData({
      ...userData,
      [name]: value
    });

    // Effacer l'erreur lorsque l'utilisateur corrige le champ
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const handleNext = () => {
    if (step === 1) {
      // Validation du formulaire avant de passer à l'étape suivante
      const errors = {};

      if (!userData.name.trim()) {
        errors.name = 'Le nom est obligatoire';
      }

      if (!userData.phone.trim()) {
        errors.phone = 'Le téléphone est obligatoire';
      } else if (!/^[0-9+\s-]{8,15}$/.test(userData.phone.trim())) {
        errors.phone = 'Numéro de téléphone invalide';
      }

      if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
        errors.email = 'Email invalide';
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
    }

    // Animation de transition
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(step + 1);
    }, 400);
  };

  const handlePrevious = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(step - 1);
    }, 400);
  };

  const handleConfirm = () => {
    setShowSuccess(true);
  };

  const handleReset = () => {
    // Réinitialiser tout le wizard
    setShowSuccess(false);
    setStep(0);
    setSelectedService(null);
    setSelectedOperation(null);
    setUserData({ name: '', phone: '', email: '' });
    setValidationErrors({});
  };

  const validateUserData = () => {
    return userData.name.trim() !== '' && userData.phone.trim() !== '';
  };

  // Rendu du contenu en fonction de l'étape actuelle
  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <Loader size="lg" content="Chargement..." vertical />
        </div>
      );
    }

    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <div>
              <h3 className="wizard-step-title">
                Sélectionnez le service souhaité
              </h3>
              <p className="wizard-step-description">
                Choisissez le service qui correspond à votre besoin pour commencer.
              </p>

              <Grid fluid className="selection-grid">
                <Row gutter={isMobile ? 10 : 20}>
                  {services.map((service) => {
                    const isSelected = selectedService === service.id;
                    return (
                      <Col xs={24} sm={12} md={8} key={service.id} style={{ marginBottom: '20px' }}>
                        <div
                          onClick={() => !selectionDelay && handleServiceSelect(service.id)}
                          className={`selection-card ${isSelected ? 'selected' : ''} ${selectionDelay && !isSelected ? 'disabled' : ''}`}
                          style={{
                            borderColor: isSelected ? service.color : '',
                            backgroundColor: isSelected ? `${service.color}15` : ''
                          }}
                          role="button"
                          aria-pressed={isSelected}
                          aria-label={`Service ${service.name}: ${service.description}`}
                        >
                          {isSelected && (
                            <div className="selection-check" style={{ backgroundColor: service.color }}>✓</div>
                          )}
                          <div className="selection-icon-container" style={{ color: isSelected ? service.color : '' }}>
                            {serviceIcons[service.id]}
                          </div>
                          <h4 className="selection-title" style={{ color: isSelected ? service.color : '' }}>
                            {service.name}
                          </h4>
                          <p className="selection-description">{service.description}</p>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Grid>

              {selectedService && !selectionDelay && (
                <div className="wizard-actions">
                  <div></div>
                  <Button
                    appearance="primary"
                    onClick={handleNext}
                    style={{ backgroundColor: getSelectedServiceColor(), borderColor: getSelectedServiceColor() }}
                  >
                    Continuer
                  </Button>
                </div>
              )}
            </div>
          </Fade>
        );

      case 1:
        return (
          <Fade in={true}>
            <div>
              <h3 className="wizard-step-title">
                Sélectionnez le type d'opération
              </h3>
              <p className="wizard-step-description">
                Choisissez l'opération que vous souhaitez effectuer.
              </p>

              <div className="selection-info-bar">
                <div className="selection-info-icon">
                  {serviceIcons[selectedService]}
                </div>
                <div>
                  <div className="selection-info-label">Service sélectionné :</div>
                  <div className="selection-info-value">{getSelectedServiceName()}</div>
                </div>
              </div>

              <Grid fluid className="selection-grid">
                <Row gutter={isMobile ? 10 : 20}>
                  {operations.map((operation) => {
                    const isSelected = selectedOperation === operation.id;
                    return (
                      <Col xs={24} sm={12} md={8} key={operation.id} style={{ marginBottom: '20px' }}>
                        <div
                          onClick={() => !operationDelay && handleOperationSelect(operation.id)}
                          className={`selection-card ${isSelected ? 'selected' : ''} ${operationDelay && !isSelected ? 'disabled' : ''}`}
                          style={{
                            borderColor: isSelected ? operation.color : '',
                            backgroundColor: isSelected ? `${operation.color}15` : ''
                          }}
                          role="button"
                          aria-pressed={isSelected}
                          aria-label={`Opération ${operation.name}: ${operation.description}`}
                        >
                          {isSelected && (
                            <div className="selection-check" style={{ backgroundColor: operation.color }}>✓</div>
                          )}
                          <div className="selection-icon-container" style={{ color: isSelected ? operation.color : '' }}>
                            {operation.id.charAt(0).toUpperCase()}
                          </div>
                          <h4 className="selection-title" style={{ color: isSelected ? operation.color : '' }}>
                            {operation.name}
                          </h4>
                          <p className="selection-description">{operation.description}</p>
                        </div>
                      </Col>
                    );
                  })}
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
                    style={{ backgroundColor: getSelectedOperationColor(), borderColor: getSelectedOperationColor() }}
                  >
                    Continuer
                  </Button>
                )}
              </Stack>
            </div>
          </Fade>
        );

      case 2:
        return (
          <Fade in={true}>
            <div>
              <h3 className="wizard-step-title" style={{ "--primary": getSelectedServiceColor() }}>
                Vos informations
              </h3>
              <p className="wizard-step-description">
                Veuillez renseigner vos coordonnées pour que nous puissions vous appeler.
              </p>

              <div className="selection-info-bar">
                <div className="selection-info-icon">
                  {serviceIcons[selectedService]}
                </div>
                <div>
                  <div className="selection-info-label">Service sélectionné :</div>
                  <div className="selection-info-value">{getSelectedServiceName()}</div>
                </div>
              </div>

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
          </Fade>
        );

      case 3:
        return (
          <Fade in={true}>
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
              </div>

              <Stack spacing={10} direction="row" justifyContent="space-between" className="wizard-actions">
                <Button appearance="subtle" onClick={handlePrevious}>
                  Modifier
                </Button>
                <Button
                  appearance="primary"
                  color="green"
                  onClick={handleNext}
                  style={{ backgroundColor: "var(--success)", borderColor: "var(--success)" }}
                >
                  Confirmer
                </Button>
              </Stack>
            </div>
          </Fade>
        );

      case 4:
        return (
          <Fade in={true}>
            <div className="ticket-success-container">
              <div className="ticket-success-icon">✅</div>
              <h3 className="ticket-success-title">Votre ticket est prêt !</h3>

              <div className="ticket-card">
                <div className="ticket-card-label">VOTRE NUMÉRO</div>
                <div className="ticket-number">{ticketNumber}</div>

                <div className="ticket-detail" style={{ borderTop: "1px solid var(--gray)" }}>
                  <div>Service</div>
                  <div style={{ fontWeight: '600' }}>{getSelectedServiceName()}</div>
                </div>

                <div className="ticket-detail">
                  <div>Opération</div>
                  <div style={{ fontWeight: '600' }}>{getSelectedOperationName()}</div>
                </div>

                <div className="ticket-detail" style={{ borderBottom: "0" }}>
                  <div>Client</div>
                  <div style={{ fontWeight: '600' }}>{userData.name}</div>
                </div>
              </div>

              <p className="ticket-message">
                Veuillez patienter, nous vous appellerons bientôt.
              </p>

              <Button
                appearance="primary"
                onClick={handleConfirm}
                className="ticket-finish-button"
                style={{ backgroundColor: "var(--success)", borderColor: "var(--success)" }}
              >
                Terminer
              </Button>
            </div>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <div className="ticket-wizard-container">
      {/* Barre de navigation stylisée */}
      <WizardNavbar />

      <div className="wizard-layout">
        {/* Wizard Steps - Vertical pour écran large, Horizontal pour petit écran */}
        <div className="wizard-sidebar">
          <div className="wizard-steps-card">
            <Steps
              current={step}
              vertical={!isMobile}
              small={isExtraSmall}
            >
              <Steps.Item
                title="Service"
                description={isMobile ? "" : "Choisissez votre service"}
              />
              <Steps.Item
                title="Opérations"
                description={isMobile ? "" : "Vos coordonnées"}
              />
              <Steps.Item
                title="Infos"
                description={isMobile ? "" : "Vos coordonnées"}
              />
              <Steps.Item
                title="Résumé"
                description={isMobile ? "" : "Vérifiez vos informations"}
              />
              <Steps.Item
                title="Terminé"
                description={isMobile ? "" : "Récupérez votre ticket"}
              />
            </Steps>
          </div>

          {/* Indicateur de progression pour les écrans mobiles */}
          {isMobile && (
            <div className="wizard-mobile-progress">
              <span className="wizard-progress-step">
                Étape {step + 1} sur 4
              </span>
              <span className="wizard-progress-label">
                {step === 0 && 'Choisir un service'}
                {step === 1 && 'Choisir une opération'}
                {step === 2 && 'Renseigner les informations'}
                {step === 3 && 'Vérifier le résumé'}
                {step === 4 && 'Ticket généré'}
              </span>
            </div>
          )}
        </div>


        {/* Contenu principal */}
        <div className="wizard-content">
          <Panel className="wizard-panel">
            {renderStepContent()}
          </Panel>

          <WizardFooter />
        </div>
      </div>

      {/* Modal de confirmation */}
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
    </div>
  );
};

export default VerticalTicketWizard;