import { useState, useEffect } from 'react';
import { 
  Container, 
  Header, 
  Content, 
  Footer, 
  FlexboxGrid, 
  Panel, 
  List, 
  Badge, 
  Tag, 
  Icon, 
  IconButton, 
  Notification,
  Grid,
  Row,
  Col,
  Divider
} from 'rsuite';
import { Clock, ChevronRight, Play, X, Info, Bell, MessageSquare } from 'lucide-react';
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
    // { id: 'B131', name: 'ANDRE P.', status: 'En attente', estimatedTime: '18', room: 'Cabinet 1', type: 'standard' },
    // { id: 'B132', name: 'SIMON R.', status: 'En attente', estimatedTime: '23', room: 'Cabinet 2', type: 'standard' },
    // { id: 'B133', name: 'LEGRAND J.', status: 'En attente', estimatedTime: '30', room: 'Cabinet 3', type: 'standard' }
  ]);
  
  const scrollMessages = [
    "Bienvenue dans notre centre. N'hésitez pas à demander de l'aide à nos conseillers.",
    "Merci de respecter les règles sanitaires et la distanciation sociale.",
    "Pour une meilleure expérience, veuillez préparer vos documents avant votre rendez-vous.",
    "Nos équipes sont mobilisées pour réduire votre temps d'attente."
  ];
  
  const videos = [
    { id: 1, title: "Présentation de nos services", placeholder: "https://www.claudeusercontent.com/api/placeholder/640/360" },
    { id: 2, title: "Guide d'utilisation de l'espace client", placeholder: "https://www.claudeusercontent.com/api/placeholder/640/360" }
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

  // Fonction pour obtenir la couleur basée sur le type
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

  // Custom CSS styles
  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#f7fafc'
    },
    header: {
      padding: '15px 20px',
      background: 'white',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    },
    notificationBar: {
      position: 'absolute',
      top: '70px',
      right: '20px',
      zIndex: 1000,
      width: '300px'
    },
    messageScrollBar: {
      background: 'linear-gradient(90deg, #3182ce, #4f46e5)',
      color: 'white',
      padding: '12px 20px'
    },
    videoSection: {
      transition: 'all 0.3s ease',
      height: '100%'
    },
    videoContainer: {
      position: 'relative',
      height: '70%',
      overflow: 'hidden',
      borderRadius: '8px',
      marginBottom: '15px'
    },
    videoOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: '20px',
      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
      color: 'white',
      zIndex: 10
    },
    playButton: {
      background: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(4px)',
      borderRadius: '50%',
      padding: '8px',
      marginRight: '10px'
    },
    queueHeader: {
      background: 'linear-gradient(90deg, #2c5282, #434190)',
      color: 'white',
      padding: '15px 20px',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px'
    },
    queueList: {
      height: 'calc(100% - 120px)',
      overflow: 'auto',
      padding: '15px'
    },
    queueItem: {
      borderLeft: '4px solid',
      marginBottom: '10px',
      transition: 'all 0.2s ease'
    },
    queueLegend: {
      background: '#f9fafb',
      padding: '15px',
      borderTop: '1px solid #edf2f7'
    },
    footer: {
      background: 'linear-gradient(90deg, #434190, #2c5282)',
      color: 'white',
      padding: '12px',
      overflow: 'hidden'
    },
    marquee: {
      animation: 'marquee 30s linear infinite',
      display: 'inline-block',
      whiteSpace: 'nowrap'
    },
    '@keyframes marquee': {
      '0%': { transform: 'translateX(100%)' },
      '100%': { transform: 'translateX(-100%)' }
    },
    circleIcon: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: '10px',
      fontWeight: 'bold',
      fontSize: '14px'
    }
  };

  return (
    <Container style={styles.container}>
      {/* Notification popup */}
      {showNotification && nextPatient && (
        <Panel bordered style={styles.notificationBar}>
          <FlexboxGrid justify="space-between" align="middle" style={{ marginBottom: '10px' }}>
            <FlexboxGrid.Item>
              <h4>Prochain patient</h4>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <IconButton 
                icon={<X size={16} />} 
                size="xs" 
                appearance="subtle" 
                onClick={() => setShowNotification(false)} 
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <FlexboxGrid align="middle">
            <FlexboxGrid.Item style={{ marginRight: '15px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: '#ebf5ff', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <Bell size={18} color="#1c64f2" />
              </div>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <p style={{ fontWeight: 600, margin: 0 }}>{nextPatient.name}</p>
              <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>{nextPatient.room}</p>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Panel>
      )}
      
      {/* Header moderne */}
      <Header style={styles.header}>
        <FlexboxGrid justify="space-between" align="middle">
          <FlexboxGrid.Item>
            <FlexboxGrid align="middle">
              <Clock size={22} style={{ color: '#718096', marginRight: '10px' }} />
              <span style={{ fontSize: '20px', fontWeight: 600, color: '#2d3748' }}>{currentTime}</span>
              <Divider vertical style={{ margin: '0 15px' }} />
              <span style={{ color: '#4a5568', fontWeight: 500 }}>Centre de services</span>
            </FlexboxGrid>
          </FlexboxGrid.Item>
          
          <FlexboxGrid.Item>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              background: 'linear-gradient(90deg, #3182ce, #4f46e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              SYSTÈME D'ATTENTE
            </h1>
          </FlexboxGrid.Item>
          
          <FlexboxGrid.Item>
            <FlexboxGrid align="middle">
              <Badge content={queueItems.length}>
                <Tag color="blue" style={{ marginRight: '10px', padding: '5px 10px' }}>
                  en attente
                </Tag>
              </Badge>
              <Bell size={20} color="#3182ce" />
            </FlexboxGrid>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Header>
      
      {/* Message défilant avec transition fade */}
      <div style={styles.messageScrollBar}>
        <FlexboxGrid align="middle" style={{ transition: 'opacity 1s' }}>
          <MessageSquare size={18} style={{ marginRight: '15px', color: '#bfdbfe' }} />
          <span style={{ fontSize: '16px', fontWeight: 500 }}>{scrollMessages[activeMessage]}</span>
        </FlexboxGrid>
      </div>
      
      {/* Contenu principal */}
      <Content style={{ flex: 1, padding: '15px' }}>
        <Grid fluid>
          <Row>
            {/* Section vidéo avec effet moderne */}
            <Col xs={videoExpanded ? 16 : 12} style={{ transition: 'all 0.3s ease', height: '100%' }}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Panel shaded bodyFill style={styles.videoContainer}>
                  <img 
                    src={videos[currentVideo].placeholder} 
                    alt="Contenu vidéo" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  {/* Contrôles vidéo */}
                  <div style={styles.videoOverlay}>
                    <FlexboxGrid justify="space-between" align="bottom">
                      <FlexboxGrid.Item>
                        <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
                          {videos[currentVideo].title}
                        </h3>
                        <FlexboxGrid align="middle">
                          <IconButton 
                            icon={<Play size={16} />} 
                            circle
                            size="sm"
                            style={styles.playButton}
                          />
                          <Tag color="blue" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }}>
                            En direct
                          </Tag>
                        </FlexboxGrid>
                      </FlexboxGrid.Item>
                      
                      <FlexboxGrid.Item>
                        <IconButton 
                          icon={<ChevronRight size={18} style={{ 
                            transform: videoExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease' 
                          }} />} 
                          circle
                          size="sm"
                          style={styles.playButton}
                          onClick={() => setVideoExpanded(!videoExpanded)}
                        />
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </div>
                </Panel>
                
                {/* Messages importants */}
                <Panel header={
                  <FlexboxGrid align="middle">
                    <Info size={20} style={{ color: '#3182ce', marginRight: '10px' }} />
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#2d3748' }}>
                      Informations importantes
                    </span>
                  </FlexboxGrid>
                } bordered style={{ flex: 1 }}>
                  <List>
                    <List.Item>
                      <FlexboxGrid align="top">
                        <FlexboxGrid.Item style={{ marginRight: '10px' }}>
                          <div style={{ 
                            ...styles.circleIcon, 
                            background: '#ebf5ff', 
                            color: '#3182ce' 
                          }}>1</div>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item>
                          Veuillez garder votre téléphone allumé pour recevoir les notifications.
                        </FlexboxGrid.Item>
                      </FlexboxGrid>
                    </List.Item>
                    
                    <List.Item>
                      <FlexboxGrid align="top">
                        <FlexboxGrid.Item style={{ marginRight: '10px' }}>
                          <div style={{ 
                            ...styles.circleIcon, 
                            background: '#ebf5ff', 
                            color: '#3182ce' 
                          }}>2</div>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item>
                          Préparez vos documents d'identité et votre numéro de dossier avant l'appel.
                        </FlexboxGrid.Item>
                      </FlexboxGrid>
                    </List.Item>
                    
                    <List.Item>
                      <FlexboxGrid align="top">
                        <FlexboxGrid.Item style={{ marginRight: '10px' }}>
                          <div style={{ 
                            ...styles.circleIcon, 
                            background: '#ebf5ff', 
                            color: '#3182ce' 
                          }}>3</div>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item>
                          L'ordre de passage peut être modifié selon les urgences et les priorités.
                        </FlexboxGrid.Item>
                      </FlexboxGrid>
                    </List.Item>
                  </List>
                </Panel>
              </div>
            </Col>
            
            {/* File d'attente avec design moderne */}
            <Col xs={videoExpanded ? 8 : 12} style={{ transition: 'all 0.3s ease', height: '100%' }}>
              <Panel bodyFill style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={styles.queueHeader}>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>File d'attente actuelle</h2>
                  <p style={{ fontSize: '14px', color: '#bfdbfe', margin: '5px 0 0 0' }}>Mise à jour en temps réel</p>
                </div>
                
                <div style={styles.queueList}>
                  <List>
                    {queueItems.map((item, index) => (
                      <List.Item key={item.id}>
                        <Panel 
                          bordered 
                          style={{ 
                            ...styles.queueItem, 
                            borderLeftColor: getTypeColor(item.type),
                            background: index === 0 ? '#f0fff4' : 'white'
                          }}
                        >
                          <FlexboxGrid justify="space-between" align="middle">
                            <FlexboxGrid.Item>
                              <FlexboxGrid align="middle">
                                <FlexboxGrid.Item style={{ marginRight: '15px' }}>
                                  <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '50%', 
                                    background: index === 0 ? '#c6f6d5' : '#edf2f7',
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    fontWeight: 'bold',
                                    color: index === 0 ? '#22543d' : '#4a5568'
                                  }}>
                                    {item.id.slice(-2)}
                                  </div>
                                </FlexboxGrid.Item>
                                
                                <FlexboxGrid.Item>
                                  <div style={{ fontWeight: 600, color: '#2d3748' }}>{item.name}</div>
                                  <div style={{ 
                                    fontSize: '14px', 
                                    color: getStatusColor(item.status) === 'green' ? '#38a169' : 
                                           getStatusColor(item.status) === 'orange' ? '#dd6b20' : '#718096'
                                  }}>
                                    {item.status}
                                  </div>
                                </FlexboxGrid.Item>
                              </FlexboxGrid>
                            </FlexboxGrid.Item>
                            
                            <FlexboxGrid.Item style={{ textAlign: 'right' }}>
                              <div style={{ color: '#2d3748' }}>{item.room}</div>
                              <div style={{ fontSize: '14px', color: '#718096' }}>{item.estimatedTime} min</div>
                            </FlexboxGrid.Item>
                          </FlexboxGrid>
                        </Panel>
                      </List.Item>
                    ))}
                  </List>
                </div>
                
                {/* Légende */}
                <div style={styles.queueLegend}>
                  <h3 style={{ fontSize: '16px', fontWeight: 500, color: '#4a5568', marginBottom: '10px' }}>Légende</h3>
                  <FlexboxGrid>
                    <FlexboxGrid.Item colspan={8}>
                      <FlexboxGrid align="middle">
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          background: '#e53e3e', 
                          marginRight: '8px' 
                        }}></div>
                        <span style={{ fontSize: '14px' }}>Urgent</span>
                      </FlexboxGrid>
                    </FlexboxGrid.Item>
                    
                    <FlexboxGrid.Item colspan={8}>
                      <FlexboxGrid align="middle">
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          background: '#805ad5', 
                          marginRight: '8px' 
                        }}></div>
                        <span style={{ fontSize: '14px' }}>Premium</span>
                      </FlexboxGrid>
                    </FlexboxGrid.Item>
                    
                    <FlexboxGrid.Item colspan={8}>
                      <FlexboxGrid align="middle">
                        <div style={{ 
                          width: '12px', 
                          height: '12px', 
                          borderRadius: '50%', 
                          background: '#3182ce', 
                          marginRight: '8px' 
                        }}></div>
                        <span style={{ fontSize: '14px' }}>Standard</span>
                      </FlexboxGrid>
                    </FlexboxGrid.Item>
                  </FlexboxGrid>
                </div>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </Content>
      
      {/* Footer moderne avec défilement */}
      <Footer style={styles.footer}>
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{
            animation: 'marquee 30s linear infinite',
            display: 'inline-block'
          }}>
            Nous vous remercions de votre patience • Les temps d'attente sont estimés et peuvent varier • Pour toute urgence, adressez-vous à l'accueil • Notre équipe fait de son mieux pour réduire votre temps d'attente
          </div>
        </div>

        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </Footer>
    </Container>
  );
}