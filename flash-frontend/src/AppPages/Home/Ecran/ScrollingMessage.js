// src/components/ScrollingMessage.js
import React from 'react';
import { FlexboxGrid } from 'rsuite';
import { MessageSquare } from 'lucide-react';
import './queueStyles.css'; // Importation des styles externalisés
import CurrencySlideshow from './CurrencySlideshow'


function ScrollingMessage({ message, currencies, lastUpdate, updateCurrencyTimestamp  }) {
    return (
        <div className="message-scroll-bar">
            <FlexboxGrid align="middle" className="message-transition">
                <CurrencySlideshow
                    currencies={currencies}
                    lastUpdate={lastUpdate}
                    updateCurrencyTimestamp={updateCurrencyTimestamp}
                />
                {/* <MessageSquare size={18} className="message-icon" />
        <span className="scroll-message">{message}</span> */}
            </FlexboxGrid>
        </div>
    );
}

export default ScrollingMessage;
