// VerticalTicketWizard.jsx - Composant principal
import React, { useState, useEffect } from 'react';
import {
  Steps, Panel, Loader, Animation, Modal, Button, useMediaQuery
} from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import '../Wizard.css';
import WizardNavbar from '../WizardNavbar';
import WizardFooter from '../WizardFooter';
import ServiceSelection from './steps/ServiceSelection';
import OperationSelection from './steps/OperationSelection';
import UserInfoForm from './steps/UserInfoForm';
import SummaryStep from './steps/SummaryStep';
import TicketSuccess from './steps/TicketSuccess';
import SuccessModal from './steps/SuccessModal';
import { submitTicketRequest } from './steps/ticketApi';

// Utiliser des emojis au lieu d'icônes
export const serviceIcons = {
  information: "ℹ️",
  consultation: "📅",
  paiement: "💳",
  reclamation: "💬",
  livraison: "📦",
  reparation: "🔧"
};

// Liste des services disponibles
export const services = [
  { id: 'information', name: 'Operations de caisse', description: 'Renseignements généraux', color: '#3498db' },
  { id: 'consultation', name: 'Moyens de paiement', description: 'Rencontrer un conseiller', color: '#9b59b6' },
  { id: 'paiement', name: 'RDV conseillers', description: 'Effectuer un paiement', color: '#2ecc71' },
  { id: 'reclamation', name: 'Operations Spécifiques', description: 'Déposer une réclamation', color: '#e74c3c' },
  { id: 'livraison', name: 'Satisfaction client', description: 'Retrait de commande', color: '#f39c12' },
  { id: 'reparation', name: 'Réparation', description: 'Service après-vente', color: '#1abc9c' }
];

// Liste des opérations disponibles
export const operations = [
  { id: 'depot', name: 'Dépôt', description: 'Faire un dépôt d\'argent', color: '#3498db' },
  { id: 'retrait', name: 'Retrait', description: 'Effectuer un retrait', color: '#9b59b6' },
  { id: 'virement', name: 'Virement', description: 'Réaliser un virement', color: '#2ecc71' },
  { id: 'change', name: 'Change', description: 'Service de change', color: '#e74c3c' },
  { id: 'credit', name: 'Crédit', description: 'Demander un crédit', color: '#f39c12' },
  { id: 'conseil', name: 'Conseil', description: 'Obtenir un conseil', color: '#1abc9c' }
];

const { Fade } = Animation;

