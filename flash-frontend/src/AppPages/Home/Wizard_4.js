import React, { useState, useEffect } from 'react';
import {
  Steps,
  Panel,
  Button,
  Stack,
  Grid,
  Row,
  Col,
  Form,
  FlexboxGrid,
  List,
  Message,
  Modal,
  useMediaQuery,
  Loader,
  Animation
} from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import styled from 'styled-components';

// Palette de couleurs AFG Bank CI optimisée
const theme = {
  primary: '#0A2557',     // Bleu royal AFG Bank (principal)
  secondary: '#CC9933',   // Or/ocre AFG Bank
  primaryLight: '#E6EAF2', // Bleu AFG Bank très clair (pour arrière-plans)
  success: '#00874A',     // Vert foncé élégant
  warning: '#CB8A14',     // Orange plus sophistiqué
  danger: '#B2293A',      // Rouge élégant
  dark: '#1A1A2E',        // Texte principal presque noir
  gray: '#5A6685',        // Bleu-gris pour texte secondaire
  light: '#F8F9FC',       // Fond clair légèrement bleuté
  border: '#D8DEE9',      // Bordures subtiles
  gold: '#CC9933',        // Or AFG Bank pour accents luxueux
  goldLight: '#F0E6CC',   // Or très clair pour arrière-plans
}

// Configuration typographique AFG Bank CI
const typography = {
  fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: 1.5,
}

// Système d'ombres premium
const shadows = {
  sm: '0 2px 6px rgba(0,0,0,0.05)',
  md: '0 8px 16px rgba(0,0,0,0.1)',
  lg: '0 12px 24px rgba(0,0,0,0.15)',
  hover: '0 10px 20px rgba(10, 37, 87, 0.15)',
}

// Système de bordures arrondies
const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
}

// Système d'espacement
const spacing = {
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px',
  xxl: '64px',
}

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

// Composants stylisés pour une meilleure cohérence visuelle
const WizardContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: ${props => props.isMobile ? spacing.sm : spacing.md};
  font-family: ${typography.fontFamily};
  color: ${theme.dark};
  line-height: ${typography.lineHeight};
`;

const WizardTitle = styled.h1`
  text-align: center;
  margin-bottom: ${spacing.xl};
  color: ${theme.primary};
  font-weight: ${typography.fontWeights.bold};
  font-size: ${props => props.isMobile ? typography.fontSizes.xxl : typography.fontSizes.xxxl};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: ${theme.secondary};
    border-radius: ${borderRadius.full};
  }
`;

const WizardLayout = styled.div`
  display: flex;
  flex-direction: ${props => props.isMobile ? 'column' : 'row'};
  width: 100%;
`;

const StepsContainer = styled.div`
  width: ${props => props.isMobile ? '100%' : '20%'};
  margin-right: ${props => props.isMobile ? 0 : spacing.md};
  margin-bottom: ${props => props.isMobile ? spacing.md : 0};
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin: ${spacing.xs} 0 ${spacing.md};
  padding: 0 ${spacing.xs};
`;

const StepNumber = styled.span`
  color: ${theme.gray};
  font-size: ${typography.fontSizes.sm};
`;

const StepName = styled.span`
  color: ${props => props.color || theme.primary};
  font-weight: ${typography.fontWeights.medium};
  font-size: ${typography.fontSizes.sm};
`;

const ContentContainer = styled.div`
  width: ${props => props.isMobile ? '100%' : '80%'};
`;

const ContentPanel = styled(Panel)`
  padding: ${props => props.isMobile ? spacing.md : spacing.xl};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadows.md};
  min-height: 400px;
  border: 1px solid ${theme.border};
  background-color: white;
  transition: all 0.3s ease;
`;

const SectionHeading = styled.h3`
  margin-bottom: ${spacing.md};
  color: ${theme.dark};
  font-weight: ${typography.fontWeights.semibold};
  position: relative;
  font-size: ${typography.fontSizes.xl};
  
  &:after {
    content: '';
    height: 3px;
    width: 50px;
    background: ${props => props.color || theme.primary};
    position: absolute;
    bottom: -8px;
    left: 0;
    border-radius: ${borderRadius.full};
  }
`;

const SectionDescription = styled.p`
  margin-bottom: ${spacing.md};
  color: ${theme.gray};
  font-size: ${typography.fontSizes.md};
