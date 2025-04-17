// components/WizardNavbar.js
import React, { useState, useEffect } from 'react';
import ThemeSwitcher from "./ThemeSwitcher";

const WizardNavbar = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);
      const [currentTime, setCurrentTime] = useState('');


      useEffect(() => {
          // Générer un numéro de ticket aléatoire mais consistant
      
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
    
  
  // Gestion du plein écran
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
  
    // Effets
    useEffect(() => {
      const handleFullScreenChange = () => {
        setIsFullScreen(!!document.fullscreenElement);
      };
  
      document.addEventListener('fullscreenchange', handleFullScreenChange);
  
      return () => {
        document.removeEventListener('fullscreenchange', handleFullScreenChange);
      };
    }, []);

  return (
    <>
      <div className="wizard-nav mb-2 rounded-top">
        <div className="wizard-nav-content">
          <div className="wizard-logo-container">
            <img
              src="https://afgbankcotedivoire.com/wp-content/themes/cdg/images/logo.png"
              alt="AFG Bank Logo"
              className="wizard-logo"
            />
          </div>
          <div className="wizard-nav-right">
            <div
              className="me-2"
              onClick={toggleFullScreen}
              title={isFullScreen ? "Quitter le plein écran" : "Plein écran"}
            >
              <span className="wizard-fullscreen-icon">⛶</span>
            </div>

            <ThemeSwitcher />

            <div className="wizard-time-display">
              <small className="wizard-time-label">Heure actuelle</small>
              <div className="wizard-time-value">{currentTime}</div>
            </div>

            <div className="wizard-client-space">Espace Client</div>
          </div>
        </div>
      </div>

      {/* <h1 className="wizard-title">
        Bienvenue dans notre service
        </h1> */}
    </>
  );
};

export default WizardNavbar;
