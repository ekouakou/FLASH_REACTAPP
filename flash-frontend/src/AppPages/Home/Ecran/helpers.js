// Fonctions utilitaires communes
export const getTypeColor = (type) => {
    switch (type) {
      case 'urgent': return 'red';
      case 'premium': return 'violet';
      default: return 'blue';
    }
  };
  
  export const getStatusColor = (status) => {
    switch (status) {
      case 'En cours': return 'green';
      case 'Préparation': return 'orange';
      default: return 'gray';
    }
  };