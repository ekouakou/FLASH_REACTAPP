import { useState, useEffect } from 'react';
import {
  Container, Header, Content, Footer,
  Panel, FlexboxGrid, List, Badge, Notification, 
  Tag, Icon, Grid, Row, Col, Divider, Button,
  Progress, Placeholder, Whisper, Tooltip
} from 'rsuite';
import { MessageSquare, Play, Bell, Clock, Info, ChevronRight, X } from 'lucide-react';
import 'rsuite/dist/rsuite.min.css';

export default function ModernQueueSystem() {
  const [currentTime, setCurrentTime] = useState('00:00');
  const [currentVideo, setCurrentVideo] = useState(0);
  const [activeMessage, setActiveMessage] = useState(0);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [nextPatient, setNextPatient] = useState(null);
  
  // Données simulées
  const [queueItems] = useState([
    { id: 'B127', name: 'LAMBERT T.', status: 'En cours', estimatedTime: '0', room: 'Cabinet 3', type: 'premium' },
    { id: 'B128', name: 'LEROY C.', status: 'Préparation', estimatedTime: '3', room: 'Cabinet 1', type: 'standard' },
    { id: 'B129', name: 'GIRARD M.', status: 'En attente', estimatedTime: '7', room: 'Cabinet 2', type: 'standard' },
    { id: 'B130', name: 'MOREAU S.', status: 'En attente', estimatedTime: '15', room: 'Cabinet 3', type: 'urgent' },
    { id: 'B131', name: 'ANDRE P.', status: 'En attente', estimatedTime: '18', room: 'Cabinet 1', type: 'standard' },
    { id: 'B132', name: 'SIMON R.', status: 'En attente', estimatedTime: '23', room: 'Cabinet 2', type: 'standard' },
    { id: 'B133', name: 'LEGRAND J.', status: 'En attente', estimatedTime: '30', room: 'Cabinet 3', type: 'standard' }
  ]);
  
  const scrollMessages = [
    "Bienvenue dans notre centre. N'hésitez pas à demander de l'aide à nos conseillers.",
    "Merci de respecter les règles sanitaires et la distanciation sociale.",
    "Pour une meilleure expérience, veuillez préparer vos documents avant votre rendez-vous.",
    "Nos équipes sont mobilisées pour réduire votre temps d'attente."
  ];
  
  const videos = [
    { id: 1, title: "Présentation de nos services", placeholder: "/api/placeholder/640/360" },
    { id: 2, title: "Guide d'utilisation de l'espace client", placeholder: "/api/placeholder/640/360" }
  ];

  // Mise à jour de l'heure
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Rotation des messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setActiveMessage(prev => (prev + 1) % scrollMessages.length);
    }, 8000);
    return () => clearInterval(messageInterval);
  }, [scrollMessages.length]);
  
  // Rotation des vidéos
  useEffect(() => {
    const videoInterval = setInterval(() => {
      setCurrentVideo(prev => (prev + 1) % videos.length);
    }, 45000);
    return () => clearInterval(videoInterval);
  }, [videos.length]);
  
  // Simulation d'une notification de prochain patient
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      // Simuler l'appel du prochain patient
      const randomIndex = Math.floor(Math.random() * queueItems.slice(1, 3).length);
      setNextPatient(queueItems[randomIndex + 1]);
      setShowNotification(true);
      
      // Masquer la notification après 10 secondes
      setTimeout(() => {
        setShowNotification(false);
      }, 10000);
    }, 30000);
    
    return () => clearInterval(notificationInterval);
  }, [queueItems]);

  const handleShowNotification = () => {
    if (nextPatient) {
      Notification.open({
        title: 'Prochain patient',
        description: `${nextPatient.name} - ${nextPatient.room}`,
        duration: 8000
      });
    }
  };

  // Obtenir la couleur en fonction du type
  const getTypeColor = (type) => {
    switch(type) {
      case 'urgent': return 'red';
      case 'premium': return 'violet';
      default: return 'blue';
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'En cours': return 'green';
      case 'Préparation': return 'orange';
      default: return 'gray';
    }
  };

  const renderQueueItem = (item, index) => (
    <List.Item key={item.id}>
      <Panel 
        bordered 
        style={{
          borderLeft: `4px solid ${item.type === 'urgent' ? '#f44336' : item.type === 'premium' ? '#673ab7' : '#2196f3'}`,
          backgroundColor: index === 0 ? '#e8f5e9' : 'white'
        }}
      >
        <FlexboxGrid align="middle">
          <FlexboxGrid.Item colspan={2}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: index === 0 ? '#c8e6c9' : '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: index === 0 ? '#2e7d32' : '#616161'
            }}>
              {item.id.slice(-2)}
            </div>
          </FlexboxGrid.Item>
          
          <FlexboxGrid.Item colspan={8}>
            <div style={{ fontWeight: 'bold' }}>{item.name}</div>
            <div style={{ color: getStatusColor(item.status) }}>{item.status}</div>
          </FlexboxGrid.Item>
          
          <FlexboxGrid.Item colspan={8}>
            <div style={{ textAlign: 'right' }}>
              <div>{item.room}</div>
              <div style={{ color: '#757575', fontSize: '0.9em' }}>{item.estimatedTime} min</div>
            </div>
          </FlexboxGrid.Item>
          
          <FlexboxGrid.Item colspan={6}>
            <Badge content={item.type} color={getTypeColor(item.type)} />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Panel>
    </List.Item>
  );

  return (
    <Container style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header style={{ background: 'white', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <FlexboxGrid justify="space-between" align="middle">
          <FlexboxGrid.Item colspan={8}>
            <FlexboxGrid align="middle">
              <Clock size={22} style={{ color: '#757575', marginRight: '8px' }} />
              <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#333' }}>{currentTime}</span>
              <Divider vertical style={{ margin: '0 16px', height: '24px' }} />
              <span style={{ color: '#666', fontWeight: 500 }}>Centre de services</span>
            </FlexboxGrid>
          </FlexboxGrid.Item>
          
          <FlexboxGrid.Item colspan={8} style={{ textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 700, 
              background: 'linear-gradient(to right, #1976d2, #3f51b5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              SYSTÈME D'ATTENTE
            </h1>
          </FlexboxGrid.Item>
          
          <FlexboxGrid.Item colspan={8} style={{ textAlign: 'right' }}>
            <FlexboxGrid align="middle" justify="end">
              <Tag color="blue" style={{ marginRight: '10px' }}>
                {queueItems.length} en attente
              </Tag>
              <Whisper
                placement="bottom"
                trigger="hover"
                speaker={<Tooltip>Notifications</Tooltip>}
              >
                <Button appearance="subtle" onClick={handleShowNotification}>
                  <Bell size={20} style={{ color: '#1976d2' }} />
                </Button>
              </Whisper>
            </FlexboxGrid>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Header>
      
      {/* Message défilant */}
      <div style={{ 
        background: 'linear-gradient(to right, #1976d2, #3f51b5)', 
        color: 'white', 
        padding: '12px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <FlexboxGrid align="middle">
          <MessageSquare size={18} style={{ marginRight: '12px', color: '#bbdefb' }} />
          <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{scrollMessages[activeMessage]}</span>
        </FlexboxGrid>
      </div>
      
      {/* Contenu principal */}
      <Content style={{ flex: 1, padding: '16px', background: '#f5f5f5' }}>
        <Grid fluid>
          <Row style={{ height: '100%' }}>
            {/* Section vidéo */}
            <Col xs={videoExpanded ? 16 : 12} style={{ transition: 'all 0.3s ease', height: '100%' }}>
              <Grid fluid style={{ height: '100%' }}>
                <Row style={{ height: '65%', marginBottom: '16px' }}>
                  <Col xs={24}>
                    <Panel 
                      style={{ 
                        height: '100%', 
                        position: 'relative', 
                        overflow: 'hidden',
                        background: '#000'
                      }}
                      bodyFill
                    >
                      <img 
                        src={videos[currentVideo].placeholder} 
                        alt="Contenu vidéo"
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          opacity: '0.85'
                        }}
                      />
                      
                      {/* Overlay gradient */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)',
                        zIndex: 1
                      }}></div>
                      
                      {/* Contrôles vidéo */}
                      <div style={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        right: 0, 
                        padding: '20px',
                        zIndex: 2 
                      }}>
                        <FlexboxGrid justify="space-between" align="bottom">
                          <FlexboxGrid.Item>
                            <h3 style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '8px' }}>
                              {videos[currentVideo].title}
                            </h3>
                            <FlexboxGrid align="middle" style={{ gap: '12px' }}>
                              <Button 
                                appearance="subtle" 
                                style={{ 
                                  background: 'rgba(255,255,255,0.2)', 
                                  backdropFilter: 'blur(4px)',
                                  padding: '8px',
                                  borderRadius: '50%'
                                }}
                              >
                                <Play size={16} style={{ color: 'white' }} />
                              </Button>
                              <Tag style={{ 
                                background: 'rgba(255,255,255,0.2)', 
                                backdropFilter: 'blur(4px)',
                                color: 'white'
                              }}>
                                En direct
                              </Tag>
                            </FlexboxGrid>
                          </FlexboxGrid.Item>
                          
                          <Button 
                            appearance="subtle"
                            onClick={() => setVideoExpanded(!videoExpanded)}
                            style={{ 
                              background: 'rgba(255,255,255,0.2)', 
                              backdropFilter: 'blur(4px)',
                              padding: '8px',
                              borderRadius: '50%'
                            }}
                          >
                            <ChevronRight size={18} style={{ 
                              color: 'white',
                              transform: videoExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s ease'
                            }} />
                          </Button>
                        </FlexboxGrid>
                      </div>
                    </Panel>
                  </Col>
                </Row>
                
                <Row style={{ height: '35%' }}>
                  <Col xs={24}>
                    <Panel header={
                      <FlexboxGrid align="middle">
                        <Info size={20} style={{ color: '#1976d2', marginRight: '8px' }} />
                        <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Informations importantes</span>
                      </FlexboxGrid>
                    }>
                      <List>
                        <List.Item>
                          <FlexboxGrid align="top">
                            <FlexboxGrid.Item colspan={1} style={{ marginRight: '12px' }}>
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: '#e3f2fd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: '#1976d2'
                              }}>1</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={22}>
                              Veuillez garder votre téléphone allumé pour recevoir les notifications.
                            </FlexboxGrid.Item>
                          </FlexboxGrid>
                        </List.Item>
                        
                        <List.Item>
                          <FlexboxGrid align="top">
                            <FlexboxGrid.Item colspan={1} style={{ marginRight: '12px' }}>
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: '#e3f2fd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: '#1976d2'
                              }}>2</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={22}>
                              Préparez vos documents d'identité et votre numéro de dossier avant l'appel.
                            </FlexboxGrid.Item>
                          </FlexboxGrid>
                        </List.Item>
                        
                        <List.Item>
                          <FlexboxGrid align="top">
                            <FlexboxGrid.Item colspan={1} style={{ marginRight: '12px' }}>
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: '#e3f2fd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: '#1976d2'
                              }}>3</div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={22}>
                              L'ordre de passage peut être modifié selon les urgences et les priorités.
                            </FlexboxGrid.Item>
                          </FlexboxGrid>
                        </List.Item>
                      </List>
                    </Panel>
                  </Col>
                </Row>
              </Grid>
            </Col>
            
            {/* File d'attente */}
            <Col xs={videoExpanded ? 8 : 12} style={{ transition: 'all 0.3s ease', height: '100%' }}>
              <Panel style={{ height: '100%', display: 'flex', flexDirection: 'column' }} bordered>
                <Panel
                  style={{ background: 'linear-gradient(to right, #303f9f, #1976d2)', padding: '16px' }}
                  bordered={false}
                >
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>
                    File d'attente actuelle
                  </h2>
                  <p style={{ color: '#bbdefb', fontSize: '0.875rem', margin: '4px 0 0 0' }}>
                    Mise à jour en temps réel
                  </p>
                </Panel>
                
                <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                  <List>
                    {queueItems.map((item, index) => renderQueueItem(item, index))}
                  </List>
                </div>
                
                <Panel style={{ background: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
                  <h3 style={{ fontWeight: 500, color: '#616161', marginBottom: '8px' }}>Légende</h3>
                  <FlexboxGrid>
                    <FlexboxGrid.Item colspan={8}>
                      <FlexboxGrid align="middle">
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: '#f44336',
                          marginRight: '8px'
                        }}></div>
                        <span style={{ fontSize: '0.875rem' }}>Urgent</span>
                      </FlexboxGrid>
                    </FlexboxGrid.Item>
                    
                    <FlexboxGrid.Item colspan={8}>
                      <FlexboxGrid align="middle">
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: '#673ab7',
                          marginRight: '8px'
                        }}></div>
                        <span style={{ fontSize: '0.875rem' }}>Premium</span>
                      </FlexboxGrid>
                    </FlexboxGrid.Item>
                    
                    <FlexboxGrid.Item colspan={8}>
                      <FlexboxGrid align="middle">
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          backgroundColor: '#2196f3',
                          marginRight: '8px'
                        }}></div>
                        <span style={{ fontSize: '0.875rem' }}>Standard</span>
                      </FlexboxGrid>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </Panel>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </Content>
      
      {/* Footer avec défilement */}
      <Footer style={{ 
        background: 'linear-gradient(to right, #303f9f, #1976d2)', 
        color: 'white', 
        padding: '12px',
        overflow: 'hidden'
      }}>
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <div style={{ 
            display: 'inline-block',
            animation: 'marquee 30s linear infinite',
            animationDuration: '30s',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite'
          }}>
            Nous vous remercions de votre patience • Les temps d'attente sont estimés et peuvent varier • Pour toute urgence, adressez-vous à l'accueil • Notre équipe fait de son mieux pour réduire votre temps d'attente
          </div>
        </div>
      </Footer>
      
      {/* Notification de style React Suite */}
      {showNotification && nextPatient && (
        <div style={{
          position: 'absolute',
          top: '64px',
          right: '16px',
          zIndex: 1000,
          animation: 'slideIn 0.5s ease-out'
        }}>
          <Panel
            bordered
            style={{
              width: '300px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderLeftWidth: '4px',
              borderLeftColor: '#4caf50'
            }}
            header={
              <FlexboxGrid justify="space-between" align="middle">
                <FlexboxGrid.Item>
                  <h3 style={{ fontWeight: 'bold', margin: 0 }}>Prochain patient</h3>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <Button appearance="subtle" onClick={() => setShowNotification(false)}>
                    <X size={16} style={{ color: '#757575' }} />
                  </Button>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            }
          >
            <FlexboxGrid align="middle">
              <FlexboxGrid.Item colspan={6}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e8f5e9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bell size={18} style={{ color: '#4caf50' }} />
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={18}>
                <div style={{ fontWeight: 'semibold' }}>{nextPatient.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#757575' }}>{nextPatient.room}</div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Panel>
        </div>
      )}
      
      {/* CSS pour les animations */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </Container>
  );
}