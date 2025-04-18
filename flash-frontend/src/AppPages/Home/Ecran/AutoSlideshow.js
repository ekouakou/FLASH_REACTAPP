// src/components/VideoSection.js
import React from 'react';
import { Panel, FlexboxGrid, IconButton, Tag } from 'rsuite';
import { Play, ChevronRight, Image } from 'lucide-react';
import './queueStyles.css'; // Importation des styles externalisés

function VideoSection({ currentVideo, videos, videoRef, isPlaying, playVideo, videoExpanded, setVideoExpanded }) {
    const renderVideoContent = () => {
        const video = videos[currentVideo];

        if (video.type === 'youtube') {
            return (
                <iframe
                    src={video.source}
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
                                    icon={<Play size={16} />}
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
    );
}

export default VideoSection;