import React, { useEffect, useState, useRef } from "react";
import { Panel, FlexboxGrid, IconButton, Tag } from "rsuite";
import "./queueStyles.css";
import useFetchData from "../../../services/useFetchData";

function VideoSectionAuto({
  videos,
  initialVideoIndex = 0,
  videoExpanded,
  setVideoExpanded,
}) {
  const [currentVideo, setCurrentVideo] = useState(initialVideoIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // État pour suivre si le son est coupé
  const videoRef = useRef(null);
  const youtubePlayerRef = useRef(null);
  const youtubeIframeRef = useRef(null);
  const timerRef = useRef(null);
  const tempDivRef = useRef(null);
  const bannerDisplayTime = 5000; // 5 secondes pour les bannières

  const serviceParams = {
    search_value: "",
    LG_TYLID: "MULTIMEDIA",
    mode: "listAgenceListe",
    order: "t.lgLstid.strLstothervalue2",
    LG_AGEID: "004",
  };

  // Utilisation du hook pour récupérer les services
  const {
    data: fetchedPubData,
    error: fetchServiceError,
    loading: fetchServiceLoading,
    refetch: refetchServices,
  } = useFetchData(
    "ConfigurationManager/listAgenceListe",
    serviceParams,
    "data"
  );

  console.log("fetchedCoursDeviseData");
  console.log(fetchedPubData);

  // Gestion du changement de contenu
  const nextVideo = () => {
    if (fetchedPubData && fetchedPubData.length > 0) {
      setCurrentVideo((prev) => (prev + 1) % fetchedPubData.length);
    }
  };

  // Fonction pour démarrer la lecture d'une vidéo
  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((e) => console.error("Erreur de lecture automatique:", e));
      setIsPlaying(true);
    }
  };

  // Fonction pour couper/rétablir le son d'une vidéo SANS recharger la vidéo
  const toggleMute = () => {
    // Pour les vidéos locales
    if (videoRef.current && fetchedPubData && fetchedPubData[currentVideo].STR_LSTOTHERVALUE4 === "v") {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
    
    // Pour les vidéos YouTube via postMessage API
    else if (fetchedPubData && fetchedPubData[currentVideo].STR_LSTOTHERVALUE4 === "y" && youtubeIframeRef.current) {
      try {
        const newMuteState = !isMuted;
        const iframe = youtubeIframeRef.current;
        const command = newMuteState ? '{"event":"command","func":"mute","args":""}' : '{"event":"command","func":"unMute","args":""}';
        
        iframe.contentWindow.postMessage(command, '*');
        setIsMuted(newMuteState);
      } catch (e) {
        console.error("Erreur lors de la modification du son YouTube:", e);
      }
    }
  };

  // Fonction pour extraire l'ID YouTube d'une URL
  const getYoutubeIdFromUrl = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Initialisation de l'API YouTube Player
  useEffect(() => {
    // Chargement de l'API YouTube IFrame si elle n'est pas déjà chargée
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";

      window.onYouTubeIframeAPIReady = () => {
        console.log("YouTube API ready");
      };

      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Effet pour gérer le défilement automatique des contenus
  useEffect(() => {
    // Vérifier si les données sont chargées
    if (!fetchedPubData || fetchedPubData.length === 0 || fetchServiceLoading) {
      return;
    }

    const video = fetchedPubData[currentVideo];
    if (!video) return;

    // Nettoyer tout timer existant
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Nettoyer le div temporaire s'il existe
    if (tempDivRef.current && document.body.contains(tempDivRef.current)) {
      document.body.removeChild(tempDivRef.current);
      tempDivRef.current = null;
    }

    // Configuration du timer en fonction du type de contenu
    if (video.STR_LSTOTHERVALUE4 === "b") {
      // Pour les bannières, attendre 5 secondes puis passer à la suivante
      timerRef.current = setTimeout(() => {
        nextVideo();
      }, bannerDisplayTime);
    } else if (video.STR_LSTOTHERVALUE4 === "v") {
      // Pour les vidéos locales
      if (videoRef.current) {
        // Appliquer l'état du son actuel sans recharger la vidéo
        videoRef.current.muted = isMuted;
        
        // Lancer la lecture automatique
        videoRef.current.play().catch((e) => {
          console.error("Erreur de lecture automatique:", e);
          // Si la lecture automatique échoue, on passe au contenu suivant après un délai
          timerRef.current = setTimeout(nextVideo, 2000);
        });

        // Obtenir la durée de la vidéo une fois que les métadonnées sont chargées
        const handleMetadataLoaded = () => {
          if (videoRef.current) {
            const videoDuration = videoRef.current.duration * 1000; // Convertir en millisecondes
            console.log(`Durée de la vidéo locale: ${videoDuration}ms`);

            // Configurer le timer pour passer à la vidéo suivante à la fin de la durée
            timerRef.current = setTimeout(() => {
              nextVideo();
            }, videoDuration);
          }
        };

        // Ajouter l'écouteur pour l'événement loadedmetadata
        videoRef.current.addEventListener(
          "loadedmetadata",
          handleMetadataLoaded
        );

        // Nettoyer l'écouteur lors du démontage
        return () => {
          if (videoRef.current) {
            videoRef.current.removeEventListener(
              "loadedmetadata",
              handleMetadataLoaded
            );
          }
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
        };
      }
    } else if (video.STR_LSTOTHERVALUE4 === "y") {
      // Pour les vidéos YouTube, on utilise le timeout pour passer à la suivante
      // La durée sera déterminée soit par l'API YouTube soit par une valeur par défaut
      
      // Délai par défaut pour les vidéos YouTube (30 secondes)
      const defaultYoutubeDelay = 30000;
      
      // Configurer le timer pour passer à la vidéo suivante après le délai par défaut
      timerRef.current = setTimeout(() => {
        nextVideo();
      }, defaultYoutubeDelay);
      
      // Essayer d'obtenir la durée réelle via l'API YouTube
      if (window.YT && window.YT.Player) {
        // On va utiliser l'API YouTube pour obtenir la durée de la vidéo
        try {
          // Extraire l'ID de la vidéo YouTube
          const youtubeId = getYoutubeIdFromUrl(video.STR_LSTOTHERVALUE3);
          
          if (youtubeId) {
            // Créer une div temporaire pour le player YouTube (pour obtenir les métadonnées)
            const tempYoutubeDiv = document.createElement("div");
            tempYoutubeDiv.id = "temp-youtube-player";
            tempYoutubeDiv.style.display = "none";
            document.body.appendChild(tempYoutubeDiv);
            tempDivRef.current = tempYoutubeDiv;
            
            // Initialiser un player temporaire pour obtenir la durée de la vidéo
            const tempPlayer = new window.YT.Player(
              "temp-youtube-player",
              {
                videoId: youtubeId,
                events: {
                  onReady: (event) => {
                    // Annuler le timer par défaut
                    if (timerRef.current) {
                      clearTimeout(timerRef.current);
                    }
                    
                    // Obtenir la durée réelle de la vidéo
                    const duration = event.target.getDuration() * 1000;
                    console.log(`Durée réelle de la vidéo YouTube: ${duration}ms`);
                    
                    // Configurer le nouveau timer avec la durée réelle
                    timerRef.current = setTimeout(() => {
                      nextVideo();
                    }, duration);
                    
                    // Nettoyer le player temporaire
                    if (tempDivRef.current && document.body.contains(tempDivRef.current)) {
                      document.body.removeChild(tempDivRef.current);
                      tempDivRef.current = null;
                    }
                    
                    // Détruire le player temporaire
                    try {
                      tempPlayer.destroy();
                    } catch (e) {
                      console.error("Erreur lors de la destruction du player YouTube temporaire:", e);
                    }
                  },
                  onError: (event) => {
                    console.error("Erreur YouTube Player:", event);
                    // Le timer par défaut est déjà configuré, pas besoin de le réinitialiser
                    
                    // Nettoyer le player temporaire
                    if (tempDivRef.current && document.body.contains(tempDivRef.current)) {
                      document.body.removeChild(tempDivRef.current);
                      tempDivRef.current = null;
                    }
                  }
                }
              }
            );
          }
        } catch (error) {
          console.error("Erreur lors de l'initialisation du player YouTube:", error);
          // Le timer par défaut est déjà configuré, pas besoin de le réinitialiser
        }
      } else {
        console.warn("API YouTube pas encore chargée, utilisation du délai par défaut");
        // Le timer par défaut est déjà configuré, pas besoin de le réinitialiser
      }
    }

    // Nettoyage à la désinstallation du composant ou au changement de vidéo
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Nettoyer le div temporaire s'il existe
      if (tempDivRef.current && document.body.contains(tempDivRef.current)) {
        document.body.removeChild(tempDivRef.current);
        tempDivRef.current = null;
      }

      // Nettoyer le player YouTube s'il existe
      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy();
        } catch (e) {
          console.error("Erreur lors de la destruction du player YouTube:", e);
        }
        youtubePlayerRef.current = null;
      }
    };
  }, [currentVideo, fetchedPubData, fetchServiceLoading]); // Important: On a retiré isMuted des dépendances

  // Effet séparé pour gérer l'événement 'ended' des vidéos locales
  useEffect(() => {
    // Vérifier si les données sont chargées
    if (!fetchedPubData || fetchedPubData.length === 0 || fetchServiceLoading) {
      return;
    }

    // Ne s'applique qu'aux vidéos locales
    if (fetchedPubData[currentVideo].STR_LSTOTHERVALUE4 !== "v") return;

    // Fonction pour passer à la vidéo suivante quand celle-ci est terminée
    const handleVideoEnd = () => {
      nextVideo();
    };

    // Ajouter l'écouteur d'événement
    const currentVideoElement = videoRef.current;
    if (currentVideoElement) {
      currentVideoElement.addEventListener("ended", handleVideoEnd);
    }

    // Nettoyer l'écouteur d'événement quand le composant est démonté ou quand la vidéo change
    return () => {
      if (currentVideoElement) {
        currentVideoElement.removeEventListener("ended", handleVideoEnd);
      }
    };
  }, [currentVideo, fetchedPubData, fetchServiceLoading]);

  // Effet pour appliquer l'état du son sans recharger les vidéos
  useEffect(() => {
    if (!fetchedPubData || fetchedPubData.length === 0) return;
    
    const videoType = fetchedPubData[currentVideo]?.STR_LSTOTHERVALUE4;
    
    // Pour les vidéos locales
    if (videoType === "v" && videoRef.current) {
      videoRef.current.muted = isMuted;
    }
    
    // Pour les vidéos YouTube déjà chargées
    if (videoType === "y" && youtubeIframeRef.current) {
      try {
        const iframe = youtubeIframeRef.current;
        const command = isMuted 
          ? '{"event":"command","func":"mute","args":""}' 
          : '{"event":"command","func":"unMute","args":""}';
        
        iframe.contentWindow.postMessage(command, '*');
      } catch (e) {
        console.error("Erreur lors de la modification du son YouTube via postMessage:", e);
      }
    }
  }, [isMuted, fetchedPubData, currentVideo]);

  const renderVideoContent = () => {
    // Vérifier si les données sont chargées
    if (!fetchedPubData || fetchedPubData.length === 0) {
      return <div className="loading-container">Chargement des médias...</div>;
    }

    const video = fetchedPubData[currentVideo];

    if (video.STR_LSTOTHERVALUE4 === "y") {
      // Ajouter les paramètres pour l'API YouTube
      const youtubeId = getYoutubeIdFromUrl(video.STR_LSTOTHERVALUE3);
      if (!youtubeId) {
        return <div className="error-container">ID YouTube invalide</div>;
      }
      
      // Inclure enablejsapi=1 pour permettre l'utilisation de postMessage
      const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&enablejsapi=1&origin=${window.location.origin}&mute=1`;

      return (
        <iframe
          ref={youtubeIframeRef}
          src={youtubeEmbedUrl}
          title={video.STR_LSTDESCRIPTION}
          className="video-frame"
          frameBorder="0"
          height="500px"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    } else if (video.STR_LSTOTHERVALUE4 === "b") {
      return (
        <div className="banner-container">
          <img src={video.STR_LSTOTHERVALUE3} alt={video.STR_LSTDESCRIPTION} className="banner-image" />
        </div>
      );
    } else {
      return (
        <video
          ref={videoRef}
          src={video.STR_LSTOTHERVALUE3}
          className="video-frame"
          poster="/api/placeholder/640/360"
          preload="auto"
          muted={isMuted}
        />
      );
    }
  };

  // Rendu du composant principal
  if (fetchServiceLoading) {
    return <div className="loading-container">Chargement des médias...</div>;
  }

  if (fetchServiceError) {
    return <div className="error-container">Erreur de chargement des médias</div>;
  }

  if (!fetchedPubData || fetchedPubData.length === 0) {
    return <div className="error-container">Aucun média disponible</div>;
  }

  const currentVideoItem = fetchedPubData[currentVideo];
  const showPlayButton = currentVideoItem && currentVideoItem.STR_LSTOTHERVALUE4 !== "b";
  const showMuteButton = currentVideoItem && (currentVideoItem.STR_LSTOTHERVALUE4 === "v" || currentVideoItem.STR_LSTOTHERVALUE4 === "y");

  return (
    <Panel shaded bodyFill className="video-container">
      {renderVideoContent()}
      <div className="video-overlay">
        <FlexboxGrid justify="space-between" align="bottom">
          <FlexboxGrid.Item>
            <h3 className="video-title">{currentVideoItem.STR_LSTDESCRIPTION}</h3>
            <FlexboxGrid align="middle">
              {showPlayButton && (
                <IconButton
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  }
                  circle
                  size="sm"
                  className="play-button"
                  onClick={playVideo}
                />
              )}
              {/* Bouton pour couper/rétablir le son */}
              {showMuteButton && (
                <IconButton
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {isMuted ? (
                        <>
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <line x1="23" y1="9" x2="17" y2="15" />
                          <line x1="17" y1="9" x2="23" y2="15" />
                        </>
                      ) : (
                        <>
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </>
                      )}
                    </svg>
                  }
                  circle
                  size="sm"
                  className="mute-button"
                  onClick={toggleMute}
                />
              )}
              <Tag
                color={currentVideoItem.STR_LSTOTHERVALUE4 === "b" ? "green" : "blue"}
                className="content-tag"
              >
                {currentVideoItem.STR_LSTOTHERVALUE4 === "y"
                  ? "YouTube"
                  : currentVideoItem.STR_LSTOTHERVALUE4 === "b"
                  ? "Bannière"
                  : "Vidéo"}
              </Tag>
            </FlexboxGrid>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <IconButton
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={videoExpanded ? "rotate-180" : ""}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              }
              circle
              size="sm"
              className="expand-button"
              onClick={() => setVideoExpanded(!videoExpanded)}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </div>
    </Panel>
  );
}

export default VideoSectionAuto;