`;

const ServiceCard = styled.div`
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  border: 2px solid ${props => props.isSelected ? props.color : theme.border};
  cursor: ${props => props.selectionDelay ? 'default' : 'pointer'};
  transition: all 0.3s ease;
  background-color: ${props => props.isSelected ? `${props.color}15` : theme.light};
  box-shadow: ${props => props.isSelected ? shadows.md : shadows.sm};
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: ${props => props.isSelected ? 'translateY(-3px)' : 'translateY(0)'};
  position: relative;
  overflow: hidden;
  opacity: ${props => props.selectionDelay && !props.isSelected ? 0.5 : 1};
  
  &:hover {
    transform: ${props => (!props.selectionDelay && !props.isSelected) ? 'translateY(-2px)' : props.isSelected ? 'translateY(-3px)' : 'translateY(0)'};
    box-shadow: ${props => (!props.selectionDelay && !props.isSelected) ? shadows.hover : props.isSelected ? shadows.md : shadows.sm};
    border-color: ${props => (!props.selectionDelay && !props.isSelected) ? `${props.color}80` : props.isSelected ? props.color : theme.border};
  }
`;

const CheckMark = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${props => props.color};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
`;

const ServiceIcon = styled.div`
  font-size: 32px;
  margin-bottom: ${spacing.xs};
  color: ${props => props.isSelected ? props.color : theme.gray};
  transition: all 0.3s;
  transform: ${props => props.isSelected ? 'scale(1.1)' : 'scale(1)'};
`;

const ServiceName = styled.h4`
  margin: ${spacing.xs} 0 5px;
  text-align: center;
  color: ${props => props.isSelected ? props.color : theme.dark};
  font-weight: ${props => props.isSelected ? typography.fontWeights.semibold : typography.fontWeights.medium};
  font-size: ${typography.fontSizes.md};
`;

const ServiceDescription = styled.p`
  margin: 0;
  text-align: center;
  color: ${theme.gray};
  font-size: ${typography.fontSizes.sm};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: ${props => props.position || 'flex-end'};
  margin-top: ${spacing.lg};
`;

const TicketContainer = styled.div`
  text-align: center;
`;

const TicketSuccessIcon = styled.div`
  color: ${theme.success};
  font-size: 80px;
  margin-bottom: ${spacing.md};
  display: flex;
  justify-content: center;
`;

const TicketTitle = styled.h3`
  color: ${theme.dark};
  margin-bottom: ${spacing.sm};
  font-weight: ${typography.fontWeights.semibold};
  font-size: ${typography.fontSizes.xl};
`;

const TicketCard = styled.div`
  background-color: ${theme.primaryLight};
  border-radius: ${borderRadius.md};
  padding: ${spacing.sm};
  margin: ${spacing.md} auto;
  max-width: 300px;
  border: 2px dashed ${theme.primary};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${shadows.md};
    transform: translateY(-2px);
  }
`;

const TicketLabel = styled.p`
  font-size: ${typography.fontSizes.md};
  margin: 0 0 ${spacing.xs} 0;
  color: ${theme.gray};
`;

const TicketNumber = styled.span`
  font-size: 28px;
  font-weight: bold;
  color: ${theme.primary};
  letter-spacing: 1px;
  display: block;
  margin: ${spacing.xs} 0;
`;

const WaitingTimeCard = styled.div`
  background-color: ${theme.light};
  border-radius: ${borderRadius.sm};
  padding: ${spacing.sm};
  margin: ${spacing.md} auto;
  max-width: 80%;
  border: 1px solid ${theme.border};
`;

const WaitingTimeText = styled.p`
  color: ${theme.gray};
  margin: 0;
`;

const WaitingTimeValue = styled.strong`
  color: ${theme.primary};
  margin-left: 5px;
`;

const ServiceBadge = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => `${props.color}15`};
  padding: 8px 12px;
  border-radius: ${borderRadius.sm};
  width: fit-content;
`;

const ServiceBadgeIcon = styled.span`
  margin-right: 10px;
  color: ${props => props.color};
  font-size: 18px;
`;

const ServiceBadgeName = styled.span`
  font-weight: ${typography.fontWeights.medium};
  color: ${props => props.color};
