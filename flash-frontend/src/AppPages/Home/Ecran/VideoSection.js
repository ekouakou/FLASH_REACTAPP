import React, { useEffect, useState, useRef } from 'react';
import { Panel, FlexboxGrid, IconButton, Tag } from 'rsuite';
import './queueStyles.css';

function VideoSectionAuto({ videos, initialVideoIndex = 0, videoExpanded, setVideoExpanded }) {
    const [currentVideo, setCurrentVideo] = useState(initialVideoIndex);
    const [isPlaying, setIsPlaying] = useState(true);
    const videoRef = useRef(null);
    const youtubePlayerRef = useRef(null);
    const timerRef = useRef(null);
    const tempDivRef = useRef(null);
    const bannerDisplayTime = 5000; // 5 secondes pour les bannières

    // Gestion du changement de contenu
    const nextVideo = () => {
        setCurrentVideo((prev) => (prev + 1) % videos.length);
    };

    // Fonction pour démarrer la lecture d'une vidéo
    const playVideo = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.error("Erreur de lecture automatique:", e));
            setIsPlaying(true);
        }
    };

    // Fonction pour extraire l'ID YouTube d'une URL
    const getYoutubeIdFromUrl = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Initialisation de l'API YouTube Player
    useEffect(() => {
        // Chargement de l'API YouTube IFrame si elle n'est pas déjà chargée
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';

            window.onYouTubeIframeAPIReady = () => {
                console.log('YouTube API ready');
            };

            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }, []);

    // Effet pour gérer le défilement automatique des contenus
    useEffect(() => {
        const video = videos[currentVideo];

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
        if (video.type === 'Bannière') {
            // Pour les bannières, attendre 5 secondes puis passer à la suivante
            timerRef.current = setTimeout(() => {
                nextVideo();
            }, bannerDisplayTime);
        } else if (video.type === 'local') {
            // Pour les vidéos locales
            if (videoRef.current) {
                // Lancer la lecture automatique
                videoRef.current.play().catch(e => {
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
                videoRef.current.addEventListener('loadedmetadata', handleMetadataLoaded);

                // Nettoyer l'écouteur lors du démontage
                return () => {
                    if (videoRef.current) {
                        videoRef.current.removeEventListener('loadedmetadata', handleMetadataLoaded);
                    }
                    if (timerRef.current) {
                        clearTimeout(timerRef.current);
                    }
                };
            }
        } else if (video.type === 'youtube') {
            // Pour les vidéos YouTube, utiliser l'API YouTube IFrame
            if (window.YT && window.YT.Player) {
                // Extraire l'ID de la vidéo YouTube à partir de l'URL
                const youtubeId = getYoutubeIdFromUrl(video.source);

                if (youtubeId) {
                    try {
                        // Créer une div temporaire pour le player YouTube (elle sera remplacée par l'iframe)
                        const tempYoutubeDiv = document.createElement('div');
                        tempYoutubeDiv.id = 'temp-youtube-player';
                        tempYoutubeDiv.style.display = 'none';
                        document.body.appendChild(tempYoutubeDiv);
                        tempDivRef.current = tempYoutubeDiv; // Stocker la référence pour le nettoyage ultérieur

                        // Initialiser le player YouTube
                        youtubePlayerRef.current = new window.YT.Player('temp-youtube-player', {
                            videoId: youtubeId,
                            events: {
                                onReady: (event) => {
                                    // Obtenir la durée de la vidéo YouTube en secondes
                                    const duration = event.target.getDuration() * 1000; // Convertir en millisecondes
                                    console.log(`Durée de la vidéo YouTube: ${duration}ms`);
                                    // Configurer le timer pour passer à la vidéo suivante 1 seconde avant la fin
                                    timerRef.current = setTimeout(() => {
                                        nextVideo();
                                    }, duration - 3000);
                                    console.log(`Durée de la vidéo YouTube------->: ${duration - 3000}ms`);

                                    // Nettoyer le player temporaire seulement s'il existe encore dans le DOM
                                    if (tempDivRef.current && document.body.contains(tempDivRef.current)) {
                                        document.body.removeChild(tempDivRef.current);
                                        tempDivRef.current = null;
                                    }
                                },
                                onError: (event) => {
                                    console.error('Erreur YouTube Player:', event);
                                    // En cas d'erreur, passer à la vidéo suivante après un délai
                                    timerRef.current = setTimeout(nextVideo, 2000);

                                    // Nettoyer le player temporaire seulement s'il existe encore dans le DOM
                                    if (tempDivRef.current && document.body.contains(tempDivRef.current)) {
                                        document.body.removeChild(tempDivRef.current);
                                        tempDivRef.current = null;
                                    }
                                }
                            }
                        });
                    } catch (error) {
                        console.error('Erreur lors de l\'initialisation du player YouTube:', error);
                        // En cas d'erreur, utiliser un délai par défaut
                        timerRef.current = setTimeout(nextVideo, 30000);

                        // Nettoyer le player temporaire en cas d'erreur
                        if (tempDivRef.current && document.body.contains(tempDivRef.current)) {
                            document.body.removeChild(tempDivRef.current);
                            tempDivRef.current = null;
                        }
                    }
                } else {
                    console.error('ID YouTube invalide pour:', video.source);
                    // En cas d'ID YouTube invalide, utiliser un délai par défaut
                    timerRef.current = setTimeout(nextVideo, 30000);
                }
            } else {
                console.warn('API YouTube pas encore chargée, utilisation d\'un délai par défaut');
                // Si l'API YouTube n'est pas encore chargée, utiliser un délai par défaut
                timerRef.current = setTimeout(() => {
                    nextVideo();
                }, 30000);
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
                    console.error('Erreur lors de la destruction du player YouTube:', e);
                }
                youtubePlayerRef.current = null;
            }
        };
    }, [currentVideo, videos]);

    // Effet séparé pour gérer l'événement 'ended' des vidéos locales
    useEffect(() => {
        // Ne s'applique qu'aux vidéos locales
        if (videos[currentVideo].type !== 'local') return;

        // Fonction pour passer à la vidéo suivante quand celle-ci est terminée
        const handleVideoEnd = () => {
            nextVideo();
        };

        // Ajouter l'écouteur d'événement
        const currentVideoElement = videoRef.current;
        if (currentVideoElement) {
            currentVideoElement.addEventListener('ended', handleVideoEnd);
        }

        // Nettoyer l'écouteur d'événement quand le composant est démonté ou quand la vidéo change
        return () => {
            if (currentVideoElement) {
                currentVideoElement.removeEventListener('ended', handleVideoEnd);
            }
        };
    }, [currentVideo]); // Cette dépendance assure que l'effet est réexécuté à chaque changement de vidéo

    const renderVideoContent = () => {
        const video = videos[currentVideo];

        if (video.type === 'youtube') {
            // Ajouter les paramètres autoplay=1 et enablejsapi=1 pour l'API YouTube
            const youtubeId = getYoutubeIdFromUrl(video.source);
            const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&enablejsapi=1`;

            return (
                <iframe
                    src={youtubeEmbedUrl}
                    title={video.title}
                    className="video-frame"
                    frameBorder="0"
                    height="500px"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            );
        } else if (video.type === 'Bannière') {
            return (
                <div className="banner-container">
                    <img
                        src={video.source}
                        alt={video.title}
                        className="banner-image"
                    />
                </div>
            );
        } else {
            return (
                <video
                    ref={videoRef}
                    src={video.source}
                    className="video-frame"
                    poster="/api/placeholder/640/360"
                    preload="auto"
                />
            );
        }
    };

    const currentVideoItem = videos[currentVideo];
    const showPlayButton = currentVideoItem.type !== 'Bannière';

    return (
        <Panel shaded bodyFill className="video-container">
            {renderVideoContent()}
            <div className="video-overlay">
                <FlexboxGrid justify="space-between" align="bottom">
                    <FlexboxGrid.Item>
                        <h3 className="video-title">
                            {currentVideoItem.title}
                        </h3>
                        <FlexboxGrid align="middle">
                            {showPlayButton && (
                                <IconButton
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                    }
                                    circle
                                    size="sm"
                                    className="play-button"
                                    onClick={playVideo}
                                />
                            )}
                            <Tag color={currentVideoItem.type === 'Bannière' ? 'green' : 'blue'} className="content-tag">
                                {currentVideoItem.type === 'youtube' ? 'YouTube' :
                                    currentVideoItem.type === 'Bannière' ? 'Bannière' : 'Vidéo'}
                            </Tag>
                        </FlexboxGrid>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item>
                        <IconButton
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={videoExpanded ? "rotate-180" : ""}>
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