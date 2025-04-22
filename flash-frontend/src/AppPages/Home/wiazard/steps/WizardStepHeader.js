// components/WizardStepHeader.jsx

import React from 'react';
import PropTypes from 'prop-types';

const WizardStepHeader = ({ title, description }) => {
  return (
    <div className="wizard-step-header">
      <h4 className="wizard-step-title">{title}</h4>
      <p className="wizard-step-description">{description}</p>
    </div>
  );
};

WizardStepHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default WizardStepHeader;
