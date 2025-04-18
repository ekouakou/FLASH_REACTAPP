import React from 'react';
import './queueStyles.css'; // Importation des styles externalisés

function Footer() {
  return (
    <footer className="app-footer">
      <div className="marquee-container">
        <div className="marquee-content">
          Nous vous remercions de votre patience • Les temps d'attente sont estimés et peuvent varier • Pour toute urgence, adressez-vous à l'accueil • Notre équipe fait de son mieux pour réduire votre temps d'attente
        </div>
      </div>
    </footer>
  );
}

export default Footer;