// components/SelectionInfoBar.jsx
import React from 'react';

const SelectionInfoBar = ({ icon, label, value }) => {
  return (
    <div className="selection-info-bar">
      <div className="selection-info-icon">
        {/* {icon} */}
        <img
          src="assets/images/logos/assurance.svg"
          alt="AFG Bank Logo"
          // className="wizard-logo"
          width={50}
        />
      </div>
      <div>
        <div className="selection-info-label">{label}</div>
        <div className="selection-info-value">{value}</div>
      </div>
    </div>
  );
};

export default SelectionInfoBar;