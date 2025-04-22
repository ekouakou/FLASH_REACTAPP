import { useState, useEffect } from "react";
import { urlBaseImage, rootUrl } from './urlUtils';
import axios from "axios";
import { useNavigate } from "react-router-dom";

/**
 * Hook pour récupérer des données d'API avec capacité de refetch
 * @param {string} url - URL de l'API
 * @param {Object} params - Paramètres pour la requête
 * @param {string} dataKey - Clé pour accéder aux données dans la réponse
 * @param {number} refreshTrigger - Déclencheur pour rafraîchir les données
 * @returns {Object} Les données récupérées, l'état du chargement, les erreurs et la fonction refetch
 */
const useFetchData = (apiEndPoint, params, dataKey, refreshTrigger = 0, skip = false) => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fonction pour vérifier si un objet contient des valeurs null ou undefined
  const validateParams = (params) => {
    console.log("validateParams called with:", params); // 🔍 debug ici
    if (!params) return { isValid: false, cleanParams: {} };
    const cleanParams = {};
    let isValid = false;
    for (const key in params) {
      if (params[key] !== null && params[key] !== undefined) {
        cleanParams[key] = params[key];
        isValid = true;
      }
    }
    return { isValid, cleanParams };
  };
  

  // Fonction pour récupérer les données
  const fetchData = async () => {
    try {
      setLoading(true);

      // Valider les paramètres avant d'envoyer la requête
      const { isValid, cleanParams } = validateParams(params);

      if (!isValid) {
        throw new Error("Paramètres invalides: tous les paramètres sont null ou undefined");
      }

      const response = await axios.post(
        rootUrl + apiEndPoint,
        cleanParams,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (response.data.code_statut == 2) {
        return navigate(process.env.REACT_APP_SIGN_IN);
      }

      const fetchedData = dataKey ? response.data[dataKey] : response.data;
      setData(fetchedData);
      setError(null);
      return fetchedData;
    } catch (err) {
      setError(err);
      console.error("Erreur lors de la récupération des données:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de re-fetch exposée
  const refetch = async () => {
    return await fetchData();
  };

  // Effet pour récupérer les données au chargement ou quand refreshTrigger change
  useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, [rootUrl + apiEndPoint, JSON.stringify(params), refreshTrigger, skip]);

  return { data, loading, error, refetch };
};

export default useFetchData;