`;

// Personnalisation du style de rsuite pour correspondre à la charte AFG Bank
const customRsuiteStyles = `
  .rs-steps-item-status-process .rs-steps-item-icon-wrapper {
    background-color: ${theme.primary} !important;
    border-color: ${theme.primary} !important;
  }
  
  .rs-steps-item-status-finish .rs-steps-item-icon-wrapper {
    background-color: white !important;
    color: ${theme.primary} !important;
    border-color: ${theme.primary} !important;
  }
  
  .rs-steps-item-status-process .rs-steps-item-title,
  .rs-steps-item-status-finish .rs-steps-item-title {
    color: ${theme.primary} !important;
    font-weight: ${typography.fontWeights.medium} !important;
  }
  
  .rs-steps-item-description {
    color: ${theme.gray} !important;
  }
  
  .rs-btn-primary {
    background-color: ${theme.primary} !important;
    border-color: ${theme.primary} !important;
    font-weight: ${typography.fontWeights.medium};
    transition: all 0.3s ease;
  }
  
  .rs-btn-primary:hover {
    background-color: ${theme.primary}ee !important;
    box-shadow: ${shadows.hover};
    transform: translateY(-1px);
  }
  
  .rs-form-control-wrapper {
    width: 100%;
  }
  
  .rs-input {
    border-radius: ${borderRadius.sm};
    padding: 8px 12px;
    border-color: ${theme.border};
  }
  
  .rs-input:focus {
    border-color: ${theme.primary};
    box-shadow: 0 0 0 2px ${theme.primary}33;
  }
  
  .rs-message {
    border-radius: ${borderRadius.sm};
    border-left-width: 4px;
  }
  
  .rs-form-control-label {
    font-weight: ${typography.fontWeights.medium};
    color: ${theme.dark};
  }
  
  .rs-form-help-text {
    font-size: ${typography.fontSizes.sm};
    color: ${theme.gray};
  }
  
  .rs-modal {
    border-radius: ${borderRadius.lg};
    overflow: hidden;
  }
  
  .rs-modal-header {
    border-bottom-color: ${theme.border};
  }
  
  .rs-modal-title {
    color: ${theme.primary};
    font-weight: ${typography.fontWeights.semibold};
  }
  
  .rs-modal-footer {
    border-top-color: ${theme.border};
  }
  
  .rs-list-item {
    transition: background 0.2s ease;
    padding: 12px 16px;
  }
  
  .rs-list-bordered {
    border-color: ${theme.border};
  }
