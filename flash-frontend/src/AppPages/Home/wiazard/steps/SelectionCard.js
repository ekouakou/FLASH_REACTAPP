// components/SelectionCard.jsx
import React from 'react';
import { serviceIcons } from '../VerticalTicketWizard';

const SelectionCard = ({ 
  item, 
  isSelected, 
  disabled, 
  onSelect, 
  icon, 
  type = 'service' // 'service' ou 'operation'
}) => {
  const displayIcon = type === 'service' ? serviceIcons[icon] : icon;
  
  return (
    <div
      onClick={onSelect}
      className={`selection-card ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      style={{
        borderColor: isSelected ? item.color : '',
        backgroundColor: isSelected ? `${item.color}15` : ''
      }}
      role="button"
      aria-pressed={isSelected}
      aria-label={`${type === 'service' ? 'Service' : 'Opération'} ${item.name}: ${item.description}`}
    >
      {isSelected && (
        <div className="selection-check" style={{ backgroundColor: item.color }}>✓</div>
      )}
      <div className="selection-icon-container" style={{ color: isSelected ? item.color : '' }}>
        {displayIcon}
      </div>
      <h4 className="selection-title" style={{ color: isSelected ? item.color : '' }}>
        {item.name}
      </h4>
      <p className="selection-description">{item.description}</p>
    </div>
  );
};

export default SelectionCard;