const VerticalTicketWizard = () => {
  // États principaux
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [ticketNumber, setTicketNumber] = useState('');
  const [waitTime, setWaitTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [selectionDelay, setSelectionDelay] = useState(false);
  const [operationDelay, setOperationDelay] = useState(false);
  const [apiSubmitting, setApiSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Media queries pour le responsive design
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isExtraSmall = useMediaQuery('(max-width: 480px)');

  useEffect(() => {
    // Générer un numéro de ticket aléatoire mais consistant
    setTicketNumber(`AFG-${Math.floor(Math.random() * 1000)}`);
  }, []);

  useEffect(() => {
    // Générer un numéro de ticket aléatoire quand on arrive à l'étape finale
    if (step === 3) {
      const randomTicket = `A-${Math.floor(Math.random() * 100)}`;
      const randomWait = Math.floor(Math.random() * 20) + 5; // Entre 5 et 25 minutes
      setTicketNumber(randomTicket);
      setWaitTime(randomWait);
    }
  }, [step]);

  // Effet pour la redirection automatique après le modal de succès
  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        handleReset();
      }, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccess]);

  // Fonctions utilitaires pour obtenir les détails du service et de l'opération sélectionnés
  const getSelectedServiceData = () => {
    return services.find(s => s.id === selectedService) || {};
  };

  const getSelectedOperationData = () => {
    return operations.find(o => o.id === selectedOperation) || {};
  };

  // Gestionnaires d'événements
  const handleServiceSelect = (serviceId) => {
    setSelectedService(serviceId);
    setSelectionDelay(true);

    setTimeout(() => {
      setSelectionDelay(false);
      setTimeout(() => {
        setIsLoading(false);
        setStep(1);
      }, 100);
    }, 700);
  };

  const handleOperationSelect = (operationId) => {
    setSelectedOperation(operationId);
    setOperationDelay(true);

    setTimeout(() => {
      setOperationDelay(false);
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 100);
    }, 700);
  };

  const handleUserDataChange = (value, name) => {
    setUserData({
      ...userData,
      [name]: value
    });

    // Effacer l'erreur lorsque l'utilisateur corrige le champ
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: null
      });
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      // Validation du formulaire avant de passer à l'étape suivante
      const errors = {};

      if (!userData.name.trim()) {
        errors.name = 'Le nom est obligatoire';
      }

      if (!userData.phone.trim()) {
        errors.phone = 'Le téléphone est obligatoire';
      } else if (!/^[0-9+\s-]{8,15}$/.test(userData.phone.trim())) {
        errors.phone = 'Numéro de téléphone invalide';
      }

      if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
        errors.email = 'Email invalide';
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        return;
      }
    }

    // Si on est à l'étape finale, soumettre le formulaire à l'API
    if (step === 3) {
      try {
        setApiSubmitting(true);
        setApiError(null);
        
        // Création de l'objet de données pour l'API
        const requestData = {
          service: selectedService,
          operation: selectedOperation,
          userData: {
            ...userData
          },
          requestDate: new Date().toISOString()
        };

        console.log(requestData);
        
        // Appel à l'API
        const response = await submitTicketRequest(requestData);
        
        // Si succès, mettre à jour le ticket avec la réponse de l'API
        if (response && response.ticketNumber) {
          setTicketNumber(response.ticketNumber);
          setWaitTime(response.estimatedWaitTime || waitTime);
        }
        
        setApiSubmitting(false);
        
        // Animation de transition
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setStep(step + 1);
        }, 400);
      } catch (error) {
        setApiSubmitting(false);
        setApiError(error.message || "Une erreur est survenue lors de la soumission.");
        console.error("API error:", error);
      }
    } else {
      // Animation de transition normale pour les autres étapes
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(step + 1);
      }, 400);
    }
  };

  const handlePrevious = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(step - 1);
    }, 400);
  };

  const handleConfirm = () => {
    setShowSuccess(true);
  };

  const handleReset = () => {
    // Réinitialiser tout le wizard
    setShowSuccess(false);
    setStep(0);
    setSelectedService(null);
    setSelectedOperation(null);
    setUserData({ name: '', phone: '', email: '' });
    setValidationErrors({});
    setApiError(null);
  };

  const validateUserData = () => {
    return userData.name.trim() !== '' && userData.phone.trim() !== '';
  };

  // Rendu du contenu en fonction de l'étape actuelle
  const renderStepContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <Loader size="lg" content="Chargement..." vertical />
        </div>
      );
    }

    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <ServiceSelection 
              services={services} 
              selectedService={selectedService}
              selectionDelay={selectionDelay}
              handleServiceSelect={handleServiceSelect}
              handleNext={handleNext}
              getSelectedServiceColor={() => getSelectedServiceData().color || ''}
              isMobile={isMobile}
            />
          </Fade>
        );

      case 1:
        return (
          <Fade in={true}>
            <OperationSelection 
              operations={operations}
              selectedOperation={selectedOperation}
              operationDelay={operationDelay}
              selectedService={selectedService}
              handleOperationSelect={handleOperationSelect}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              getSelectedServiceName={() => getSelectedServiceData().name || ''}
              getSelectedOperationColor={() => getSelectedOperationData().color || ''}
              serviceIcons={serviceIcons}
              isMobile={isMobile}
            />
          </Fade>
        );

      case 2:
        return (
          <Fade in={true}>
            <UserInfoForm 
              userData={userData}
              validationErrors={validationErrors}
              handleUserDataChange={handleUserDataChange}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              validateUserData={validateUserData}
              selectedService={selectedService}
              getSelectedServiceName={() => getSelectedServiceData().name || ''}
              getSelectedServiceColor={() => getSelectedServiceData().color || ''}
              serviceIcons={serviceIcons}
            />
          </Fade>
        );

      case 3:
        return (
          <Fade in={true}>
            <SummaryStep 
              userData={userData}
              selectedService={selectedService}
              selectedOperation={selectedOperation}
              getSelectedServiceName={() => getSelectedServiceData().name || ''}
              getSelectedServiceColor={() => getSelectedServiceData().color || ''}
              getSelectedOperationName={() => getSelectedOperationData().name || ''}
              getSelectedOperationColor={() => getSelectedOperationData().color || ''}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              serviceIcons={serviceIcons}
              apiSubmitting={apiSubmitting}
              apiError={apiError}
            />
          </Fade>
        );

      case 4:
        return (
          <Fade in={true}>
            <TicketSuccess 
              ticketNumber={ticketNumber}
              userData={userData}
              getSelectedServiceName={() => getSelectedServiceData().name || ''}
              getSelectedOperationName={() => getSelectedOperationData().name || ''}
              handleConfirm={handleConfirm}
            />
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <div className="ticket-wizard-container">
      {/* Barre de navigation stylisée */}
      <WizardNavbar />

      <div className="wizard-layout">
        {/* Wizard Steps - Vertical pour écran large, Horizontal pour petit écran */}
        <div className="wizard-sidebar">
          <div className="wizard-steps-card rounded-bottom">
            <Steps
              current={step}
              vertical={!isMobile}
              small={isExtraSmall}
            >
              <Steps.Item
                title="Service"
                description={isMobile ? "" : "Choisissez votre service"}
              />
              <Steps.Item
                title="Opérations"
                description={isMobile ? "" : "Type d'opération"}
              />
              <Steps.Item
                title="Infos"
                description={isMobile ? "" : "Vos coordonnées"}
              />
              <Steps.Item
                title="Résumé"
                description={isMobile ? "" : "Vérifiez vos informations"}
              />
              <Steps.Item
                title="Terminé"
                description={isMobile ? "" : "Récupérez votre ticket"}
              />
            </Steps>
          </div>

          {/* Indicateur de progression pour les écrans mobiles */}
          {isMobile && (
            <div className="wizard-mobile-progress">
              <span className="wizard-progress-step">
                Étape {step + 1} sur 5
              </span>
              <span className="wizard-progress-label">
                {step === 0 && 'Choisir un service'}
                {step === 1 && 'Choisir une opération'}
                {step === 2 && 'Renseigner les informations'}
                {step === 3 && 'Vérifier le résumé'}
                {step === 4 && 'Ticket généré'}
              </span>
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="wizard-content">
          <Panel className="wizard-panel">
            {renderStepContent()}
          </Panel>

          <WizardFooter />
        </div>
      </div>

      {/* Modal de confirmation */}
      <SuccessModal 
        showSuccess={showSuccess}
        handleReset={handleReset}
      />
    </div>
  );
};

export default VerticalTicketWizard;