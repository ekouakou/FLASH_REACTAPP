// api/ticketApi.js

// Base URL de l'API - à remplacer par votre URL réelle
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

/**
 * Soumet la demande de ticket à l'API
 * @param {Object} requestData - Les données de la demande
 * @returns {Promise<Object>} - Promesse avec la réponse de l'API
 */
export const submitTicketRequest = async (requestData) => {
  try {
    // Simulation d'un délai réseau (à retirer en production)
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En mode développement, on peut simuler une réponse
      return {
        success: true,
        ticketNumber: `A-${Math.floor(Math.random() * 100)}`,
        estimatedWaitTime: Math.floor(Math.random() * 20) + 5
      };
    }
    
    // Appel réel à l'API en production
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création du ticket');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};

/**
 * Récupère l'état d'un ticket par son numéro
 * @param {string} ticketNumber - Le numéro du ticket
 * @returns {Promise<Object>} - Promesse avec les détails du ticket
 */
export const getTicketStatus = async (ticketNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketNumber}`);
    
    if (!response.ok) {
      throw new Error('Ticket non trouvé');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};