// src/constants/index.js

// Émojis pour les services
export const serviceIcons = {
    information: "ℹ️",
    consultation: "📅",
    paiement: "💳",
    reclamation: "💬",
    livraison: "📦",
    reparation: "🔧",
  };
  
  // Couleurs pour les services et opérations
  export const serviceColors = [
    "#3498db", // Bleu
    "#9b59b6", // Violet
    "#2ecc71", // Vert
    "#e74c3c", // Rouge
    "#f39c12", // Orange
    "#1abc9c", // Turquoise
  ];
  
  // Points d'entrée API
  export const API_ENDPOINTS = {
    SERVICES: "ConfigurationManager/listServicebyagence",
    OPERATIONS: "ConfigurationManager/listAgenceListe",
    CREATE_TICKET: "TicketManager/createTicket",
    VALIDATE_CREATE_TICKET: "TicketManager/validatTicketPriority",
    CREATE_COMMENTAIRE:"NotificationManager/createCommentaire"
  };