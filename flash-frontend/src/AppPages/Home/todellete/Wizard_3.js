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

// Palette de couleurs AFG Bank Côte d'Ivoire
const theme = {
  primary: '#002D62',      // Bleu royal foncé AFG Bank (principal)
  secondary: '#D4AF37',    // Or/ocre AFG Bank (ajusté pour plus d'éclat)
  primaryLight: '#E6EEF8', // Bleu AFG Bank très clair (pour arrière-plans)
  success: '#00874A',      // Vert foncé élégant
  warning: '#CB8A14',      // Orange plus sophistiqué
  danger: '#B2293A',       // Rouge élégant
  dark: '#0A1F33',         // Texte principal presque noir
  gray: '#4A5875',         // Bleu-gris pour texte secondaire
  light: '#F8FBFF',        // Fond clair légèrement bleuté
  border: '#D8E3F3',       // Bordures subtiles
  gold: '#D4AF37',         // Or AFG Bank pour accents luxueux
  goldLight: '#F7F2DE',    // Or très clair pour arrière-plans
};

// Utiliser des icônes pour les services
const serviceIcons = {
  information: "ℹ️",
  consultation: "📅",
  paiement: "💳",
  reclamation: "💬",
  livraison: "📦",
  reparation: "🔧"
};

// Styles globaux pour la typographie, les espacements et autres éléments de design
const globalStyles = {
  fontFamily: '"Poppins", "Helvetica Neue", sans-serif',
  headingFontFamily: '"Montserrat", "Helvetica Neue", sans-serif',
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  boxShadow: {
    sm: '0 2px 8px rgba(0, 45, 98, 0.06)',
    md: '0 4px 16px rgba(0, 45, 98, 0.08)',
    lg: '0 8px 24px rgba(0, 45, 98, 0.12)',
  },
  spacing: {
    xs: '5px',
    sm: '10px',
    md: '15px',
    lg: '20px',
    xl: '30px',
    xxl: '40px',
  },
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

  // Media queries pour le responsive design
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isExtraSmall = useMediaQuery('(max-width: 480px)');

  // Liste des services disponibles
  const services = [
    { id: 'information', name: 'Information', description: 'Renseignements généraux', color: theme.primary },
    { id: 'consultation', name: 'Consultation', description: 'Rencontrer un conseiller', color: theme.primary },
    { id: 'paiement', name: 'Paiement', description: 'Effectuer un paiement', color: theme.primary },
    { id: 'reclamation', name: 'Réclamation', description: 'Déposer une réclamation', color: theme.primary },
    { id: 'livraison', name: 'Livraison', description: 'Retrait de commande', color: theme.primary },
    { id: 'reparation', name: 'Réparation', description: 'Service après-vente', color: theme.primary }
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
      }, 3000);
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
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(1);
      }, 300);
    }, 500);
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
    }, 300);
  };

  const handlePrevious = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(step - 1);
    }, 300);
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

  // Rendu du header avec logo AFG Bank
  const renderHeader = () => (
    <div style={{
      textAlign: 'center',
      marginBottom: globalStyles.spacing.xl,
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img 
          src="https://afgbankcotedivoire.com/wp-content/themes/cdg/images/logo.png" 
          alt="AFG Bank Côte d'Ivoire" 
          style={{ 
            height: '60px', 
            marginBottom: globalStyles.spacing.md 
          }} 
        />
        <h1 style={{
          color: theme.primary,
          fontFamily: globalStyles.headingFontFamily,
          fontWeight: 700,
          fontSize: isMobile ? '24px' : '32px',
          marginBottom: globalStyles.spacing.sm,
        }}>
          Service de Gestion de File d'Attente
        </h1>
        <div style={{
          width: '80px',
          height: '4px',
          background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
          margin: '0 auto',
          marginBottom: globalStyles.spacing.md,
        }}></div>
        <p style={{
          color: theme.gray,
          fontFamily: globalStyles.fontFamily,
          fontSize: '16px',
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Bienvenue dans notre système de prise de ticket électronique. 
          Sélectionnez le service dont vous avez besoin et nous vous appellerons à votre tour.
        </p>
      </div>
    </div>
  );

  // Rendu du contenu en fonction de l'étape actuelle
  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '300px',
          color: theme.primary,
        }}>
          <Loader size="lg" content="Chargement..." vertical />
          <p style={{ 
            marginTop: globalStyles.spacing.lg, 
            color: theme.gray,
            fontStyle: 'italic'
          }}>
            Nous préparons l'étape suivante...
          </p>
        </div>
      );
    }

    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <div>
              <h3 style={{
                marginBottom: globalStyles.spacing.lg,
                color: theme.dark,
                fontFamily: globalStyles.headingFontFamily,
                fontWeight: 600,
                position: 'relative'
              }}>
                Sélectionnez le service souhaité
                <div style={{
                  height: '3px',
                  width: '50px',
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0
                }}></div>
              </h3>
              <p style={{ 
                marginBottom: globalStyles.spacing.xl, 
                color: theme.gray,
                fontFamily: globalStyles.fontFamily,
                lineHeight: 1.6,
              }}>
                Choisissez le service qui correspond à votre besoin pour commencer.
              </p>
              <Grid fluid>
                <Row gutter={isMobile ? 10 : 20}>
                  {services.map((service) => {
                    const isSelected = selectedService === service.id;
                    return (
                      <Col xs={24} sm={12} md={8} key={service.id} style={{ marginBottom: globalStyles.spacing.xl }}>
                        <div
                          onClick={() => !selectionDelay && handleServiceSelect(service.id)}
                          style={{
                            padding: globalStyles.spacing.xl,
                            borderRadius: globalStyles.borderRadius.lg,
                            border: `2px solid ${isSelected ? theme.secondary : theme.border}`,
                            cursor: selectionDelay ? 'default' : 'pointer',
                            transition: 'all 0.3s ease',
                            backgroundColor: isSelected ? theme.primaryLight : theme.light,
                            boxShadow: isSelected
                              ? globalStyles.boxShadow.md
                              : globalStyles.boxShadow.sm,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: isSelected ? 'translateY(-5px)' : 'translateY(0)',
                            position: 'relative',
                            overflow: 'hidden',
                            opacity: selectionDelay && !isSelected ? 0.5 : 1
                          }}
                          role="button"
                          aria-pressed={isSelected}
                          aria-label={`Service ${service.name}: ${service.description}`}
                        >
                          {isSelected && (
                            <>
                              <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: theme.secondary,
                                color: 'white',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              }}>✓</div>
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '5px',
                                height: '100%',
                                backgroundColor: theme.secondary,
                              }}></div>
                            </>
                          )}
                          <div
                            style={{
                              fontSize: '48px',
                              marginBottom: globalStyles.spacing.lg,
                              color: isSelected ? theme.secondary : theme.primary,
                              transition: 'all 0.3s',
                              transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                            }}
                          >
                            {serviceIcons[service.id]}
                          </div>
                          <h4 style={{
                            margin: `${globalStyles.spacing.md} 0 ${globalStyles.spacing.sm}`,
                            textAlign: 'center',
                            color: isSelected ? theme.secondary : theme.primary,
                            fontFamily: globalStyles.headingFontFamily,
                            fontWeight: isSelected ? 600 : 500,
                            fontSize: '18px',
                          }}>{service.name}</h4>
                          <p style={{
                            margin: 0,
                            textAlign: 'center',
                            color: theme.gray,
                            fontFamily: globalStyles.fontFamily,
                            fontSize: '14px'
                          }}>{service.description}</p>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Grid>

              {selectedService && !selectionDelay && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: globalStyles.spacing.xl
                }}>
                  <Button
                    appearance="primary"
                    onClick={handleNext}
                    style={{
                      backgroundColor: theme.primary,
                      borderColor: theme.primary,
                      fontFamily: globalStyles.fontFamily,
                      padding: '10px 25px',
                      borderRadius: globalStyles.borderRadius.md,
                      fontWeight: 500,
                      boxShadow: globalStyles.boxShadow.sm,
                      transition: 'all 0.3s ease',
                    }}
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
              <h3 style={{
                marginBottom: globalStyles.spacing.lg,
                color: theme.dark,
                fontFamily: globalStyles.headingFontFamily,
                fontWeight: 600,
                position: 'relative'
              }}>
                Vos informations
                <div style={{
                  height: '3px',
                  width: '50px',
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0
                }}></div>
              </h3>
              <p style={{ 
                marginBottom: globalStyles.spacing.xl, 
                color: theme.gray,
                fontFamily: globalStyles.fontFamily,
                lineHeight: 1.6,
              }}>
                Veuillez renseigner vos coordonnées pour que nous puissions vous appeler.
              </p>

              <Form fluid>
                <Form.Group>
                  <Form.ControlLabel style={{ 
                    fontFamily: globalStyles.fontFamily,
                    color: theme.dark,
                    fontWeight: 500,
                  }}>
                    Nom complet*
                  </Form.ControlLabel>
                  <Form.Control
                    name="name"
                    value={userData.name}
                    onChange={(value) => handleUserDataChange(value, 'name')}
                    placeholder="Entrez votre nom et prénom"
                    errorMessage={validationErrors.name}
                    error={!!validationErrors.name}
                    style={{
                      borderRadius: globalStyles.borderRadius.md,
                      fontFamily: globalStyles.fontFamily,
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel style={{ 
                    fontFamily: globalStyles.fontFamily,
                    color: theme.dark,
                    fontWeight: 500,
                  }}>
                    Téléphone*
                  </Form.ControlLabel>
                  <Form.Control
                    name="phone"
                    value={userData.phone}
                    onChange={(value) => handleUserDataChange(value, 'phone')}
                    placeholder="Ex: 0612345678"
                    errorMessage={validationErrors.phone}
                    error={!!validationErrors.phone}
                    style={{
                      borderRadius: globalStyles.borderRadius.md,
                      fontFamily: globalStyles.fontFamily,
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.ControlLabel style={{ 
                    fontFamily: globalStyles.fontFamily,
                    color: theme.dark,
                    fontWeight: 500,
                  }}>
                    Email (optionnel)
                  </Form.ControlLabel>
                  <Form.Control
                    name="email"
                    type="email"
                    value={userData.email}
                    onChange={(value) => handleUserDataChange(value, 'email')}
                    placeholder="votre@email.com"
                    errorMessage={validationErrors.email}
                    error={!!validationErrors.email}
                    style={{
                      borderRadius: globalStyles.borderRadius.md,
                      fontFamily: globalStyles.fontFamily,
                    }}
                  />
                  <Form.HelpText style={{ 
                    fontFamily: globalStyles.fontFamily,
                    color: theme.gray,
                  }}>
                    Nous vous enverrons une confirmation par email
                  </Form.HelpText>
                </Form.Group>

                <Message
                  showIcon
                  type="info"
                  style={{ 
                    marginTop: globalStyles.spacing.xl,
                    borderRadius: globalStyles.borderRadius.md,
                    fontFamily: globalStyles.fontFamily,
                  }}
                >
                  Les champs marqués d'un * sont obligatoires
                </Message>
              </Form>

              <Stack
                spacing={10}
                direction="row"
                justifyContent="space-between"
                style={{ marginTop: globalStyles.spacing.xl }}
              >
                <Button
                  appearance="subtle"
                  onClick={handlePrevious}
                  style={{
                    fontFamily: globalStyles.fontFamily,
                    color: theme.gray,
                    borderRadius: globalStyles.borderRadius.md,
                  }}
                >
                  Retour
                </Button>
                <Button
                  appearance="primary"
                  onClick={handleNext}
                  disabled={!validateUserData()}
                  style={{
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    fontFamily: globalStyles.fontFamily,
                    padding: '10px 25px',
                    borderRadius: globalStyles.borderRadius.md,
                    fontWeight: 500,
                    boxShadow: globalStyles.boxShadow.sm,
                    transition: 'all 0.3s ease',
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
              <h3 style={{
                marginBottom: globalStyles.spacing.lg,
                color: theme.dark,
                fontFamily: globalStyles.headingFontFamily,
                fontWeight: 600,
                position: 'relative'
              }}>
                Résumé de votre demande
                <div style={{
                  height: '3px',
                  width: '50px',
                  background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0
                }}></div>
              </h3>
              <p style={{ 
                marginBottom: globalStyles.spacing.xl, 
                color: theme.gray,
                fontFamily: globalStyles.fontFamily,
                lineHeight: 1.6,
              }}>
                Vérifiez que les informations suivantes sont correctes avant de confirmer.
              </p>

              <div style={{
                backgroundColor: theme.light,
                padding: globalStyles.spacing.xl,
                borderRadius: globalStyles.borderRadius.lg,
                border: `1px solid ${theme.border}`,
                boxShadow: globalStyles.boxShadow.sm
              }}>
                <List bordered style={{ 
                  borderRadius: globalStyles.borderRadius.md,
                  fontFamily: globalStyles.fontFamily,
                }}>
                  <List.Item>
                    <FlexboxGrid justify="start" align="middle">
                      <FlexboxGrid.Item colspan={6}>
                        <strong style={{ 
                          color: theme.dark,
                          fontFamily: globalStyles.fontFamily,
                          fontWeight: 600,
                        }}>Service :</strong>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={18}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: theme.primaryLight,
                          padding: `${globalStyles.spacing.md} ${globalStyles.spacing.lg}`,
                          borderRadius: globalStyles.borderRadius.md,
                          width: 'fit-content',
                          border: `1px solid ${theme.primary}20`,
                        }}>
                          <span
                            style={{
                              marginRight: globalStyles.spacing.md,
                              color: theme.primary,
                              fontSize: '18px'
                            }}
                          >
                            {serviceIcons[selectedService]}
                          </span>
                          <span style={{ 
                            fontWeight: 600, 
                            color: theme.primary,
                            fontFamily: globalStyles.fontFamily,
                          }}>
                            {getSelectedServiceName()}
                          </span>
                        </div>
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </List.Item>
                  <List.Item>
                    <FlexboxGrid justify="start">
                      <FlexboxGrid.Item colspan={6}>
                        <strong style={{ 
                          color: theme.dark,
                          fontFamily: globalStyles.fontFamily,
                          fontWeight: 600,
                        }}>Nom :</strong>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={18} style={{ fontFamily: globalStyles.fontFamily }}>
                        {userData.name}
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </List.Item>
                  <List.Item>
                    <FlexboxGrid justify="start">
                      <FlexboxGrid.Item colspan={6}>
                        <strong style={{ 
                          color: theme.dark,
                          fontFamily: globalStyles.fontFamily,
                          fontWeight: 600,
                        }}>Téléphone :</strong>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={18} style={{ fontFamily: globalStyles.fontFamily }}>
                        {userData.phone}
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </List.Item>
                  {userData.email && (
                    <List.Item>
                      <FlexboxGrid justify="start">
                        <FlexboxGrid.Item colspan={6}>
                          <strong style={{ 
                            color: theme.dark,
                            fontFamily: globalStyles.fontFamily,
                            fontWeight: 600,
                          }}>Email :</strong>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={18} style={{ fontFamily: globalStyles.fontFamily }}>
                          {userData.email}
                        </FlexboxGrid.Item>
                      </FlexboxGrid>
                    </List.Item>
                  )}
                </List>

                <Message
                  showIcon
                  type="warning"
                  style={{ 
                    marginTop: globalStyles.spacing.xl,
                    borderRadius: globalStyles.borderRadius.md,
                    fontFamily: globalStyles.fontFamily,
                  }}
                >
                  Après confirmation, un ticket sera généré et vous serez appelé(e) à votre tour.
                </Message>
              </div>

              <Stack
                spacing={10}
                direction="row"
                justifyContent="space-between"
                style={{ marginTop: globalStyles.spacing.xl }}
              >
                <Button
                  appearance="subtle"
                  onClick={handlePrevious}
                  style={{
                    fontFamily: globalStyles.fontFamily,
                    color: theme.gray,
                    borderRadius: globalStyles.borderRadius.md,
                  }}
                >
                  Modifier
                </Button>
                <Button
                  appearance="primary"
                  onClick={handleNext}
                  style={{
                    backgroundColor: theme.secondary,
                    borderColor: theme.secondary,
                    fontFamily: globalStyles.fontFamily,
                    padding: '10px 30px',
                    borderRadius: globalStyles.borderRadius.md,
                    fontWeight: 600,
                    boxShadow: globalStyles.boxShadow.sm,
                    transition: 'all 0.3s ease',
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
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: `${theme.success}15`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: '0 auto',
                  marginBottom: globalStyles.spacing.xl,
                  fontSize: '50px',
                  color: theme.success,
                  boxShadow: '0 10px 20px rgba(0,135,74,0.2)',
                }}
              >
                ✓
              </div>
              <h3 style={{
                color: theme.dark,
                marginBottom: globalStyles.spacing.lg,
                fontFamily: globalStyles.headingFontFamily,
                fontWeight: 700,
                fontSize: '24px',
              }}>
                Votre ticket est prêt !
              </h3>

              <div style={{
                backgroundColor: theme.goldLight,
                borderRadius: globalStyles.borderRadius.lg,
                padding: globalStyles.spacing.xl,
                margin: `${globalStyles.spacing.xl} auto`,
                maxWidth: '350px',
                border: `2px dashed ${theme.gold}`,
                boxShadow: globalStyles.boxShadow.sm,
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '120px',
                  height: '120px',
                  backgroundColor: theme.gold,
                  opacity: 0.1,
                  borderRadius: '50%',
                  zIndex: 0,
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '-15px',
                  left: '-15px',
                  width: '80px',
                  height: '80px',
                  backgroundColor: theme.gold,
                  opacity: 0.1,
                  borderRadius: '50%',
                  zIndex: 0,
                }}></div>
                <p style={{ 
                  fontSize: '16px', 
                  margin: '0 0 15px 0', 
                  color: theme.dark,
                  fontFamily: globalStyles.fontFamily,
                  position: 'relative',
                  zIndex: 2,
                }}>
                  Votre numéro de ticket est :
                </p>
                <span style={{
                  fontSize: '38px',
                  fontWeight: 'bold',
                  color: theme.gold,
                  letterSpacing: '1px',
                  display: 'block',
                  margin: '15px 0',
                  fontFamily: globalStyles.headingFontFamily,
                  position: 'relative',
                  zIndex: 2,
                }}>
                  {ticketNumber}
                </span>
                <div style={{
                  width: '60%',
                  height: '1px',
                  background: `${theme.gold}40`,
                  margin: '15px auto',
                }}></div>
                <p style={{ 
                  fontSize: '14px', 
                  margin: '10px 0 0 0', 
                  color: theme.gray,
                  fontFamily: globalStyles.fontFamily,
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 2,
                }}>
                  {new Date().toLocaleString('fr-FR')}
                </p>
              </div>

              <p style={{ 
                fontSize: '16px', 
                margin: `${globalStyles.spacing.xl} 0`, 
                color: theme.dark,
                fontFamily: globalStyles.fontFamily,
                lineHeight: 1.6,
              }}>
                Veuillez patienter, nous vous appellerons bientôt.
              </p>

              <div style={{
                backgroundColor: theme.primaryLight,
                borderRadius: globalStyles.borderRadius.md,
                padding: globalStyles.spacing.lg,
                margin: `${globalStyles.spacing.xl} auto`,
                maxWidth: '80%',
                border: `1px solid ${theme.primary}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: globalStyles.spacing.md,
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: theme.primary,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff',
                  fontSize: '18px',
                }}>
                  ⏱️
                </div>
                <div>
                  <p style={{ 
                    color: theme.dark, 
                    margin: 0,
                    fontFamily: globalStyles.fontFamily,
                    fontWeight: 500,
                  }}>
                    Temps d'attente estimé :
                    <strong style={{ 
                      color: theme.primary, 
                      marginLeft: '5px',
                      fontFamily: globalStyles.fontFamily,
                      fontWeight: 700,
                    }}>
                      environ {waitTime} minutes
                    </strong>
                  </p>
                </div>
              </div>

              <Button
                appearance="primary"
                onClick={handleConfirm}
                style={{
                  marginTop: globalStyles.spacing.xl,
                  backgroundColor: theme.success,
                  borderColor: theme.success,
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontFamily: globalStyles.fontFamily,
                  fontWeight: 600,
                  borderRadius: globalStyles.borderRadius.md,
                  boxShadow: globalStyles.boxShadow.md,
                  transition: 'all 0.3s ease',
                }}
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
    <div
      className="ticket-wizard-container"
      style={{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: isMobile ? '15px' : '30px',
        fontFamily: globalStyles.fontFamily,
        backgroundColor: '#fff',
        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
        borderRadius: globalStyles.borderRadius.xl,
      }}
    >
      {renderHeader()}

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%'
      }}>
        {/* Wizard Steps - Vertical pour écran large, Horizontal pour petit écran */}
        <div style={{
          width: isMobile ? '100%' : '25%',
          marginRight: isMobile ? 0 : '30px',
          marginBottom: isMobile ? '20px' : 0,
          padding: isMobile ? 0 : '0 10px',
        }}>
          <div
            style={{
              backgroundColor: theme.light,
              padding: globalStyles.spacing.md,
              borderRadius: globalStyles.borderRadius.lg,
              boxShadow: globalStyles.boxShadow.sm,
              border: `1px solid ${theme.border}`,
            }}
          >
            <Steps
              current={step}
              vertical={!isMobile}
              small={isExtraSmall}
              style={{
                fontFamily: globalStyles.fontFamily,
              }}
            >
              <Steps.Item
                title="Service"
                description={isMobile ? "" : "Choisissez votre service"}
                style={{ 
                  color: step === 0 ? theme.primary : undefined,
                  fontFamily: globalStyles.fontFamily,
                }}
              />
              <Steps.Item
                title="Infos"
                description={isMobile ? "" : "Vos coordonnées"}
                style={{ 
                  color: step === 1 ? theme.primary : undefined,
                  fontFamily: globalStyles.fontFamily,
                }}
              />
              <Steps.Item
                title="Résumé"
                description={isMobile ? "" : "Vérifiez vos informations"}
                style={{ 
                  color: step === 2 ? theme.primary : undefined,
                  fontFamily: globalStyles.fontFamily,
                }}
              />
              <Steps.Item
                title="Terminé"
                description={isMobile ? "" : "Récupérez votre ticket"}
                style={{ 
                  color: step === 3 ? theme.primary : undefined,
                  fontFamily: globalStyles.fontFamily,
                }}
              />
            </Steps>
          </div>

          {/* Indicateur de progression pour les écrans mobiles */}
          {isMobile && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '15px 0 20px',
              padding: '0 10px',
              fontFamily: globalStyles.fontFamily,
            }}>
              <span style={{ 
                color: theme.gray, 
                fontSize: '14px',
                fontFamily: globalStyles.fontFamily,
              }}>
                Étape {step + 1} sur 4
              </span>
              <span style={{
                color: theme.primary,
                fontWeight: 500,
                fontSize: '14px',
                fontFamily: globalStyles.fontFamily,
              }}>
                {step === 0 && 'Choisir un service'}
                {step === 1 && 'Renseigner les informations'}
                {step === 2 && 'Vérifier le résumé'}
                {step === 3 && 'Ticket généré'}
              </span>
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div style={{ width: isMobile ? '100%' : '75%' }}>
          <Panel
            bordered
            style={{
              padding: isMobile ? '20px' : '30px',
              borderRadius: globalStyles.borderRadius.xl,
              boxShadow: globalStyles.boxShadow.md,
              minHeight: '450px',
              border: `1px solid ${theme.border}`,
              backgroundColor: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '6px',
              background: `linear-gradient(to right, ${theme.primary}, ${theme.secondary})`,
            }}></div>
            {renderStepContent()}
          </Panel>
        </div>
      </div>

      {/* Modal de confirmation */}
      <Modal
        open={showSuccess}
        onClose={handleReset}
        size="xs"
        style={{
          fontFamily: globalStyles.fontFamily,
        }}
      >
        <Modal.Header>
          <Modal.Title style={{
            fontFamily: globalStyles.headingFontFamily,
            fontWeight: 600,
            color: theme.dark,
          }}>
            Merci pour votre visite
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: `${theme.success}15`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto',
              marginBottom: globalStyles.spacing.lg,
              fontSize: '40px',
              color: theme.success,
            }}>
              🎉
            </div>
            <p style={{ 
              fontSize: '16px',
              fontFamily: globalStyles.fontFamily,
              lineHeight: 1.6,
            }}>
              Votre demande a bien été enregistrée. Merci d'avoir utilisé notre service de tickets !
            </p>
            <p style={{
              fontSize: '14px',
              marginTop: globalStyles.spacing.lg,
              color: theme.gray,
              fontStyle: 'italic',
              fontFamily: globalStyles.fontFamily,
            }}>
              Redirection automatique dans 3 secondes...
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            appearance="primary" 
            onClick={handleReset} 
            block
            style={{
              backgroundColor: theme.primary,
              borderColor: theme.primary,
              fontFamily: globalStyles.fontFamily,
              padding: '10px 15px',
              borderRadius: globalStyles.borderRadius.md,
              fontWeight: 500,
              boxShadow: globalStyles.boxShadow.sm,
              transition: 'all 0.3s ease',
            }}
          >
            Nouveau ticket
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VerticalTicketWizard;