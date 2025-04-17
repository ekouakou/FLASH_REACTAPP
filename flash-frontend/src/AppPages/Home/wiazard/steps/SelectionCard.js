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
  // Pour les opérations, utiliser l'ancien système d'icônes
  const displayIcon = type === 'service' ? serviceIcons[icon] : icon;
  
  // Fonction pour formater le nom avec un saut de ligne si un "/" est présent
  const formatName = (name) => {
    if (name.includes('/')) {
      return name.split('/').map((part, index, array) => (
        <React.Fragment key={index}>
          {part}
          {index < array.length - 1 && <br />}
        </React.Fragment>
      ));
    }
    return name;
  };

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
        <img
          src={item.imagePath}
          alt={`Icône ${item.name}`}
          width={50}
          height={50}
          className='rounded-circle'
        />
      </div>
      <h4 className="selection-title" style={{ color: isSelected ? item.color : '' }}>
        {formatName(item.name)}
      </h4>
      {/* <p className="selection-description">{item.description}</p> */}
    </div>
  );
};

export default SelectionCard;