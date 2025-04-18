import { useState, useEffect, useRef, useCallback } from 'react';
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
  IconButton,
  Grid,
  Row,
  Col,
  Divider,
  Button,
  Table
} from 'rsuite';
import { Clock, ChevronRight, Play, X, Info, Bell, MessageSquare, Calendar, DollarSign, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import 'rsuite/dist/rsuite.min.css';
import './queueStyles.css'; // Importation des styles externalisés

const { Column, HeaderCell, Cell } = Table;

// Composant de slideshow des devises avec Splide
function CurrencySlideshow({ currencies, lastUpdate, updateCurrencyTimestamp }) {
  // Options pour le carrousel Splide
  const splideOptions = {
    type: 'loop',
    perPage: 3,
    perMove: 1,
    gap: '1rem',
    pagination: true,
    arrows: false,
    autoplay: true,
    interval: 4000,
    pauseOnHover: true,
    breakpoints: {
      768: {
        perPage: 1,
      }
    }
  };

  return (
    <div className="currency-panel">
      <div className="currency-header">
        <FlexboxGrid justify="space-between" align="middle">
          <FlexboxGrid.Item>
            <h2 className="currency-title">
              <DollarSign size={18} className="currency-icon" />
              Cours des devises
            </h2>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <FlexboxGrid align="middle">
              <span className="currency-last-update">
                MAJ: {lastUpdate}
              </span>
              <IconButton
                icon={<RefreshCw size={16} />}
                circle
                size="xs"
                onClick={updateCurrencyTimestamp}
                className="refresh-button"
              />
            </FlexboxGrid>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>

      <div className="currency-slideshow-container">
        <Splide options={splideOptions} className="currency-splide">
          {currencies.map(currency => (
            <SplideSlide key={currency.code}>
              <div 
                className="currency-slide-item"
                style={{
                  backgroundColor: getCurrencyColor(currency.code),
                  height: '100%'
                }}
              >
                <div className="currency-slide-header">
                  <span className="currency-flag">{currency.icon}</span>
                  <div>
                    <div className="currency-code">{currency.code}</div>
                    <div className="currency-name">{currency.name}</div>
                  </div>
                </div>
                <div className="currency-slide-values">
                  <div className="currency-value-box">
                    <small>Achats</small>
                    <div className="currency-value-amount">{getAchatValue(currency)}</div>
                  </div>
                  <div className="currency-value-box">
                    <small>Ventes</small>
                    <div className="currency-value-amount">{getVenteValue(currency)}</div>
                  </div>
                </div>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
      
      <style jsx>{`
        .currency-panel {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        
        .currency-header {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .currency-title {
          display: flex;
          align-items: center;
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .currency-icon {
          margin-right: 8px;
          color: #3498ff;
        }
        
        .currency-last-update {
          font-size: 12px;
          color: #666;
          margin-right: 8px;
        }
        
        .refresh-button {
          background-color: #f5f5f5;
        }
        
        .currency-slideshow-container {
          padding: 16px;
        }
        
        .currency-splide {
          margin-bottom: 10px;
        }
        
        .currency-slide-item {
          display: flex;
          flex-direction: column;
          padding: 16px;
          border-radius: 6px;
          height: 100%;
        }
        
        .currency-slide-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .currency-flag {
          font-size: 24px;
          margin-right: 12px;
        }
        
        .currency-code {
          font-weight: 600;
          font-size: 15px;
        }
        
        .currency-name {
          font-size: 12px;
          color: #666;
        }
        
        .currency-slide-values {
          display: flex;
          justify-content: space-between;
          margin-top: 0;
        }
        
        .currency-value-box {
          background-color: rgba(255, 255, 255, 0.7);
          border-radius: 6px;
          padding: 8px 10px;
          text-align: center;
          width: 48%;
        }
        
        .currency-value-box small {
          display: block;
          font-size: 11px;
          color: #555;
          margin-bottom: 3px;
        }
        
        .currency-value-amount {
          font-weight: 700;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
}

// Fonction auxiliaire pour obtenir une couleur pour chaque devise
function getCurrencyColor(code) {
  const colorMap = {
    'JPY': '#f9e6f0', // rose pâle
    'EUR': '#e6f0fb', // bleu pâle
    'USD': '#e6fbef', // vert pâle
    'CAD': '#faf0dc', // ambre pâle
    'GBP': '#f0e6fb', // violet pâle
    'CHF': '#fbe6e6'  // rouge pâle
  };
  
  return colorMap[code] || '#f5f5f5';
}

// Fonctions pour simuler des valeurs d'achat et de vente
function getAchatValue(currency) {
  // Simulation de valeurs d'achat basées sur value
  const baseValue = currency.value * 100;
  return Math.round(baseValue * 0.95);
}

function getVenteValue(currency) {
  // Simulation de valeurs de vente basées sur value
  const baseValue = currency.value * 100;
  return Math.round(baseValue * 1.05);
}

export default function ModernQueueSystem() {
  const [currentTime, setCurrentTime] = useState('00:00');
  const [currentDate, setCurrentDate] = useState('');
  const [currentVideo, setCurrentVideo] = useState(0);
  const [activeMessage, setActiveMessage] = useState(0);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [nextPatient, setNextPatient] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCurrencies, setShowCurrencies] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const videoRef = useRef(null);

  // Données simulées
  const [queueItems] = useState([
    { id: 'B127', name: 'LAMBERT T.', status: 'En cours', estimatedTime: '0', room: 'Cabinet 3', type: 'premium' },
    { id: 'B128', name: 'LEROY C.', status: 'Préparation', estimatedTime: '3', room: 'Cabinet 1', type: 'standard' },
    { id: 'B129', name: 'GIRARD M.', status: 'En attente', estimatedTime: '7', room: 'Cabinet 2', type: 'standard' },
    { id: 'B130', name: 'MOREAU S.', status: 'En attente', estimatedTime: '15', room: 'Cabinet 3', type: 'urgent' },
  ]);

  // Données des devises
  const [currencies] = useState([
    { code: 'JPY', name: 'Cours du Yen', value: 0.0061, change: -0.2, icon: '🇯🇵' },
    { code: 'EUR', name: 'Cours de l\'Euro', value: 1.00, change: 0, icon: '🇪🇺' },
    { code: 'USD', name: 'Cours du dollar', value: 0.92, change: +0.3, icon: '🇺🇸' },
    { code: 'CAD', name: 'Dollar Canadien', value: 0.68, change: -0.4, icon: '🇨🇦' },
    { code: 'GBP', name: 'Livre Sterling', value: 1.18, change: +0.5, icon: '🇬🇧' },
    { code: 'CHF', name: 'Franc suisse', value: 1.02, change: +0.1, icon: '🇨🇭' }
  ]);

  const scrollMessages = [
    "Bienvenue dans notre centre. N'hésitez pas à demander de l'aide à nos conseillers.",
    "Merci de respecter les règles sanitaires et la distanciation sociale.",
    "Pour une meilleure expérience, veuillez préparer vos documents avant votre rendez-vous.",
    "Nos équipes sont mobilisées pour réduire votre temps d'attente."
  ];

  // Collection de vidéos avec différents types (fichiers locaux ou YouTube)
  const videos = [
    { 
      id: 1, 
      title: "Présentation de nos services", 
      source: "/videos/presentation.mp4", // Fichier local
      type: "local"
    },
    {
      id: 2,
      title: "Guide d'utilisation de l'espace client",
      source: "/videos/guide.mp4", // Fichier local
      type: "local"
    },
    {
      id: 3,
      title: "Notre équipe médicale",
      source: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Lien YouTube (exemple)
      type: "youtube"
    }
  ];

  // Mise à jour de l'heure et de la date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Format de l'heure
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
      
      // Format de la date
      const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      setCurrentDate(now.toLocaleDateString('fr-FR', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initialisation de la dernière mise à jour des devises
  useEffect(() => {
    updateCurrencyTimestamp();
  }, []);

  // Rotation des messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setActiveMessage(prev => (prev + 1) % scrollMessages.length);
    }, 8000);
    return () => clearInterval(messageInterval);
  }, [scrollMessages.length]);

  // Gestion de la lecture des vidéos
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.addEventListener('ended', handleVideoEnd);
    }
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [isPlaying, currentVideo]);

  // Mise à jour du timestamp des devises
  const updateCurrencyTimestamp = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    setLastUpdate(`${hours}:${minutes}:${seconds}`);
  };

  // Gestion de la fin de vidéo pour passer à la suivante
  const handleVideoEnd = () => {
    setCurrentVideo(prev => (prev + 1) % videos.length);
  };

  // Lecture de la vidéo
  const playVideo = () => {
    if (videoRef.current && videos[currentVideo].type === 'local') {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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
    switch (type) {
      case 'urgent': return 'red';
      case 'premium': return 'violet';
      default: return 'blue';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En cours': return 'green';
      case 'Préparation': return 'orange';
      default: return 'gray';
    }
  };

  // Rendu du contenu vidéo en fonction du type
  const renderVideoContent = () => {
    const video = videos[currentVideo];
    
    if (video.type === 'youtube') {
      return (
        <iframe 
          src={video.source}
          title={video.title}
          className="video-frame"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    } else {
      return (
        <video 
          ref={videoRef}
          src={video.source}
          className="video-frame"
          poster="/api/placeholder/640/360"
        />
      );
    }
  };

  return (
    <Container className="main-container">
      {/* Notification popup */}
      {showNotification && nextPatient && (
        <Panel bordered className="notification-bar">
          <FlexboxGrid justify="space-between" align="middle" className="mb-10">
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
            <FlexboxGrid.Item className="mr-15">
              <div className="notification-icon">
                <Bell size={18} color="#1c64f2" />
              </div>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <p className="notification-name">{nextPatient.name}</p>
              <p className="notification-room">{nextPatient.room}</p>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Panel>
      )}

      {/* Header moderne */}
      <Header className="app-header">
        <FlexboxGrid justify="space-between" align="middle">
          <FlexboxGrid.Item>
            <FlexboxGrid align="middle">
              <Clock size={22} className="header-icon" />
              <span className="current-time">{currentTime}</span>
              <Divider vertical className="vertical-divider" />
              <Calendar size={20} className="header-icon" />
              <span className="current-date">{currentDate}</span>
              <Divider vertical className="vertical-divider" />
              <span className="center-name">Centre de services</span>
            </FlexboxGrid>
          </FlexboxGrid.Item>

          <FlexboxGrid.Item>
            <h1 className="app-title">SYSTÈME D'ATTENTE</h1>
          </FlexboxGrid.Item>

          <FlexboxGrid.Item>
            <FlexboxGrid align="middle">
              <Badge content={queueItems.length}>
                <Tag color="blue" className="queue-badge">
                  en attente
                </Tag>
              </Badge>
              <Divider vertical className="vertical-divider" />
              <DollarSign size={20} color="#3182ce" />
              <Button 
                appearance="subtle" 
                onClick={() => setShowCurrencies(!showCurrencies)}
                style={{ padding: '0 5px' }}
              >
                {showCurrencies ? 'Masquer devises' : 'Afficher devises'}
              </Button>
            </FlexboxGrid>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Header>

      {/* Message défilant avec transition fade */}
      <div className="message-scroll-bar">
        <FlexboxGrid align="middle" className="message-transition">
          <MessageSquare size={18} className="message-icon" />
          <span className="scroll-message">{scrollMessages[activeMessage]}</span>
        </FlexboxGrid>
      </div>

      {/* Contenu principal */}
      <Content className="main-content">
        <Grid fluid>
          <Row className="full-height">
            {/* Section vidéo avec effet moderne */}
            <Col xs={videoExpanded ? 16 : 12} className="video-column">
              <div className="video-section">
                <Panel shaded bodyFill className="video-container">
                  {renderVideoContent()}

                  {/* Contrôles vidéo */}
                  <div className="video-overlay">
                    <FlexboxGrid justify="space-between" align="bottom">
                      <FlexboxGrid.Item>
                        <h3 className="video-title">
                          {videos[currentVideo].title}
                        </h3>
                        <FlexboxGrid align="middle">
                          <IconButton
                            icon={<Play size={16} />}
                            circle
                            size="sm"
                            className="play-button"
                            onClick={playVideo}
                          />
                          <Tag color="blue" className="live-tag">
                            {videos[currentVideo].type === 'youtube' ? 'YouTube' : 'Vidéo'}
                          </Tag>
                        </FlexboxGrid>
                      </FlexboxGrid.Item>

                      <FlexboxGrid.Item>
                        <IconButton
                          icon={<ChevronRight size={18} className={videoExpanded ? "rotate-180" : ""} />}
                          circle
                          size="sm"
                          className="play-button"
                          onClick={() => setVideoExpanded(!videoExpanded)}
                        />
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </div>
                </Panel>

                {/* Messages importants */}
                <Panel 
                  header={
                    <FlexboxGrid align="middle">
                      <Info size={20} className="panel-header-icon" />
                      <span className="panel-header-text">
                        Informations importantes
                      </span>
                    </FlexboxGrid>
                  } 
                  bordered 
                  className="info-panel"
                >
                  <div className="scrollable-content">
                    <List>
                      <List.Item>
                        <FlexboxGrid align="top">
                          <FlexboxGrid.Item className="mr-10">
                            <div className="circle-icon blue">1</div>
                          </FlexboxGrid.Item>
                          <FlexboxGrid.Item>
                            Veuillez garder votre téléphone allumé pour recevoir les notifications.
                          </FlexboxGrid.Item>
                        </FlexboxGrid>
                      </List.Item>

                      <List.Item>
                        <FlexboxGrid align="top">
                          <FlexboxGrid.Item className="mr-10">
                            <div className="circle-icon blue">2</div>
                          </FlexboxGrid.Item>
                          <FlexboxGrid.Item>
                            Préparez vos documents d'identité et votre numéro de dossier avant l'appel.
                          </FlexboxGrid.Item>
                        </FlexboxGrid>
                      </List.Item>

                      <List.Item>
                        <FlexboxGrid align="top">
                          <FlexboxGrid.Item className="mr-10">
                            <div className="circle-icon blue">3</div>
                          </FlexboxGrid.Item>
                          <FlexboxGrid.Item>
                            L'ordre de passage peut être modifié selon les urgences et les priorités.
                          </FlexboxGrid.Item>
                        </FlexboxGrid>
                      </List.Item>
                    </List>
                  </div>
                </Panel>
              </div>
            </Col>

            {/* File d'attente avec design moderne et devises */}
            <Col xs={videoExpanded ? 8 : 12} className="queue-column">
              <div className="queue-currency-container">
                {/* File d'attente */}
                <Panel bodyFill className="queue-panel queue-panel-half">
                  <div className="queue-header">
                    <h2 className="queue-title">File d'attente actuelle</h2>
                    <p className="queue-subtitle">Mise à jour en temps réel</p>
                  </div>

                  <div className="queue-list-container">
                    <List>
                      {queueItems.map((item, index) => (
                        <List.Item key={item.id}>
                          <Panel
                            bordered
                            className={`queue-item ${index === 0 ? 'active' : ''}`}
                            style={{
                              borderLeftColor: getTypeColor(item.type)
                            }}
                          >
                            <FlexboxGrid justify="space-between" align="middle">
                              <FlexboxGrid.Item>
                                <FlexboxGrid align="middle">
                                  <FlexboxGrid.Item className="mr-15">
                                    <div className={`queue-number ${index === 0 ? 'active' : ''}`}>
                                      {item.id.slice(-2)}
                                    </div>
                                  </FlexboxGrid.Item>

                                  <FlexboxGrid.Item>
                                    <div className="queue-name">{item.name}</div>
                                    <div className={`queue-status ${getStatusColor(item.status)}`}>
                                      {item.status}
                                    </div>
                                  </FlexboxGrid.Item>
                                </FlexboxGrid>
                              </FlexboxGrid.Item>

                              <FlexboxGrid.Item className="text-right">
                                <div className="queue-room">{item.room}</div>
                                <div className="queue-time">{item.estimatedTime} min</div>
                              </FlexboxGrid.Item>
                            </FlexboxGrid>
                          </Panel>
                        </List.Item>
                      ))}
                    </List>
                  </div>

                  {/* Légende */}
                  {/* <div className="queue-legend">
                    <h3 className="legend-title">Légende</h3>
                    <FlexboxGrid>
                      <FlexboxGrid.Item colspan={8}>
                        <FlexboxGrid align="middle">
                          <div className="legend-circle urgent"></div>
                          <span className="legend-text">Urgent</span>
                        </FlexboxGrid>
                      </FlexboxGrid.Item>

                      <FlexboxGrid.Item colspan={8}>
                        <FlexboxGrid align="middle">
                          <div className="legend-circle premium"></div>
                          <span className="legend-text">Premium</span>
                        </FlexboxGrid>
                      </FlexboxGrid.Item>

                      <FlexboxGrid.Item colspan={8}>
                        <FlexboxGrid align="middle">
                          <div className="legend-circle standard"></div>
                          <span className="legend-text">Standard</span>
                        </FlexboxGrid>
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </div> */}
                </Panel>

                {/* Cours des devises avec le nouveau composant slideshow */}
                {showCurrencies && (
                  <Panel bodyFill className="currency-panel-container">
                    <CurrencySlideshow 
                      currencies={currencies}
                      lastUpdate={lastUpdate}
                      updateCurrencyTimestamp={updateCurrencyTimestamp}
                    />
                  </Panel>
                )}
              </div>
            </Col>
          </Row>
        </Grid>
      </Content>

      {/* Footer moderne avec défilement */}
      <Footer className="app-footer">
        <div className="marquee-container">
          <div className="marquee-content">
            Nous vous remercions de votre patience • Les temps d'attente sont estimés et peuvent varier • Pour toute urgence, adressez-vous à l'accueil • Notre équipe fait de son mieux pour réduire votre temps d'attente
          </div>
        </div>
      </Footer>
    </Container>
  );
}