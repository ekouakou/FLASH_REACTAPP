// VerticalTicketWizard.jsx - Modifications pour utiliser les données de l'API pour services et opérations
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
import useFetchData from '../../../services/useFetchData';
import usePostData from "../../../services/usePostData";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Utiliser des emojis au lieu d'icônes (conservé comme fallback)
export const serviceIcons = {
  information: "ℹ️",
  consultation: "📅",
  paiement: "💳",
  reclamation: "💬",
  livraison: "📦",
  reparation: "🔧"
};

// Couleurs pour les services et opérations (à associer dynamiquement avec les données de l'API)
const serviceColors = [
  '#3498db', '#9b59b6', '#2ecc71', '#e74c3c', '#f39c12', '#1abc9c'
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
  // const [apiError, setApiError] = useState(null);
  const [services, setServices] = useState([]);
  const [operations, setOperations] = useState([]);

  const { postData, loading, error: apiError } = usePostData("TicketManager/createTicket");

  // Paramètres pour la requête des services
  const serviceParams = {
    LG_TYLID: "SERVICE",
    mode: "listServicebyagence",
    order: "t.STR_LSTOTHERVALUE2",
    LG_AGEID: "004"
  };

  // Utilisation du hook pour récupérer les services
  const {
    data: fetchedServiceData,
    error: fetchServiceError,
    loading: fetchServiceLoading,
    refetch: refetchServices
  } = useFetchData("ConfigurationManager/listServicebyagence", serviceParams, "data");

  // Paramètres pour la requête des opérations (avec selectedService comme dépendance)
  const operationParams = {
    search_value: "",
    LG_TYLID: "PRODUIT",
    STR_LSTOTHERVALUE: selectedService,
    mode: "listAgenceListe",
    order: "t.lgLstid.strLstothervalue2",
    LG_AGEID: "004"
  };


  // Hook pour récupérer les opérations pour le service sélectionné
  const {
    data: fetchedOperationData,
    error: fetchOperationError,
    loading: fetchOperationLoading,
    refetch: refetchOperations
  } = useFetchData(
    "ConfigurationManager/listAgenceListe",
    selectedService ? operationParams : null, // On passe null si selectedService est null
    "data",
  );

  // Convertir les données de services de l'API en format utilisable
  useEffect(() => {
    if (fetchedServiceData && Array.isArray(fetchedServiceData)) {
      const mappedServices = fetchedServiceData.map((item, index) => ({
        id: item.LG_LSTID,
        name: item.STR_LSTVALUE,
        description: item.STR_LSTDESCRIPTION,
        color: serviceColors[index % serviceColors.length], // Attribuer une couleur depuis la liste
        imagePath: `assets/images/${item.STR_FOLDER}${item.STR_IMAGELISTE.trim()}`,
        iconName: item.STR_IMAGELISTE
      }));
      setServices(mappedServices);
    }
  }, [fetchedServiceData]);

  // Convertir les données d'opérations de l'API en format utilisable
  useEffect(() => {
    if (fetchedOperationData && Array.isArray(fetchedOperationData)) {
      const mappedOperations = fetchedOperationData.map((item, index) => ({
        id: item.LG_LSTID,
        name: item.STR_LSTVALUE,
        description: item.STR_LSTDESCRIPTION,
        color: serviceColors[index % serviceColors.length], // Attribuer une couleur depuis la liste
        imagePath: `assets/images/${item.STR_FOLDER}${item.STR_IMAGELISTE.trim()}`,
        iconName: item.STR_IMAGELISTE,
        serviceId: item.STR_LSTOTHERVALUE // ID du service parent
      }));
      setOperations(mappedOperations);
    }
  }, [fetchedOperationData]);

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
    setSelectedOperation(null); // Réinitialiser l'opération sélectionnée
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
    // Si on est à l'étape finale, soumettre le formulaire à l'API
    if (step === 3) {
      try {

        const requestData = {
          LG_LSTID: selectedOperation,
          mode: "createTicket",
          STR_TICCODEPRIORITE: "",
          STR_TICPHONE: "0749345289",
          STR_UTITOKEN: "",
          LG_AGEID: "004",
          LG_SOCID: ""
        };

        // const userData = await postData(requestData);

        // if (userData?.code_statut === "1") {
        //   toast.success("Votre ticket a été créé avec succès !");

        //   // alert("ok");
        //   // localStorage.setItem("user", JSON.stringify(userData));
        // } else {
        //   toast.error(userData?.desc_statut || "La création du ticket a échoué. Veuillez réessayer.");

        //   // alert("echec");
        //   // setError(userData?.desc_statut || "Erreur de connexion.");
        // }
        // Animation de transition
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setStep(step + 1);
        }, 400);
      } catch (error) {
        setApiSubmitting(false);
        // setApiError(error.message || "Une erreur est survenue lors de la soumission.");
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
    // setApiError(null);
  };

  const validateUserData = () => {
    return userData.name.trim() !== '' && userData.phone.trim() !== '';
  };

  // Rendu du contenu en fonction de l'étape actuelle
  const renderStepContent = () => {
    // Gestion du chargement initial des services
    if (fetchServiceLoading && step === 0) {
      return (
        <div className="loading-container">
          <Loader size="lg" content="Chargement des services..." vertical />
        </div>
      );
    }

    // Gestion du chargement des opérations
    if (fetchOperationLoading && step === 1) {
      return (
        <div className="loading-container">
          <Loader size="lg" content="Chargement des opérations..." vertical />
        </div>
      );
    }

    // Gestion du chargement des transitions
    if (isLoading) {
      return (
        <div className="loading-container">
          <Loader size="lg" content="Chargement..." vertical />
        </div>
      );
    }

    // Gestion des erreurs de chargement des services
    if (fetchServiceError && step === 0) {
      return (
        <div className="error-container">
          <p className="error-message">Erreur lors du chargement des services. Veuillez réessayer.</p>
          <Button onClick={refetchServices} appearance="primary">Réessayer</Button>
        </div>
      );
    }

    // Gestion des erreurs de chargement des opérations
    if (fetchOperationError && step === 1) {
      return (
        <div className="error-container">
          <p className="error-message">Erreur lors du chargement des opérations. Veuillez réessayer.</p>
          <Button onClick={refetchOperations} appearance="primary">Réessayer</Button>
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
              getSelectedServiceData={getSelectedServiceData}
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
          <div className="wizard-steps-card rounded-bottom mb-20">
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
        </div>

        {/* Contenu principal */}
        <div className="wizard-content">
          <Panel className="wizard-panel">
            {renderStepContent()}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

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