`;

const VerticalTicketWizard = () => {
  // Injecter les styles CSS personnalisés
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.innerHTML = customRsuiteStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

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

  // Media queries pour le responsive design
  // On définit mobile comme étant les écrans de moins de 768px (tablettes et téléphones)
  const isMobile = useMediaQuery('(max-width: 767px)');
  // Très petits écrans (téléphones)
  const isExtraSmall = useMediaQuery('(max-width: 480px)');

  // Liste des services disponibles
  const services = [
    { id: 'information', name: 'Information', description: 'Renseignements généraux', color: theme.primary },
    { id: 'consultation', name: 'Consultation', description: 'Rencontrer un conseiller', color: theme.secondary },
    { id: 'paiement', name: 'Paiement', description: 'Effectuer un paiement', color: theme.success },
    { id: 'reclamation', name: 'Réclamation', description: 'Déposer une réclamation', color: theme.danger },
    { id: 'livraison', name: 'Livraison', description: 'Retrait de commande', color: theme.warning },
    { id: 'reparation', name: 'Réparation', description: 'Service après-vente', color: '#1abc9c' }
  ];

  // Effets
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

  // Gestionnaires d'événements
  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setSelectionDelay(true);

    // Attendre pour que l'utilisateur voie son choix
    setTimeout(() => {
      setSelectionDelay(false);
      // Puis afficher le loader
      setTimeout(() => {
        setIsLoading(false);
        setStep(1);
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
    setUserData({ name: '', phone: '', email: '' });
    setValidationErrors({});
  };

  const validateUserData = () => {
    return userData.name.trim() !== '' && userData.phone.trim() !== '';
  };

  const getSelectedServiceName = () => {
    const service = services.find(s => s.id === selectedService);
    return service ? service.name : '';
  };

  const getSelectedServiceColor = () => {
    const service = services.find(s => s.id === selectedService);
    return service ? service.color : theme.primary;
  };

  // Rendu du contenu en fonction de l'étape actuelle
  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px'
        }}>
          <Loader size="lg" content="Chargement..." vertical />
        </div>
      );
    }

    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <div>
              <SectionHeading color={theme.primary}>
                Sélectionnez le service souhaité
              </SectionHeading>
              <SectionDescription>
                Choisissez le service qui correspond à votre besoin pour commencer.
              </SectionDescription>
              
              <Grid fluid>
                <Row gutter={isMobile ? 10 : 20}>
                  {services.map((service) => {
                    const isSelected = selectedService === service.id;
                    return (
                      <Col xs={24} sm={12} md={8} key={service.id} style={{ marginBottom: spacing.md }}>
                        <ServiceCard 
                          isSelected={isSelected}
                          selectionDelay={selectionDelay}
                          color={service.color}
                          onClick={() => !selectionDelay && handleServiceSelect(service.id)}
                          role="button"
                          aria-pressed={isSelected}
                          aria-label={`Service ${service.name}: ${service.description}`}
                        >
                          {isSelected && <CheckMark color={service.color}>✓</CheckMark>}
                          <ServiceIcon isSelected={isSelected} color={service.color}>
                            {serviceIcons[service.id]}
                          </ServiceIcon>
                          <ServiceName isSelected={isSelected} color={service.color}>
                            {service.name}
                          </ServiceName>
                          <ServiceDescription>
                            {service.description}
                          </ServiceDescription>
                        </ServiceCard>
                      </Col>
                    );
                  })}
                </Row>
              </Grid>

              {selectedService && !selectionDelay && (
                <ButtonContainer>
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
                </ButtonContainer>
              )}
            </div>
          </Fade>
        );

      case 1:
        return (
          <Fade in={true}>
            <div>
              <SectionHeading color={getSelectedServiceColor()}>
                Vos informations
              </SectionHeading>
              <SectionDescription>
                Veuillez renseigner vos coordonnées pour que nous puissions vous appeler.
              </SectionDescription>

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
                  style={{ marginTop: spacing.md }}
                >
                  Les champs marqués d'un * sont obligatoires
                </Message>
              </Form>

              <Stack
                spacing={10}
                direction="row"
                justifyContent="space-between"
                style={{ marginTop: spacing.xl }}
              >
                <Button
                  appearance="subtle"
                  onClick={handlePrevious}
                >
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

      case 2:
        return (
          <Fade in={true}>
            <div>
              <SectionHeading color={getSelectedServiceColor()}>
                Résumé de votre demande
              </SectionHeading>
              <SectionDescription>
                Vérifiez que les informations suivantes sont correctes avant de confirmer.
              </SectionDescription>

              <div style={{
                backgroundColor: theme.light,
                padding: spacing.md,
                borderRadius: borderRadius.md,
                border: `1px solid ${theme.border}`,
                boxShadow: shadows.sm
              }}>
                <List bordered style={{ borderRadius: borderRadius.sm }}>
                  <List.Item>
                    <FlexboxGrid justify="start" align="middle">
                      <FlexboxGrid.Item colspan={6}>
                        <strong style={{ color: theme.dark }}>Service :</strong>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={18}>
                        <ServiceBadge color={getSelectedServiceColor()}>
                          <ServiceBadgeIcon color={getSelectedServiceColor()}>
                            {serviceIcons[selectedService]}
                          </ServiceBadgeIcon>
                          <ServiceBadgeName color={getSelectedServiceColor()}>
                            {getSelectedServiceName()}
                          </ServiceBadgeName>
                        </ServiceBadge>
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </List.Item>
                  <List.Item>
                    <FlexboxGrid justify="start">
                      <FlexboxGrid.Item colspan={6}>
                        <strong style={{ color: theme.dark }}>Nom :</strong>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={18}>
                        {userData.name}
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </List.Item>
                  <List.Item>
                    <FlexboxGrid justify="start">
                      <FlexboxGrid.Item colspan={6}>
                        <strong style={{ color: theme.dark }}>Téléphone :</strong>
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
                          <strong style={{ color: theme.dark }}>Email :</strong>
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
                  style={{ marginTop: spacing.md }}
                >
                  Après confirmation, un ticket sera généré et vous serez appelé(e) à votre tour.
                </Message>
              </div>

              <Stack
                spacing={10}
                direction="row"
                justifyContent="space-between"
                style={{ marginTop: spacing.xl }}
              >
                <Button
                  appearance="subtle"
                  onClick={handlePrevious}
                >
                  Modifier
                </Button>
                <Button
                  appearance="primary"
                  color="green"
                  onClick={handleNext}
                  style={{
                    backgroundColor: theme.success,
                    borderColor: theme.success
                  }}
                >
                  Confirmer
                </Button>
              </Stack>
            </div>
          </Fade>
        );

      case 3:
        return (
          <Fade in={true}>
            <TicketContainer>
              <TicketSuccessIcon>
                ✅
              </TicketSuccessIcon>
              <TicketTitle>
                Votre ticket est prêt !
              </TicketTitle>

              <TicketCard>
                <TicketLabel>
                  Votre numéro de ticket est :
                </TicketLabel>
                <TicketNumber>
                  {ticketNumber}
                </TicketNumber>
              </TicketCard>

              <p style={{ fontSize: typography.fontSizes.md, margin: `${spacing.md} 0`, color: theme.dark }}>
                Veuillez patienter, nous vous appellerons bientôt.
              </p>

              <WaitingTimeCard>
                <WaitingTimeText>
                  Temps d'attente estimé :
                  <WaitingTimeValue>
                    environ {waitTime} minutes
                  </WaitingTimeValue>
                </WaitingTimeText>
              </WaitingTimeCard>

              <Button
                appearance="primary"
                onClick={handleConfirm}
                style={{
                  marginTop: spacing.xl,
                  backgroundColor: theme.success,
                  borderColor: theme.success,
                  padding: '10px 20px',
                  fontSize: typography.fontSizes.md
                }}
              >
                Terminer
              </Button>
            </TicketContainer>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <WizardContainer isMobile={isMobile}>
      <WizardTitle isMobile={isMobile}>
        Bienvenue chez AFG Bank Côte d'Ivoire
      </WizardTitle>

      <WizardLayout isMobile={isMobile}>
        {/* Wizard Steps - Vertical pour écran large, Horizontal pour petit écran */}
        <StepsContainer isMobile={isMobile}>
          <Steps
            current={step}
            vertical={!isMobile} // Vertical pour ordinateur, horizontal pour mobile
            small={isExtraSmall} // Petite taille pour les très petits écrans
          >
            <Steps.Item
              title="Service"
              description={isMobile ? "" : "Choisissez votre service"}
              style={{ color: step === 0 ? getSelectedServiceColor() : undefined }}
            />
            <Steps.Item
              title="Infos"
              description={isMobile ? "" : "Vos coordonnées"}
              style={{ color: step === 1 ? getSelectedServiceColor() : undefined }}
            />
            <Steps.Item
              title="Résumé"
              description={isMobile ? "" : "Vérifiez vos informations"}
              style={{ color: step === 2 ? getSelectedServiceColor() : undefined }}
            />
            <Steps.Item
              title="Terminé"
              description={isMobile ? "" : "Récupérez votre ticket"}
              style={{ color: step === 3 ? getSelectedServiceColor() : undefined }}
            />
          </Steps>

          {/* Indicateur de progression pour les écrans mobiles */}
          {isMobile && (
            <StepIndicator>
              <StepNumber>
                Étape {step + 1} sur 4
              </StepNumber>
              <StepName color={getSelectedServiceColor()}>
                {step === 0 && 'Choisir un service'}
                {step === 1 && 'Renseigner les informations'}
                {step === 2 && 'Vérifier le résumé'}
                {step === 3 && 'Ticket généré'}
              </StepName>
            </StepIndicator>
          )}
        </StepsContainer>

        {/* Contenu principal */}
        <ContentContainer isMobile={isMobile}>
          <ContentPanel bordered isMobile={isMobile}>
            {renderStepContent()}
          </ContentPanel>
        </ContentContainer>
      </WizardLayout>

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
          <div style={{ textAlign: 'center', padding: `${spacing.md} 0` }}>
            <div style={{
              fontSize: '50px',
              marginBottom: spacing.md,
              color: theme.success
            }}>
              🎉
            </div>
            <p style={{ fontSize: typography.fontSizes.md }}>
              Votre demande a bien été enregistrée. Merci d'avoir utilisé notre service de tickets !
            </p>
            <p style={{
              fontSize: typography.fontSizes.sm,
              marginTop: spacing.sm,
              color: theme.gray,
              fontStyle: 'italic'
            }}>
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
    </WizardContainer>
  );
};

export default VerticalTicketWizard;