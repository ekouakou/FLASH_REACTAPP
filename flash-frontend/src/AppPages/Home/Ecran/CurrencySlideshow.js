import React from 'react';
import { FlexboxGrid, IconButton } from 'rsuite';
import { DollarSign, RefreshCw } from 'lucide-react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import './queueStyles.css'; // Importation des styles externalisés

function CurrencySlideshow({ currencies, lastUpdate, updateCurrencyTimestamp }) {
    // Options pour le carrousel Splide
    const splideOptions = {
        type: 'loop',
        perPage: 5,
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

    // Fonctions pour simuler des valeurs d'achat et de vente
    const getAchatValue = (currency) => {
        // Simulation de valeurs d'achat basées sur value
        const baseValue = currency.value * 100;
        return Math.round(baseValue * 0.95);
    };

    const getVenteValue = (currency) => {
        // Simulation de valeurs de vente basées sur value
        const baseValue = currency.value * 100;
        return Math.round(baseValue * 1.05);
    };

    return (
        <Splide options={splideOptions} className="currency-splide">
            {currencies.map(currency => (
                <SplideSlide key={currency.code}>
                    <div className="currency-slide-header ">
                        <span className="currency-flag">{currency.icon}</span>
                        <div className="currency-code">{currency.code}</div>
                        <div className="currency-name">{currency.name}</div>
                        {/* <div className="currency-value-box">
                            <small>Achats</small>
                            <div className="currency-value-amount">{getAchatValue(currency)}</div>
                        </div>
                        <div className="currency-value-box">
                            <small>Ventes</small>
                            <div className="currency-value-amount">{getVenteValue(currency)}</div>
                        </div> */}
                    </div>
                </SplideSlide>
            ))}
        </Splide>
    );
}

export default CurrencySlideshow;