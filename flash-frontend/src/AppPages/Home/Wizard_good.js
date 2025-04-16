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
import ThemeSwitcher from './ThemeSwitcher';


// Palette de couleurs personnalisée pour une meilleure cohérence visuelle
const theme = {
  primary: '#0a2557',     // Bleu foncé AFG Bank (principal)
  secondary: '#cc9933',   // Or/ocre AFG Bank
  primaryLight: '#e6eaf2', // Bleu AFG Bank très clair (pour arrière-plans)
  success: '#00874a',     // Vert foncé élégant
  warning: '#cb8a14',     // Orange plus sophistiqué
  danger: '#b2293a',      // Rouge élégant
  dark: '#1a1a2e',        // Texte principal presque noir
  gray: '#5a6685',        // Bleu-gris pour texte secondaire
  light: '#f8f9fc',       // Fond clair légèrement bleuté
  border: '#d8dee9',      // Bordures subtiles
  gold: '#cc9933',        // Or AFG Bank pour accents luxueux
  goldLight: '#f0e6cc',   // Or très clair pour arrière-plans
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

  const [currentTime, setCurrentTime] = useState('');

  // Ajoutez cet état avec vos autres états
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Ajoutez cette fonction pour gérer le plein écran
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Passage en plein écran
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erreur lors du passage en plein écran: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      // Sortie du plein écran
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Ajoutez cet effet pour mettre à jour l'état lorsque l'utilisateur utilise Échap
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    // Générer un numéro de ticket aléatoire mais consistant
    setTicketNumber(`AFG-${Math.floor(Math.random() * 1000)}`);

    // Mettre à jour l'heure actuelle
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Mise à jour chaque minute

    return () => clearInterval(interval);
  }, []);

  // Ajoutez cette fonction pour obtenir le nom de l'opération sélectionnée
  const getSelectedOperationName = () => {
    const operation = operations.find(o => o.id === selectedOperation);
    return operation ? operation.name : '';
  };

  // Ajoutez cette fonction pour obtenir la couleur de l'opération sélectionnée
  const getSelectedOperationColor = () => {
    const operation = operations.find(o => o.id === selectedOperation);
    return operation ? operation.color : theme.primary;
  };

  // Media queries pour le responsive design
  // On définit mobile comme étant les écrans de moins de 768px (tablettes et téléphones)
  const isMobile = useMediaQuery('(max-width: 767px)');
  // Très petits écrans (téléphones)
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

  // Ajoutez cette liste d'opérations après la liste des services
  const operations = [
    { id: 'depot', name: 'Dépôt', description: 'Faire un dépôt d\'argent', color: '#3498db' },
    { id: 'retrait', name: 'Retrait', description: 'Effectuer un retrait', color: '#9b59b6' },
    { id: 'virement', name: 'Virement', description: 'Réaliser un virement', color: '#2ecc71' },
    { id: 'change', name: 'Change', description: 'Service de change', color: '#e74c3c' },
    { id: 'credit', name: 'Crédit', description: 'Demander un crédit', color: '#f39c12' },
    { id: 'conseil', name: 'Conseil', description: 'Obtenir un conseil', color: '#1abc9c' }
  ];

  // Ajoutez ces états pour gérer la sélection d'opération
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [operationDelay, setOperationDelay] = useState(false);

  // Ajoutez cette fonction pour gérer la sélection d'opération
  const handleOperationSelect = (operationId) => {
    setSelectedOperation(operationId);
    setOperationDelay(true);

    // Attendre 2 secondes pour que l'utilisateur voie son choix
    setTimeout(() => {
      setOperationDelay(false);
      // Puis afficher le loader pour 100ms
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 100);
    }, 700);
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

    // Attendre 2 secondes pour que l'utilisateur voie son choix
    setTimeout(() => {
      setSelectionDelay(false);
      // Puis afficher le loader pour 400ms
      //   setIsLoading(true);
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
              <h3 style={{
                marginBottom: '20px',
                color: theme.dark,
                fontWeight: 600,
                position: 'relative'
              }}>
                Sélectionnez le service souhaité
                <div style={{
                  height: '3px',
                  width: '50px',
                  background: theme.primary,
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0
                }}></div>
              </h3>
              <p style={{ marginBottom: '20px', color: theme.gray }}>
                Choisissez le service qui correspond à votre besoin pour commencer.
              </p>
              <Grid fluid>
                <Row gutter={isMobile ? 10 : 20}>
                  {services.map((service) => {
                    const isSelected = selectedService === service.id;
                    return (
                      <Col xs={24} sm={12} md={8} key={service.id} style={{ marginBottom: '20px' }}>
                        <div
                          onClick={() => !selectionDelay && handleServiceSelect(service.id)}
                          style={{
                            padding: '20px',
                            borderRadius: '12px',
                            border: `2px solid ${isSelected ? service.color : theme.border}`,
                            cursor: selectionDelay ? 'default' : 'pointer',
                            transition: 'all 0.25s ease',
                            backgroundColor: isSelected ? `${service.color}15` : theme.light,
                            boxShadow: isSelected
                              ? `0 8px 16px rgba(0, 0, 0, 0.1)`
                              : '0 2px 6px rgba(0, 0, 0, 0.05)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: isSelected ? 'translateY(-3px)' : 'translateY(0)',
                            position: 'relative',
                            overflow: 'hidden',
                            opacity: selectionDelay && !isSelected ? 0.5 : 1
                          }}
                          role="button"
                          aria-pressed={isSelected}
                          aria-label={`Service ${service.name}: ${service.description}`}
                        >
                          {isSelected && (
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              backgroundColor: service.color,
                              color: 'white',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>✓</div>
                          )}
                          <div
                            style={{
                              fontSize: '32px',
                              marginBottom: '15px',
                              color: selectedService === service.id ? theme.secondaryColor : theme.primaryColor,
                              backgroundColor: selectedService === service.id ? 'rgba(214, 153, 41, 0.1)' : 'rgba(26, 54, 93, 0.1)',
                              width: '70px',
                              height: '70px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '50%',
                              transition: 'all 0.3s'
                            }}
                          >
                            {serviceIcons[service.id]}
                          </div>
                          <h4 style={{
                            margin: '10px 0 5px',
                            textAlign: 'center',
                            color: isSelected ? service.color : theme.dark,
                            fontWeight: isSelected ? 600 : 500
                          }}>{service.name}</h4>
                          <p style={{
                            margin: 0,
                            textAlign: 'center',
                            color: theme.gray,
                            fontSize: '14px'
                          }}>{service.description}</p>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Grid>

              {selectedService && selectionDelay && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '30px'
                }}>
                  {/* <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    backgroundColor: `${getSelectedServiceColor()}15`,
                    padding: '10px 15px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    <Loader size="sm" content="Préparation en cours..." />
                  </div> */}
                </div>
              )}

              {selectedService && !selectionDelay && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '20px'
                }}>
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
          </Fade>
        );

      case 1:
        return (
          <Fade in={true}>
            <div>
              <h3 style={{
                marginBottom: '20px',
                color: theme.dark,
                fontWeight: 600,
                position: 'relative'
              }}>
                Sélectionnez le type d'opération
                <div style={{
                  height: '3px',
                  width: '50px',
                  background: theme.primary,
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0
                }}></div>
              </h3>
              <p style={{ marginBottom: '20px', color: theme.gray }}>
                Choisissez l'opération que vous souhaitez effectuer.
              </p>

              <div style={{
                padding: '15px',
                backgroundColor: 'rgba(26, 54, 93, 0.05)',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  marginRight: '15px',
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(26, 54, 93, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.primaryColor,
                  fontSize: '20px'
                }}>
                  {serviceIcons[selectedService]}
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: theme.textSecondary }}>Service sélectionné :</div>
                  <div style={{ fontWeight: '600', color: theme.primaryColor }}>{getSelectedServiceName()}</div>
                </div>
              </div>

              <Grid fluid>
                <Row gutter={isMobile ? 10 : 20}>
                  {operations.map((operation) => {
                    const isSelected = selectedOperation === operation.id;
                    return (
                      <Col xs={24} sm={12} md={8} key={operation.id} style={{ marginBottom: '20px' }}>
                        <div
                          onClick={() => !operationDelay && handleOperationSelect(operation.id)}
                          style={{
                            padding: '20px',
                            borderRadius: '12px',
                            border: `2px solid ${isSelected ? operation.color : theme.border}`,
                            cursor: operationDelay ? 'default' : 'pointer',
                            transition: 'all 0.25s ease',
                            backgroundColor: isSelected ? `${operation.color}15` : theme.light,
                            boxShadow: isSelected
                              ? `0 8px 16px rgba(0, 0, 0, 0.1)`
                              : '0 2px 6px rgba(0, 0, 0, 0.05)',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: isSelected ? 'translateY(-3px)' : 'translateY(0)',
                            position: 'relative',
                            overflow: 'hidden',
                            opacity: operationDelay && !isSelected ? 0.5 : 1
                          }}
                          role="button"
                          aria-pressed={isSelected}
                          aria-label={`Opération ${operation.name}: ${operation.description}`}
                        >
                          {isSelected && (
                            <div style={{
                              position: 'absolute',
                              top: '10px',
                              right: '10px',
                              backgroundColor: operation.color,
                              color: 'white',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}>✓</div>
                          )}
                          <div
                            style={{
                              fontSize: '32px',
                              marginBottom: '15px',
                              color: selectedOperation === operation.id ? theme.secondaryColor : theme.primaryColor,
                              backgroundColor: selectedOperation === operation.id ? 'rgba(214, 153, 41, 0.1)' : 'rgba(26, 54, 93, 0.1)',
                              width: '70px',
                              height: '70px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '50%',
                              transition: 'all 0.3s'
                            }}
                          >
                            {operation.id.charAt(0).toUpperCase()}
                          </div>
                          <h4 style={{
                            margin: '10px 0 5px',
                            textAlign: 'center',
                            color: isSelected ? operation.color : theme.dark,
                            fontWeight: isSelected ? 600 : 500
                          }}>{operation.name}</h4>
                          <p style={{
                            margin: 0,
                            textAlign: 'center',
                            color: theme.gray,
                            fontSize: '14px'
                          }}>{operation.description}</p>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Grid>

              {selectedOperation && operationDelay && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '30px'
                }}>
                  {/* Animation pendant la sélection si nécessaire */}
                </div>
              )}

              <Stack
                spacing={10}
                direction="row"
                justifyContent="space-between"
                style={{ marginTop: '30px' }}
              >
                <Button
                  appearance="subtle"
                  onClick={handlePrevious}
                >
                  Retour
                </Button>

                {selectedOperation && !operationDelay && (
                  <Button
                    appearance="primary"
                    onClick={handleNext}
                    style={{
                      backgroundColor: theme.primary,
                      borderColor: theme.primary
                    }}
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
              <h3 style={{
                marginBottom: '20px',
                color: theme.dark,
                fontWeight: 600,
                position: 'relative'
              }}>
                Vos informations
                <div style={{
                  height: '3px',
                  width: '50px',
                  background: getSelectedServiceColor(),
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0
                }}></div>
              </h3>
              <p style={{ marginBottom: '20px', color: theme.gray }}>
                Veuillez renseigner vos coordonnées pour que nous puissions vous appeler.
              </p>


              <div style={{
                padding: '15px',
                backgroundColor: 'rgba(26, 54, 93, 0.05)',
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{
                  marginRight: '15px',
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'rgba(26, 54, 93, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.primaryColor,
                  fontSize: '20px'
                }}>
                  {serviceIcons[selectedService]}
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: theme.textSecondary }}>Service sélectionné :</div>
                  <div style={{ fontWeight: '600', color: theme.primaryColor }}>{getSelectedServiceName()}</div>
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

              <Stack
                spacing={10}
                direction="row"
                justifyContent="space-between"
                style={{ marginTop: '30px' }}
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

      case 3:
        return (
          <Fade in={true}>
            <div>
              <h3 style={{
                marginBottom: '20px',
                color: theme.dark,
                fontWeight: 600,
                position: 'relative'
              }}>
                Résumé de votre demande
                <div style={{
                  height: '3px',
                  width: '50px',
                  background: getSelectedServiceColor(),
                  position: 'absolute',
                  bottom: '-8px',
                  left: 0
                }}></div>
              </h3>
              <p style={{ marginBottom: '20px', color: theme.gray }}>
                Vérifiez que les informations suivantes sont correctes avant de confirmer.
              </p>

              <div style={{
                backgroundColor: theme.light,
                padding: '20px',
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <List bordered style={{ borderRadius: '8px' }}>
                  <List.Item>
                    <FlexboxGrid justify="start" align="middle">
                      <FlexboxGrid.Item colspan={6}>
                        <strong style={{ color: theme.dark }}>Service :</strong>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={18}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: `${getSelectedServiceColor()}15`,
                          padding: '8px 12px',
                          borderRadius: '6px',
                          width: 'fit-content'
                        }}>
                          <span
                            style={{
                              marginRight: '10px',
                              color: getSelectedServiceColor(),
                              fontSize: '18px'
                            }}
                          >
                            {serviceIcons[selectedService]}
                          </span>
                          <span style={{ fontWeight: 500, color: getSelectedServiceColor() }}>
                            {getSelectedServiceName()}
                          </span>
                        </div>
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </List.Item>
                  <List.Item>
                    <FlexboxGrid justify="start" align="middle">
                      <FlexboxGrid.Item colspan={6}>
                        <strong style={{ color: theme.dark }}>Opération :</strong>
                      </FlexboxGrid.Item>
                      <FlexboxGrid.Item colspan={18}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: `${getSelectedOperationColor()}15`,
                          padding: '8px 12px',
                          borderRadius: '6px',
                          width: 'fit-content'
                        }}>
                          <span
                            style={{
                              marginRight: '10px',
                              color: getSelectedOperationColor(),
                              fontSize: '18px'
                            }}
                          >
                            {selectedOperation.charAt(0).toUpperCase()}
                          </span>
                          <span style={{ fontWeight: 500, color: getSelectedOperationColor() }}>
                            {getSelectedOperationName()}
                          </span>
                        </div>
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
                  style={{ marginTop: '20px' }}
                >
                  Après confirmation, un ticket sera généré et vous serez appelé(e) à votre tour.
                </Message>
              </div>

              <Stack
                spacing={10}
                direction="row"
                justifyContent="space-between"
                style={{ marginTop: '30px' }}
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

      case 4:
        return (
          <Fade in={true}>
            <div style={{ textAlign: 'center' }}>

              <div
                style={{
                  width: '110px',
                  height: '110px',
                  backgroundColor: 'rgba(45, 138, 89, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 25px auto'
                }}
              >
                <div
                  style={{
                    color: theme.success,
                    fontSize: '40px',
                  }}
                >
                  ✅
                </div>
              </div>

              <h3 style={{
                color: theme.primaryColor,
                fontWeight: '600',
                fontSize: '1.8rem',
                marginBottom: '15px'
              }}>
                Votre ticket est prêt !
              </h3>

              <div style={{
                border: `2px dashed ${theme.primaryColor}`,
                borderRadius: '12px',
                padding: '25px',
                margin: '30px auto',
                maxWidth: '400px',
                backgroundColor: 'rgba(26, 54, 93, 0.02)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: theme.white,
                  padding: '0 15px',
                  fontSize: '14px',
                  color: theme.textSecondary
                }}>
                  VOTRE NUMÉRO
                </div>

                <div style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  color: theme.secondaryColor,
                  textAlign: 'center',
                  marginBottom: '10px',
                  letterSpacing: '1px'
                }}>
                  {ticketNumber}
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderTop: `1px solid ${theme.gray}`,
                  borderBottom: `1px solid ${theme.gray}`,
                  margin: '15px 0',
                  color: theme.primaryColor
                }}>
                  <div>Service</div>
                  <div style={{ fontWeight: '600' }}>{getSelectedServiceName()}</div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: `1px solid ${theme.gray}`,
                  color: theme.primaryColor
                }}>
                  <div>Opération</div>
                  <div style={{ fontWeight: '600' }}>{getSelectedOperationName()}</div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  color: theme.primaryColor
                }}>
                  <div>Client</div>
                  <div style={{ fontWeight: '600' }}>{userData.name}</div>
                </div>
              </div>

              <p style={{
                fontSize: '16px',
                color: theme.textSecondary,
                marginBottom: '30px'
              }}>
                Veuillez patienter, nous vous appellerons bientôt.
              </p>

              <Button
                appearance="primary"
                onClick={handleConfirm}
                style={{
                  marginTop: '30px',
                  backgroundColor: theme.success,
                  borderColor: theme.success,
                  padding: '10px 20px',
                  fontSize: '16px'
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
        padding: isMobile ? '10px' : '20px'
      }}
    >
      {/* Barre de navigation stylisée */}
      <div style={{
        backgroundColor: theme.primaryColor,
        padding: '15px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="https://afgbankcotedivoire.com/wp-content/themes/cdg/images/logo.png"
              alt="AFG Bank Logo"
              style={{ height: '40px', marginRight: '15px' }}
            />
          </div>
          <div style={{
            color: theme.white,
            display: 'flex',
            alignItems: 'center'
          }}>
            <ThemeSwitcher />

            <div style={{ marginRight: '20px' }}>
              <small style={{ opacity: 0.8 }}>Heure actuelle</small>
              <div style={{ fontWeight: 'bold' }}>{currentTime}</div>
            </div>

            {/* Bouton de plein écran */}
            <div
              onClick={toggleFullScreen}
              style={{
                cursor: 'pointer',
                marginRight: '15px',
                padding: '6px',
                borderRadius: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={isFullScreen ? "Quitter le plein écran" : "Plein écran"}
            >
              {isFullScreen ? (
                <span style={{ fontSize: '20px' }}>⛶</span>
              ) : (
                <span style={{ fontSize: '20px' }}>⛶</span>
              )}
            </div>

            <div style={{
              backgroundColor: theme.secondaryColor,
              padding: '8px 15px',
              borderRadius: '5px',
              fontWeight: '500'
            }}>
              Espace Client
            </div>
          </div>
        </div>
      </div>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: theme.primary,
        fontWeight: 700,
        fontSize: isMobile ? '24px' : '32px'
      }}>
        Bienvenue dans notre service
      </h1>


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
            className='stepCard'
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
                title="Opérations"
                description={isMobile ? "" : "Vos coordonnées"}
                style={{
                  color: step === 1 ? theme.primary : undefined,
                  fontFamily: globalStyles.fontFamily,
                }}
              />
              <Steps.Item
                title="Infos"
                description={isMobile ? "" : "Vos coordonnées"}
                style={{
                  color: step === 2 ? theme.primary : undefined,
                  fontFamily: globalStyles.fontFamily,
                }}
              />
              <Steps.Item
                title="Résumé"
                description={isMobile ? "" : "Vérifiez vos informations"}
                style={{
                  color: step === 3 ? theme.primary : undefined,
                  fontFamily: globalStyles.fontFamily,
                }}
              />
              <Steps.Item
                title="Terminé"
                description={isMobile ? "" : "Récupérez votre ticket"}
                style={{
                  color: step === 4 ? theme.primary : undefined,
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
      </div>

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%'
      }}>
        {/* Contenu principal */}
        <div style={{ width: isMobile ? '100%' : '80%', }}

        >
          <Panel
            className='actioncard'
            style={{
              padding: isMobile ? '20px' : '30px',
              borderRadius: '16px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              minHeight: '400px',
              border: `0px solid ${theme.border}`,
            }}
          >
            {renderStepContent()}
          </Panel>

          {/* Section bas de page */}
          <div style={{
            marginTop: '30px',
            backgroundColor: theme.white,
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '25px',
            textAlign: 'center'
          }}>
            <p style={{
              margin: 0,
              color: theme.primaryColor,
              fontSize: '15px'
            }}>
              &copy; {new Date().getFullYear()} AFG Bank Côte d'Ivoire - Tous droits réservés
            </p>
          </div>
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
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              fontSize: '50px',
              marginBottom: '20px',
              color: theme.success
            }}>
              🎉
            </div>
            <p style={{ fontSize: '16px' }}>
              Votre demande a bien été enregistrée. Merci d'avoir utilisé notre service de tickets !
            </p>
            <p style={{
              fontSize: '14px',
              marginTop: '15px',
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
    </div>
  );
};

export default VerticalTicketWizard;