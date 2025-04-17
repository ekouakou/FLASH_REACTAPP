// components/WizardNavbar.js
import React from "react";

const WizardFooter = () => {
  return (
    <>
      {/* Section bas de page */}
      <div className="wizard-footer">
            <p className="wizard-copyright">
              &copy; {new Date().getFullYear()} AFG Bank Côte d'Ivoire - Tous droits réservés
            </p>
          </div>
    </>
  );
};

export default WizardFooter;
