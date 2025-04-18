import React, { useState, useEffect } from 'react';
import { FlexboxGrid, Divider, Tag, Badge, Button, IconButton } from 'rsuite';
import { Clock, Calendar, DollarSign, Maximize, Minimize } from 'lucide-react';
import ThemeSwitcher from "../ThemeSwitcher"; // Assurez-vous que ce composant est accessible
import './queueStyles.css'; // Importation des styles externalisés
import useFetchData from '../../../services/useFetchData';


function Header({ currentTime, currentDate, queueItems, showCurrencies, setShowCurrencies }) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    data: fetchedAgenceData,
    error: fetchOperationError,
    loading: fetchOperationLoading,
    refetch: refetchOperations
  } = useFetchData(
    "ConfigurationManager/getAgence",
    {
      mode: "getAgence",
      LG_AGEID: "004"
    }, // On passe null si selectedService est null
  );

  // Gestionnaire du plein écran
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erreur lors du passage en plein écran: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Détecteur de changement d'état plein écran
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  return (
    <header className="app-header">
      <FlexboxGrid justify="space-between" align="middle">
        <FlexboxGrid.Item>
          <FlexboxGrid align="middle">
            <img
              src="https://afgbankcotedivoire.com/wp-content/themes/cdg/images/logo.png"
              alt="AFG Bank Logo"
              className="wizard-logo"
            />
            <Clock size={22} className="header-icon" />
            <span className="current-time">{currentTime}</span>
            <Divider vertical className="vertical-divider" />
            <Calendar size={20} className="header-icon" />
            <span className="current-date">{currentDate}</span>
            {/* <Divider vertical className="vertical-divider" /> */}
            {/* <span className="center-name">Centre de services</span> */}
          </FlexboxGrid>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <FlexboxGrid align="middle">
            {/* <Badge content={queueItems.length}>
              <Tag color="blue" className="queue-badge">
                en attente
              </Tag>
            </Badge> */}
            {/* <Divider vertical className="vertical-divider" /> */}
            {/* <DollarSign size={20} color="#3182ce" /> */}
            {/* <Button
              appearance="subtle"
              onClick={() => setShowCurrencies(!showCurrencies)}
              style={{ padding: '0 5px' }}
            >
              {showCurrencies ? 'Masquer devises' : 'Afficher devises'}
            </Button> */}
            {/* Bouton plein écran */}
            <h1 className="app-title">{fetchedAgenceData?.STR_AGEDESCRIPTION}</h1>
            <Divider vertical className="vertical-divider" />

            <Button
              appearance="subtle"
              onClick={toggleFullScreen}
              title={isFullScreen ? "Quitter le plein écran" : "Plein écran"}
              style={{ padding: '0 5px' }}
            >
              {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </Button>
            <Divider vertical className="vertical-divider" />
            {/* Intégration du ThemeSwitcher */}
            {/* <div className="wizard-client-space">{fetchedAgenceData?.STR_AGEDESCRIPTION}</div> */}
            <ThemeSwitcher />
          </FlexboxGrid>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </header>
  );
}

export default Header;