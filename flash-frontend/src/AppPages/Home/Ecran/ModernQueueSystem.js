import React, { useState, useEffect, useRef } from "react";
import { Container, Grid, Row, Col, Panel } from "rsuite";
import "rsuite/dist/rsuite.min.css";

// Import des composants
import Header from "./Header";
import ScrollingMessage from "./ScrollingMessage";
import VideoSection from "./VideoSection2";
import AutoSlideshow from "./AutoSlideshow";
import InfoPanel from "./InfoPanel";
import QueueList from "./QueueList";
import CurrencySlideshow from "./CurrencySlideshow";
import NotificationBar from "./NotificationBar";
import Footer from "./Footer";

// Import des styles
import "./queueStyles.css"; // Importation des styles externalisés

function ModernQueueSystem() {
  const [currentTime, setCurrentTime] = useState("00:00");
  const [currentDate, setCurrentDate] = useState("");
  const [currentVideo, setCurrentVideo] = useState(0);
  const [activeMessage, setActiveMessage] = useState(0);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [nextPatient, setNextPatient] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCurrencies, setShowCurrencies] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const videoRef = useRef(null);

  // Données simulées
  const [queueItems] = useState([
  ]);

  // Données des devises
  const [currencies] = useState([
    {
      code: "JPY",
      name: "Cours du Yen",
      value: 0.0061,
      change: -0.2,
      icon: "🇯🇵",
    },
    { code: "EUR", name: "Cours de l'Euro", value: 1.0, change: 0, icon: "🇪🇺" },
    {
      code: "USD",
      name: "Cours du dollar",
      value: 0.92,
      change: +0.3,
      icon: "🇺🇸",
    },
    {
      code: "CAD",
      name: "Dollar Canadien",
      value: 0.68,
      change: -0.4,
      icon: "🇨🇦",
    },
    {
      code: "GBP",
      name: "Livre Sterling",
      value: 1.18,
      change: +0.5,
      icon: "🇬🇧",
    },
    {
      code: "CHF",
      name: "Franc suisse",
      value: 1.02,
      change: +0.1,
      icon: "🇨🇭",
    },
    { code: "EUR", name: "Cours de l'Euro", value: 1.0, change: 0, icon: "🇪🇺" },
    {
      code: "USD",
      name: "Cours du dollar",
      value: 0.92,
      change: +0.3,
      icon: "🇺🇸",
    },
    {
      code: "CAD",
      name: "Dollar Canadien",
      value: 0.68,
      change: -0.4,
      icon: "🇨🇦",
    },
    {
      code: "GBP",
      name: "Livre Sterling",
      value: 1.18,
      change: +0.5,
      icon: "🇬🇧",
    },
    {
      code: "CHF",
      name: "Franc suisse",
      value: 1.02,
      change: +0.1,
      icon: "🇨🇭",
    },
  ]);

  const scrollMessages = [
    "Bienvenue dans notre centre. N'hésitez pas à demander de l'aide à nos conseillers.",
    "Merci de respecter les règles sanitaires et la distanciation sociale.",
    "Pour une meilleure expérience, veuillez préparer vos documents avant votre rendez-vous.",
    "Nos équipes sont mobilisées pour réduire votre temps d'attente.",
  ];

  // Collection de vidéos avec différents types (fichiers locaux ou YouTube)
  const videos = [
    {
      id: 1,
      title: "Guide d'utilisation de l'espace client",
      source:
        "https://afgbankcotedivoire.com/wp-content/uploads/2023/11/Slide-afg-bank7.jpg", // Fichier local
      type: "Bannière",
    },
    {
      id: 2,
      title: "Guide d'utilisation de l'espace client",
      source:
        "https://visme.co/blog/wp-content/uploads/2020/02/Animate-your-social-media-posts-1.gif", // Fichier local
      type: "Bannière",
    },
    {
      id: 3,
      title: "Notre équipe médicale",
      source: "https://www.youtube.com/embed/5nw0r8dWdm4?si=-63radQmWFIC0Pie", // Lien YouTube (exemple)
      type: "youtube",
    },
    {
      id: 4,
      title: "équipe médicale",
      source: "https://www.youtube.com/embed/-caOEWTRCC0?si=5-17QsdsvorwWhsO", // Lien YouTube (exemple)
      type: "youtube",
    },
  ];

  // Mise à jour de l'heure et de la date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Format de l'heure
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}`);

      // Format de la date
      const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      setCurrentDate(now.toLocaleDateString("fr-FR", options));
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
      setActiveMessage((prev) => (prev + 1) % scrollMessages.length);
    }, 8000);
    return () => clearInterval(messageInterval);
  }, [scrollMessages.length]);

  // Gestion de la lecture des vidéos
  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.addEventListener("ended", handleVideoEnd);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("ended", handleVideoEnd);
      }
    };
  }, [isPlaying, currentVideo]);

  // Mise à jour du timestamp des devises
  const updateCurrencyTimestamp = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    setLastUpdate(`${hours}:${minutes}:${seconds}`);
  };

  // Gestion de la fin de vidéo pour passer à la suivante
  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  // Lecture de la vidéo
  const playVideo = () => {
    if (videoRef.current && videos[currentVideo].type === "local") {
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
      const randomIndex = Math.floor(
        Math.random() * queueItems.slice(1, 3).length
      );
      setNextPatient(queueItems[randomIndex + 1]);
      setShowNotification(true);

      // Masquer la notification après 10 secondes
      setTimeout(() => {
        setShowNotification(false);
      }, 10000);
    }, 30000);

    return () => clearInterval(notificationInterval);
  }, [queueItems]);

  return (
    <Container className="main-container">
      {/* Notification popup */}
      {showNotification && nextPatient && (
        <NotificationBar nextPatient={nextPatient} voiceGender="male" />

        // <NotificationBar
        //   nextPatient={nextPatient}
        //   setShowNotification={setShowNotification}
        // />
      )}

      {/* Header moderne */}
      <Header
        currentTime={currentTime}
        currentDate={currentDate}
        queueItems={queueItems}
        showCurrencies={showCurrencies}
        setShowCurrencies={setShowCurrencies}
      />

      {/* Message défilant avec transition fade */}
      <ScrollingMessage
        message={scrollMessages[activeMessage]}
        currencies={currencies}
        lastUpdate={lastUpdate}
        updateCurrencyTimestamp={updateCurrencyTimestamp}
      />

      {/* Contenu principal */}
      <div className="main-content">
        <Grid fluid>
          <Row className="full-height">
            {/* Section vidéo avec effet moderne */}
            <Col xs={videoExpanded ? 20 : 18} className="video-column">
              <div className="video-section">
                <VideoSection
                  videos={videos}
                  videoExpanded={videoExpanded}
                  setVideoExpanded={setVideoExpanded}
                />
              </div>
            </Col>

            {/* File d'attente avec design moderne et devises */}
            <Col xs={videoExpanded ? 4 : 6} className="queue-column">
              <div className="queue-currency-container">
                {/* File d'attente */}
                <QueueList
                  queueItems={queueItems}
                  voiceLanguage="fr-FR"
                  voiceGender="female"
                />
              </div>
            </Col>
          </Row>
        </Grid>
        {/* <InfoPanel /> */}
      </div>

      {/* Footer moderne avec défilement */}
      <Footer />
    </Container>
  );
}

export default ModernQueueSystem;
