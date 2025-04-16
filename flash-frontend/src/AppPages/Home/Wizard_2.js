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
  List
} from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

// Utiliser des emojis au lieu d'icônes
const serviceIcons = {
  information: "ℹ️",
  consultation: "📅",
  paiement: "💳",
  reclamation: "💬",
  livraison: "📦",
  reparation: "🔧"
};

// Charte graphique inspirée d'AFG Bank
const theme = {
  primaryColor: '#1A365D', // Bleu foncé
  secondaryColor: '#D69929', // Doré/orange
  accentColor: '#FFD700', // Or plus vif pour accents
  textPrimary: '#333333',
  textSecondary: '#666666',
  lightBackground: '#F8F9FA',
  success: '#2D8A59',
  white: '#FFFFFF',
  gray: '#E5E7EB'
};

const VerticalTicketWizard = () => {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [ticketNumber, setTicketNumber] = useState('');
  const [currentTime, setCurrentTime] = useState('');

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

  const services = [
    { id: 'information', name: 'Information', description: 'Renseignements généraux' },
    { id: 'consultation', name: 'Consultation', description: 'Rencontrer un conseiller' },
    { id: 'paiement', name: 'Paiement', description: 'Effectuer un paiement' },
    { id: 'reclamation', name: 'Réclamation', description: 'Déposer une réclamation' },
    { id: 'livraison', name: 'Livraison', description: 'Retrait de commande' },
    { id: 'reparation', name: 'Réparation', description: 'Service après-vente' }
  ];

  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setStep(1);
  };

  const handleUserDataChange = (value, name) => {
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleConfirm = () => {
    // Réinitialiser le wizard
    setStep(0);
    setSelectedService(null);
    setUserData({ name: '', phone: '', email: '' });
    // Générer un nouveau numéro
    setTicketNumber(`AFG-${Math.floor(Math.random() * 1000)}`);
  };

  const validateUserData = () => {
    return userData.name.trim() !== '' && userData.phone.trim() !== '';
  };

  const getSelectedServiceName = () => {
    const service = services.find(s => s.id === selectedService);
    return service ? service.name : '';
  };

  return (
    <div style={{ 
      backgroundColor: theme.lightBackground, 
      minHeight: '100vh',
      fontFamily: 'Poppins, sans-serif'
    }}>
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
            <div style={{ marginRight: '20px' }}>
              <small style={{ opacity: 0.8 }}>Heure actuelle</small>
              <div style={{ fontWeight: 'bold' }}>{currentTime}</div>
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

      {/* Contenu principal */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '30px auto', 
        padding: '0 20px'
      }}>
        {/* En-tête de page */}
        <div style={{ 
          backgroundColor: theme.white,
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '30px',
          marginBottom: '30px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '150px',
            height: '150px',
            backgroundColor: theme.secondaryColor,
            opacity: 0.1,
            borderRadius: '0 0 0 150px'
          }} />
          
          <h1 style={{ 
            color: theme.primaryColor, 
            margin: '0 0 10px 0',
            fontSize: '2.5rem',
            fontWeight: '700'
          }}>
            Service de Guichet Électronique
          </h1>
          <p style={{ 
            color: theme.textSecondary, 
            fontSize: '1.1rem',
            maxWidth: '800px',
            lineHeight: '1.6'
          }}>
            Bienvenue dans notre système de réservation de tickets. Suivez les étapes ci-dessous pour obtenir votre ticket et optimiser votre temps d'attente en agence.
          </p>
        </div>

        {/* Wizard principal */}
        <div style={{ 
          backgroundColor: theme.white,
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '200px',
            height: '200px',
            backgroundColor: theme.secondaryColor,
            opacity: 0.05,
            borderRadius: '0 200px 0 0'
          }} />
          
          <FlexboxGrid>
            <FlexboxGrid.Item colspan={6}>
              <Steps 
                current={step} 
                vertical 
                style={{ 
                  marginRight: '20px'
                }}
              >
                <Steps.Item 
                  title={<span style={{ color: step >= 0 ? theme.primaryColor : theme.textSecondary, fontWeight: step === 0 ? '600' : '400' }}>Service</span>} 
                  description={<span style={{ color: theme.textSecondary }}>Choisissez votre service</span>} 
                />
                <Steps.Item 
                  title={<span style={{ color: step >= 1 ? theme.primaryColor : theme.textSecondary, fontWeight: step === 1 ? '600' : '400' }}>Informations</span>} 
                  description={<span style={{ color: theme.textSecondary }}>Vos coordonnées</span>} 
                />
                <Steps.Item 
                  title={<span style={{ color: step >= 2 ? theme.primaryColor : theme.textSecondary, fontWeight: step === 2 ? '600' : '400' }}>Résumé</span>} 
                  description={<span style={{ color: theme.textSecondary }}>Vérifiez vos informations</span>} 
                />
                <Steps.Item 
                  title={<span style={{ color: step >= 3 ? theme.primaryColor : theme.textSecondary, fontWeight: step === 3 ? '600' : '400' }}>Terminé</span>} 
                  description={<span style={{ color: theme.textSecondary }}>Récupérez votre ticket</span>} 
                />
              </Steps>
            </FlexboxGrid.Item>
            
            <FlexboxGrid.Item colspan={18}>
              <Panel
                bordered
                style={{
                  padding: '30px',
                  borderRadius: '10px',
                  border: `1px solid ${theme.gray}`,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                  minHeight: '450px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {step === 0 && (
                  <div>
                    <h3 style={{ 
                      marginBottom: '25px', 
                      color: theme.primaryColor,
                      fontWeight: '600',
                      position: 'relative',
                      paddingBottom: '10px'
                    }}>
                      Sélectionnez le service souhaité
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '50px',
                        height: '3px',
                        backgroundColor: theme.secondaryColor,
                        borderRadius: '2px'
                      }} />
                    </h3>
                    <Grid fluid>
                      <Row gutter={20}>
                        {services.map((service) => (
                          <Col xs={24} sm={12} md={8} key={service.id} style={{ marginBottom: '20px' }}>
                            <div
                              onClick={() => handleServiceSelect(service.id)}
                              style={{
                                padding: '25px 15px',
                                borderRadius: '10px',
                                border: `2px solid ${selectedService === service.id ? theme.secondaryColor : theme.gray}`,
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                backgroundColor: selectedService === service.id ? '#FFF8E5' : theme.white,
                                boxShadow: selectedService === service.id ? `0 5px 15px rgba(214, 153, 41, 0.15)` : 'none',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden'
                              }}
                            >
                              {selectedService === service.id && (
                                <div style={{
                                  position: 'absolute',
                                  top: '10px',
                                  right: '10px',
                                  width: '10px',
                                  height: '10px',
                                  backgroundColor: theme.secondaryColor,
                                  borderRadius: '50%'
                                }} />
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
                                fontWeight: '600',
                                color: theme.primaryColor
                              }}>
                                {service.name}
                              </h4>
                              <p style={{ 
                                margin: 0, 
                                textAlign: 'center', 
                                color: theme.textSecondary 
                              }}>
                                {service.description}
                              </p>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Grid>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h3 style={{ 
                      marginBottom: '25px', 
                      color: theme.primaryColor,
                      fontWeight: '600',
                      position: 'relative',
                      paddingBottom: '10px'
                    }}>
                      Vos informations personnelles
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '50px',
                        height: '3px',
                        backgroundColor: theme.secondaryColor,
                        borderRadius: '2px'
                      }} />
                    </h3>
                    
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
                        <Form.ControlLabel style={{ color: theme.primaryColor, fontWeight: '500' }}>
                          Nom complet
                        </Form.ControlLabel>
                        <Form.Control
                          name="name"
                          value={userData.name}
                          onChange={(value) => handleUserDataChange(value, 'name')}
                          placeholder="Entrez votre nom et prénom"
                          style={{ 
                            borderColor: theme.gray,
                            padding: '10px 15px'
                          }}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.ControlLabel style={{ color: theme.primaryColor, fontWeight: '500' }}>
                          Téléphone
                        </Form.ControlLabel>
                        <Form.Control
                          name="phone"
                          value={userData.phone}
                          onChange={(value) => handleUserDataChange(value, 'phone')}
                          placeholder="+225 XX XX XX XX XX"
                          style={{ 
                            borderColor: theme.gray,
                            padding: '10px 15px'
                          }}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.ControlLabel style={{ color: theme.primaryColor, fontWeight: '500' }}>
                          Email (optionnel)
                        </Form.ControlLabel>
                        <Form.Control
                          name="email"
                          type="email"
                          value={userData.email}
                          onChange={(value) => handleUserDataChange(value, 'email')}
                          placeholder="exemple@email.com"
                          style={{ 
                            borderColor: theme.gray,
                            padding: '10px 15px'
                          }}
                        />
                      </Form.Group>
                    </Form>
                    <Stack spacing={10} direction="row" justifyContent="space-between" style={{ marginTop: '40px' }}>
                      <Button 
                        appearance="subtle" 
                        onClick={handlePrevious}
                        style={{ 
                          color: theme.primaryColor,
                          padding: '10px 20px'
                        }}
                      >
                        Retour
                      </Button>
                      <Button 
                        appearance="primary" 
                        onClick={handleNext} 
                        disabled={!validateUserData()}
                        style={{ 
                          backgroundColor: theme.primaryColor,
                          color: theme.white,
                          padding: '10px 25px',
                          fontWeight: '500'
                        }}
                      >
                        Continuer
                      </Button>
                    </Stack>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h3 style={{ 
                      marginBottom: '25px', 
                      color: theme.primaryColor,
                      fontWeight: '600',
                      position: 'relative',
                      paddingBottom: '10px'
                    }}>
                      Résumé de votre demande
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '50px',
                        height: '3px',
                        backgroundColor: theme.secondaryColor,
                        borderRadius: '2px'
                      }} />
                    </h3>
                    
                    <div style={{ 
                      backgroundColor: theme.lightBackground, 
                      padding: '25px', 
                      borderRadius: '10px',
                      border: `1px solid ${theme.gray}`
                    }}>
                      <List bordered style={{ 
                        border: 'none', 
                        backgroundColor: 'transparent',
                      }}>
                        <List.Item style={{ 
                          padding: '15px 0',
                          borderBottom: `1px solid ${theme.gray}`
                        }}>
                          <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item colspan={6}>
                              <strong style={{ color: theme.primaryColor }}>Service :</strong>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={18}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span 
                                  style={{ 
                                    marginRight: '10px', 
                                    color: theme.secondaryColor, 
                                    fontSize: '18px',
                                    width: '35px',
                                    height: '35px',
                                    backgroundColor: 'rgba(214, 153, 41, 0.1)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }} 
                                >
                                  {serviceIcons[selectedService]}
                                </span>
                                <strong>{getSelectedServiceName()}</strong>
                              </div>
                            </FlexboxGrid.Item>
                          </FlexboxGrid>
                        </List.Item>
                        <List.Item style={{ 
                          padding: '15px 0',
                          borderBottom: `1px solid ${theme.gray}`
                        }}>
                          <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item colspan={6}>
                              <strong style={{ color: theme.primaryColor }}>Nom :</strong>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={18}>
                              {userData.name}
                            </FlexboxGrid.Item>
                          </FlexboxGrid>
                        </List.Item>
                        <List.Item style={{ 
                          padding: '15px 0',
                          borderBottom: userData.email ? `1px solid ${theme.gray}` : 'none'
                        }}>
                          <FlexboxGrid justify="start" align="middle">
                            <FlexboxGrid.Item colspan={6}>
                              <strong style={{ color: theme.primaryColor }}>Téléphone :</strong>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={18}>
                              {userData.phone}
                            </FlexboxGrid.Item>
                          </FlexboxGrid>
                        </List.Item>
                        {userData.email && (
                          <List.Item style={{ padding: '15px 0' }}>
                            <FlexboxGrid justify="start" align="middle">
                              <FlexboxGrid.Item colspan={6}>
                                <strong style={{ color: theme.primaryColor }}>Email :</strong>
                              </FlexboxGrid.Item>
                              <FlexboxGrid.Item colspan={18}>
                                {userData.email}
                              </FlexboxGrid.Item>
                            </FlexboxGrid>
                          </List.Item>
                        )}
                      </List>
                    </div>
                    
                    <div style={{
                      backgroundColor: 'rgba(26, 54, 93, 0.05)',
                      borderRadius: '8px',
                      padding: '15px',
                      marginTop: '20px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <div style={{ 
                        fontSize: '20px', 
                        marginRight: '10px',
                        color: theme.primaryColor
                      }}>
                        ⏱️
                      </div>
                      <div>
                        <span style={{ color: theme.textSecondary }}>
                          Temps d'attente estimé : <strong style={{ color: theme.primaryColor }}>~15 minutes</strong>
                        </span>
                      </div>
                    </div>
                    
                    <Stack spacing={10} direction="row" justifyContent="space-between" style={{ marginTop: '40px' }}>
                      <Button 
                        appearance="subtle" 
                        onClick={handlePrevious}
                        style={{ 
                          color: theme.primaryColor,
                          padding: '10px 20px'
                        }}
                      >
                        Modifier
                      </Button>
                      <Button 
                        appearance="primary" 
                        onClick={handleNext}
                        style={{ 
                          backgroundColor: theme.success,
                          color: theme.white,
                          padding: '10px 25px',
                          fontWeight: '500'
                        }}
                      >
                        Confirmer
                      </Button>
                    </Stack>
                  </div>
                )}

                {step === 3 && (
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
                          fontSize: '60px',
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
                    
                    <div style={{
                      backgroundColor: theme.lightBackground,
                      padding: '15px',
                      borderRadius: '8px',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}>
                      <div style={{ 
                        fontSize: '24px', 
                        marginRight: '10px',
                        color: theme.primaryColor
                      }}>
                        ⏱️
                      </div>
                      <div style={{ color: theme.textSecondary }}>
                        Temps d'attente estimé : <strong style={{ color: theme.primaryColor }}>environ 15 minutes</strong>
                      </div>
                    </div>
                    
                    <Button 
                      appearance="primary" 
                      onClick={handleConfirm} 
                      style={{ 
                        marginTop: '40px',
                        backgroundColor: theme.primaryColor,
                        color: theme.white,
                        padding: '10px 30px',
                        fontWeight: '500'
                      }}
                    >
                      Terminer
                    </Button>
                  </div>
                )}
              </Panel>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
        
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
  );
};

export default VerticalTicketWizard;