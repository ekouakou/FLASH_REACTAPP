import React, { useState, useEffect } from 'react';
import ThemeSwitcher from "./ThemeSwitcher";
import useFetchData from '../../services/useFetchData';


const WizardNavbar = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      }));
      setCurrentDate(now.toLocaleDateString('fr-FR')); // <- format 11/12/2025

      // setCurrentDate(now.toLocaleDateString('fr-FR', {
      //   weekday: 'long',
      //   year: 'numeric',
      //   month: 'long',
      //   day: 'numeric'
      // }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // mise à jour toutes les minutes

    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
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

            <div className="wizard-time-display text-end">
              <small className="wizard-date-label">{currentDate}</small><br />
              {/* <small className="wizard-time-label">Heure actuelle</small> */}
              <div className="wizard-time-value">{currentTime}</div>
            </div>

            <div className="wizard-client-space">{fetchedAgenceData?.STR_AGEDESCRIPTION}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WizardNavbar;
