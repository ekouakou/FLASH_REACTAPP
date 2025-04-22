import React, { useState, useEffect, useCallback } from "react";
import { Steps, Panel, Loader, Animation, Button, useMediaQuery } from "rsuite";
import { useParams } from "react-router-dom";

import "rsuite/dist/rsuite.min.css";
import "../Wizard.css";
import WizardNavbar from "../WizardNavbar";
import WizardFooter from "../WizardFooter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importation des composants d'étapes du wizard (externalisés)
import ServiceSelection from "./steps/ServiceSelection";
import OperationSelection from "./steps/OperationSelection";
import PrestationSelection from "./steps/PrestationSelection";
import PriorisationCodeStep from "./steps/PriorisationCodeStep";
import SatisfactionFeedback from "./steps/SatisfactionFeedback";
import UserInfoForm from "./steps/UserInfoForm";
import SummaryStep from "./steps/SummaryStep";
import TicketSuccess from "./steps/TicketSuccess";
import SuccessModal from "./steps/SuccessModal";

// Hooks personnalisés (externalisés)
import useFetchData from "../../../services/useFetchData";
import usePostData from "../../../services/usePostData";

// Constantes (externalisées)
import { serviceIcons, serviceColors, API_ENDPOINTS } from "./constants";

const { Fade } = Animation;

const VerticalTicketWizard = () => {
  const { PARAM_LG_AGEID } = useParams();
  // États principaux regroupés par catégorie
  const [wizardState, setWizardState] = useState({
    step: 0,
    selectedService: null,
    selectedOperation: null,
    selectedPrestation: null,
    priorisationCode: "",
    selectedEmotion: null,
    ticketNumber: "",
    waitTime: 0,
    showSuccess: false,
  });

  const [userData, setUserData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [uiState, setUiState] = useState({
    isLoading: false,
    selectionDelay: false,
    operationDelay: false,
    apiSubmitting: false,
    validationErrors: {},
  });

  // Destructuration pour faciliter l'accès aux états
  const {
    step,
    selectedService,
    selectedOperation,
    selectedPrestation,
    priorisationCode,
    selectedEmotion,
    ticketNumber,
    waitTime,
    showSuccess,
  } = wizardState;

  const {
    isLoading,
    selectionDelay,
    operationDelay,
    apiSubmitting,
    validationErrors,
  } = uiState;

  // Hook pour les données des services
  const serviceParams = {
    LG_TYLID: "SERVICE",
    mode: "listServicebyagence",
    order: "t.STR_LSTOTHERVALUE2",
    LG_AGEID: PARAM_LG_AGEID,
  };

  const {
    data: fetchedServiceData,
    error: fetchServiceError,
    loading: fetchServiceLoading,
    refetch: refetchServices,
  } = useFetchData(API_ENDPOINTS.SERVICES, serviceParams, "data");

  // Hook pour les données des opérations
  const operationParams = {
    search_value: "",
    LG_TYLID: "PRODUIT",
    STR_LSTOTHERVALUE: selectedService,
    mode: "listAgenceListe",
    order: "t.lgLstid.strLstothervalue2",
    LG_AGEID: PARAM_LG_AGEID,
  };

  // const {
  //   data: fetchedOperationData,
  //   error: fetchOperationError,
  //   loading: fetchOperationLoading,
  //   refetch: refetchOperations,
  // } = useFetchData(
  //   API_ENDPOINTS.OPERATIONS,
  //   selectedService ? operationParams : null,
  //   "data"
  // );
  const {
    data: fetchedOperationData,
    error: fetchOperationError,
    loading: fetchOperationLoading,
    refetch: refetchOperations,
  } = useFetchData(
    API_ENDPOINTS.OPERATIONS,
    operationParams,
    "data",
    0,
    !selectedService // ⬅️ skip si selectedService est nul
  );

  // Hook pour l'envoi des données du ticket
  // Vous devez d'abord créer deux instances de votre hook - une pour chaque endpoint
  const {
    postData,
    loading: postLoading,
    error: apiError,
  } = usePostData(API_ENDPOINTS.CREATE_TICKET);

  const {
    postData: postDataPriorisation,
    loading: postPriorisationLoading,
    error: apiPriorisationError,
  } = usePostData(API_ENDPOINTS.VALIDATE_CREATE_TICKET);

  const {
    postData: postDataSatisfaction,
    loading: postSatisfactionLoading,
    error: apiSatisfactionError,
  } = usePostData(API_ENDPOINTS.CREATE_COMMENTAIRE);

  // État pour les données des services et opérations
  const [services, setServices] = useState([]);
  const [operations, setOperations] = useState([]);

  // Media queries pour le responsive design
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isExtraSmall = useMediaQuery("(max-width: 480px)");

  // Fonction pour mettre à jour wizardState
  const updateWizardState = useCallback((updates) => {
    setWizardState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Fonction pour mettre à jour uiState
  const updateUiState = useCallback((updates) => {
    setUiState((prev) => ({ ...prev, ...updates }));
  }, []);

  // Effet pour transformer les données des services
  useEffect(() => {
    if (fetchedServiceData && Array.isArray(fetchedServiceData)) {
      const mappedServices = fetchedServiceData.map((item, index) => ({
        id: item.LG_LSTID,
        name: item.STR_LSTVALUE,
        description: item.STR_LSTDESCRIPTION,
        color: serviceColors[index % serviceColors.length],
        imagePath: `assets/images/${
          item.STR_FOLDER
        }${item.STR_IMAGELISTE.trim()}`,
        iconName: item.STR_IMAGELISTE,
      }));
      setServices(mappedServices);
    }
  }, [fetchedServiceData]);

  // Effet pour transformer les données des opérations
  useEffect(() => {
    if (fetchedOperationData && Array.isArray(fetchedOperationData)) {
      const mappedOperations = fetchedOperationData.map((item, index) => ({
        id: item.LG_LSTID,
        name: item.STR_LSTVALUE,
        description: item.STR_LSTDESCRIPTION,
        color: serviceColors[index % serviceColors.length],
        imagePath: `assets/images/${
          item.STR_FOLDER
        }${item.STR_IMAGELISTE.trim()}`,
        iconName: item.STR_IMAGELISTE,
        serviceId: item.STR_LSTOTHERVALUE,
      }));
      setOperations(mappedOperations);
    }
  }, [fetchedOperationData]);

  // Effet pour générer un numéro de ticket lors de l'initialisation
  useEffect(() => {
    updateWizardState({
      ticketNumber: `AFG-${Math.floor(Math.random() * 1000)}`,
    });
  }, [updateWizardState]);

  // Effet pour générer un numéro de ticket quand on arrive à l'étape finale
  useEffect(() => {
    if (step === 5) {
      const randomTicket = `A-${Math.floor(Math.random() * 100)}`;
      const randomWait = Math.floor(Math.random() * 20) + 5;
      updateWizardState({
        ticketNumber: randomTicket,
        waitTime: randomWait,
      });
    }
  }, [step, updateWizardState]);

  // Effet pour la redirection automatique après le modal de succès
  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(handleReset, 2000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccess]);

  // Fonctions utilitaires optimisées
  const getSelectedServiceData = useCallback(
    () => services.find((s) => s.id === selectedService) || {},
    [services, selectedService]
  );

  const getSelectedOperationData = useCallback(
    () => operations.find((o) => o.id === selectedOperation) || {},
    [operations, selectedOperation]
  );

  const getSelectedPrestationColor = useCallback(() => {
    if (selectedPrestation === "Service") return "#3498db";
    if (selectedPrestation === "Priorisation") return "#9b59b6";
    if (selectedPrestation === "Satisfaction") return "#2ecc71";
    return "";
  }, [selectedPrestation]);

  // Gestionnaires d'événements optimisés avec useCallback
  const handlePriorisationCodeChange = useCallback(
    (code) => {
      updateWizardState({ priorisationCode: code });
    },
    [updateWizardState]
  );

  const handleEmotionSelect = useCallback(
    (emotion) => {
      updateWizardState({ selectedEmotion: emotion });
      updateUiState({ selectionDelay: true });

      setTimeout(() => {
        updateUiState({ selectionDelay: false });
        setTimeout(() => {
          updateUiState({ isLoading: false });
          updateWizardState({ step: 3 });
        }, 100);
      }, 700);
    },
    [updateWizardState, updateUiState]
  );

  const handlePriorisationCodeSubmit = useCallback(() => {
    if (priorisationCode.trim() !== "") {
      updateUiState({ selectionDelay: true });
      setTimeout(() => {
        updateUiState({ selectionDelay: false });
        setTimeout(() => {
          updateUiState({ isLoading: false });
          updateWizardState({ step: 3 });
        }, 100);
      }, 700);
    } else {
      updateUiState((prev) => ({
        ...prev,
        validationErrors: {
          ...prev.validationErrors,
          priorisationCode: "Veuillez entrer un code de priorisation valide",
        },
      }));
    }
  }, [priorisationCode, updateUiState, updateWizardState]);

  const handlePrestationSelect = useCallback(
    (prestationId) => {
      updateWizardState({
        selectedPrestation: prestationId,
        selectedService: null,
        selectedOperation: null,
      });
      updateUiState({ selectionDelay: true });

      setTimeout(() => {
        updateUiState({ selectionDelay: false });
        setTimeout(() => {
          updateUiState({ isLoading: false });

          // Déterminer la prochaine étape selon la prestation
          if (prestationId === "Service") {
            updateWizardState({ step: 1 });
          } else if (prestationId === "Priorisation") {
            updateWizardState({ step: 1.5 });
          } else if (prestationId === "Satisfaction") {
            updateWizardState({ step: 1.75 });
          }
        }, 100);
      }, 700);
    },
    [updateWizardState, updateUiState]
  );

  const handleServiceSelect = useCallback(
    (serviceId) => {
      updateWizardState({
        selectedService: serviceId,
        selectedOperation: null,
      });
      updateUiState({ selectionDelay: true });

      setTimeout(() => {
        updateUiState({ selectionDelay: false });
        setTimeout(() => {
          updateUiState({ isLoading: false });
          updateWizardState({ step: 2 });
        }, 100);
      }, 700);
    },
    [updateWizardState, updateUiState]
  );

  const handleOperationSelect = useCallback(
    (operationId) => {
      updateWizardState({ selectedOperation: operationId });
      updateUiState({ operationDelay: true });

      setTimeout(() => {
        updateUiState({ operationDelay: false });
        setTimeout(() => {
          updateUiState({ isLoading: false });
          updateWizardState({ step: 3 });
        }, 100);
      }, 700);
    },
    [updateWizardState, updateUiState]
  );

  const handleUserDataChange = useCallback(
    (value, name) => {
      setUserData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Effacer l'erreur lorsque l'utilisateur corrige le champ
      updateUiState((prev) => {
        if (prev.validationErrors[name]) {
          return {
            ...prev,
            validationErrors: {
              ...prev.validationErrors,
              [name]: null,
            },
          };
        }
        return prev;
      });
    },
    [updateUiState]
  );

  const handleNext = useCallback(async () => {
    // Si on est à l'étape du formulaire utilisateur, aller à l'étape récapitulative
    if (step === 3) {
      updateUiState({ isLoading: true });
      setTimeout(() => {
        updateUiState({ isLoading: false });
        updateWizardState({ step: 4 });
      }, 400);
    }
    // Si on est à l'étape récapitulative, soumettre le formulaire à l'API
    else if (step === 4) {
      try {
        updateUiState({ apiSubmitting: true });

        const requestData = {
          // Valeurs communes à tous les types de prestation
          LG_AGEID: PARAM_LG_AGEID,
          LG_SOCID: "03",
          STR_UTITOKEN: "",
          STR_TICPHONE: userData.phone || "0749345289",
          STR_TICNAME: userData.name,
          STR_TICEMAIL: userData.email,
          STR_PRESTATIONTYPE: selectedPrestation,
        };

        // Ajout des données spécifiques selon le type de prestation
        if (selectedPrestation === "Service") {
          requestData.LG_LSTID = selectedOperation;
          requestData.mode = "createTicket";
        } else if (selectedPrestation === "Priorisation") {
          requestData.STR_TICCODEPRIORITE = priorisationCode;
          requestData.mode = "createTicket";
        } else if (selectedPrestation === "Satisfaction") {
          requestData.LG_LSTID = selectedEmotion;
          requestData.mode = "createCommentaire";
        }

        console.log("Données à envoyer:", requestData);

        // Utilisez la fonction appropriée selon le type de prestation
        let result;
        if (selectedPrestation === "Priorisation") {
          result = await postDataPriorisation(requestData);
        } else if (selectedPrestation === "Satisfaction") {
          result = await postDataSatisfaction(requestData);
        } else {
          result = await postData(requestData);
        }

        // Vérifiez si la requête a réussi
        if (result.code_statut === "1") {
          updateUiState({
            isLoading: true,
            apiSubmitting: false,
          });

          setTimeout(() => {
            updateUiState({ isLoading: false });
            updateWizardState({ step: 5 });
          }, 400);
        } else {
          throw new Error("La requête a échoué");
        }
      } catch (error) {
        updateUiState({ apiSubmitting: false });
        toast.error("Erreur lors de l'enregistrement du ticket");
        console.error("API error:", error);
      }
    } else {
      // Animation de transition normale pour les autres étapes
      updateUiState({ isLoading: true });
      setTimeout(() => {
        updateUiState({ isLoading: false });
        updateWizardState((prev) => ({ step: prev.step + 1 }));
      }, 400);
    }
  }, [
    step,
    selectedOperation,
    priorisationCode,
    selectedEmotion,
    selectedPrestation,
    userData,
    postData,
    updateWizardState,
    updateUiState,
  ]);

  const handlePrevious = useCallback(() => {
    updateUiState({ isLoading: true });

    setTimeout(() => {
      updateUiState({ isLoading: false });

      // Logique de navigation en arrière en fonction de la prestation et de l'étape actuelle
      if (step === 3) {
        if (selectedPrestation === "Service") {
          updateWizardState({ step: 2 });
        } else if (selectedPrestation === "Priorisation") {
          updateWizardState({ step: 1.5 });
        } else if (selectedPrestation === "Satisfaction") {
          updateWizardState({ step: 1.75 });
        }
      } else if (step === 2) {
        updateWizardState({ step: 1 });
      } else if (step === 1.5 || step === 1.75) {
        updateWizardState({ step: 0 });
      } else if (step === 1) {
        updateWizardState({ step: 0 });
      } else if (step === 4) {
        updateWizardState({ step: 3 });
      } else {
        updateWizardState((prev) => ({ step: Math.max(0, prev.step - 1) }));
      }
    }, 400);
  }, [step, selectedPrestation, updateWizardState, updateUiState]);

  const handleConfirm = useCallback(() => {
    updateWizardState({ showSuccess: true });
  }, [updateWizardState]);

  const handleReset = useCallback(() => {
    // Réinitialiser tout le wizard
    updateWizardState({
      step: 0,
      selectedService: null,
      selectedOperation: null,
      selectedPrestation: null,
      priorisationCode: "",
      selectedEmotion: null,
      showSuccess: false,
      ticketNumber: `AFG-${Math.floor(Math.random() * 1000)}`,
    });

    setUserData({ name: "", phone: "", email: "" });

    updateUiState({
      isLoading: false,
      selectionDelay: false,
      operationDelay: false,
      apiSubmitting: false,
      validationErrors: {},
    });
  }, [updateWizardState, updateUiState]);

  const validateUserData = useCallback(() => {
    return userData.name.trim() !== "" && userData.phone.trim() !== "";
  }, [userData]);

  // Calcul de l'étape courante pour le composant Steps
  const calculateStepIndex = useCallback(() => {
    if (!selectedPrestation) return 0;

    switch (step) {
      case 0:
        return 0;
      case 1:
        return 1;
      case 1.5:
      case 1.75:
        return 1;
      case 2:
        return selectedPrestation === "Service" ? 2 : 1;
      case 3:
        return selectedPrestation === "Service" ? 3 : 2;
      case 4:
        return selectedPrestation === "Service" ? 4 : 3;
      case 5:
        return selectedPrestation === "Service" ? 5 : 4;
      default:
        return 0;
    }
  }, [step, selectedPrestation]);

  // Fonction pour obtenir le nom du service sélectionné
  const getSelectedServiceName = useCallback(() => {
    if (selectedPrestation === "Service") {
      return getSelectedServiceData().name || "";
    } else if (selectedPrestation === "Priorisation") {
      return "Priorisation";
    } else if (selectedPrestation === "Satisfaction") {
      return "Satisfaction";
    }
    return "";
  }, [selectedPrestation, getSelectedServiceData]);

  // Fonction pour obtenir le nom de l'opération sélectionnée
  const getSelectedOperationName = useCallback(() => {
    if (selectedPrestation === "Service") {
      return getSelectedOperationData().name || "";
    } else if (selectedPrestation === "Priorisation") {
      return "Rencontrer un conseiller";
    } else if (selectedPrestation === "Satisfaction") {
      return selectedEmotion ? `Feedback: ${selectedEmotion}` : "Feedback";
    }
    return "";
  }, [selectedPrestation, selectedEmotion, getSelectedOperationData]);

  // Rendu du contenu en fonction de l'étape actuelle
  const renderStepContent = useCallback(() => {
    // Gestion des états de chargement et d'erreur
    if (fetchServiceLoading && step === 0) {
      return (
        <div className="loading-container">
          <Loader size="lg" content="Chargement des services..." vertical />
        </div>
      );
    }

    if (fetchOperationLoading && step === 2) {
      return (
        <div className="loading-container">
          <Loader size="lg" content="Chargement des opérations..." vertical />
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="loading-container">
          <Loader size="lg" content="Chargement..." vertical />
        </div>
      );
    }

    if (fetchServiceError && step === 0) {
      return (
        <div className="error-container">
          <Button onClick={refetchServices} appearance="primary">
            Réessayer
          </Button>
        </div>
      );
    }

    if (fetchOperationError && step === 2) {
      return (
        <div className="error-container">
          <Button onClick={refetchOperations} appearance="primary">
            Réessayer
          </Button>
        </div>
      );
    }

    // Rendu des étapes
    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <PrestationSelection
              selectedService={selectedPrestation}
              selectionDelay={selectionDelay}
              handleServiceSelect={handlePrestationSelect}
              handleNext={handleNext}
              getSelectedServiceColor={getSelectedPrestationColor}
              isMobile={isMobile}
            />
          </Fade>
        );

      case 1:
        return (
          <Fade in={true}>
            <ServiceSelection
              services={services}
              selectedService={selectedService}
              selectionDelay={selectionDelay}
              handleServiceSelect={handleServiceSelect}
              handleNext={handleNext}
              getSelectedServiceColor={() =>
                getSelectedServiceData().color || ""
              }
              isMobile={isMobile}
              handlePrevious={handlePrevious}
            />
          </Fade>
        );

      case 1.5:
        return (
          <Fade in={true}>
            <PriorisationCodeStep
              priorisationCode={priorisationCode}
              handlePriorisationCodeChange={handlePriorisationCodeChange}
              handlePriorisationCodeSubmit={handlePriorisationCodeSubmit}
              handlePrevious={handlePrevious}
              validationErrors={validationErrors}
              getSelectedPrestationColor={getSelectedPrestationColor}
              isMobile={isMobile}
            />
          </Fade>
        );

      case 1.75:
        return (
          <Fade in={true}>
            <SatisfactionFeedback
              selectedEmotion={selectedEmotion}
              handleEmotionSelect={handleEmotionSelect}
              handlePrevious={handlePrevious}
              getSelectedPrestationColor={getSelectedPrestationColor}
              isMobile={isMobile}
            />
          </Fade>
        );

      case 2:
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
              getSelectedServiceName={getSelectedServiceName}
              getSelectedOperationColor={() =>
                getSelectedOperationData().color || ""
              }
              serviceIcons={serviceIcons}
              isMobile={isMobile}
              getSelectedServiceData={getSelectedServiceData}
            />
          </Fade>
        );

      case 3:
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
              getSelectedServiceName={getSelectedServiceName}
              getSelectedServiceColor={getSelectedPrestationColor}
              serviceIcons={serviceIcons}
            />
          </Fade>
        );

      case 4:
        return (
          <Fade in={true}>
            <SummaryStep
              userData={userData}
              selectedService={selectedService}
              selectedOperation={selectedOperation}
              getSelectedServiceName={getSelectedServiceName}
              getSelectedServiceColor={getSelectedPrestationColor}
              getSelectedOperationName={getSelectedOperationName}
              getSelectedOperationColor={getSelectedPrestationColor}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              serviceIcons={serviceIcons}
              apiSubmitting={apiSubmitting}
              apiError={apiError}
              selectedPrestation={selectedPrestation}
              priorisationCode={priorisationCode}
              selectedEmotion={selectedEmotion}
            />
          </Fade>
        );

      case 5:
        return (
          <Fade in={true}>
            <TicketSuccess
              ticketNumber={ticketNumber}
              userData={userData}
              getSelectedServiceName={getSelectedServiceName}
              getSelectedOperationName={getSelectedOperationName}
              handleConfirm={handleConfirm}
              handleReset={handleReset} // Ajout de ce prop pour permettre la redirection
            />
          </Fade>
        );

      default:
        return null;
    }
  }, [
    step,
    fetchServiceLoading,
    fetchOperationLoading,
    isLoading,
    fetchServiceError,
    fetchOperationError,
    refetchServices,
    refetchOperations,
    selectedPrestation,
    selectionDelay,
    handlePrestationSelect,
    handleNext,
    getSelectedPrestationColor,
    isMobile,
    services,
    selectedService,
    handleServiceSelect,
    getSelectedServiceData,
    handlePrevious,
    priorisationCode,
    handlePriorisationCodeChange,
    handlePriorisationCodeSubmit,
    validationErrors,
    selectedEmotion,
    handleEmotionSelect,
    operations,
    selectedOperation,
    operationDelay,
    handleOperationSelect,
    getSelectedServiceName,
    getSelectedOperationData,
    userData,
    handleUserDataChange,
    validateUserData,
    apiSubmitting,
    apiError,
    getSelectedOperationName,
    ticketNumber,
  ]);

  // Rendu des étapes disponibles
  const renderSteps = useCallback(() => {
    const stepsArr = [];

    stepsArr.push(
      <Steps.Item
        key="prestation"
        title="Prestation"
        description={isMobile ? "" : "Choisissez votre prestation"}
      />
    );

    if (selectedPrestation === "Service") {
      stepsArr.push(
        <Steps.Item
          key="service"
          title="Service"
          description={isMobile ? "" : "Choisissez votre service"}
        />
      );
      stepsArr.push(
        <Steps.Item
          key="operations"
          title="Opérations"
          description={isMobile ? "" : "Type d'opération"}
        />
      );
    } else if (selectedPrestation === "Priorisation") {
      stepsArr.push(
        <Steps.Item
          key="priorisation"
          title="Code"
          description={isMobile ? "" : "Code de priorisation"}
        />
      );
    } else if (selectedPrestation === "Satisfaction") {
      stepsArr.push(
        <Steps.Item
          key="satisfaction"
          title="Feedback"
          description={isMobile ? "" : "Votre satisfaction"}
        />
      );
    }

    stepsArr.push(
      <Steps.Item
        key="infos"
        title="Infos"
        description={isMobile ? "" : "Vos coordonnées"}
      />
    );

    stepsArr.push(
      <Steps.Item
        key="resume"
        title="Résumé"
        description={isMobile ? "" : "Vérifiez vos informations"}
      />
    );

    stepsArr.push(
      <Steps.Item
        key="termine"
        title="Terminé"
        description={isMobile ? "" : "Récupérez votre ticket"}
      />
    );

    return stepsArr;
  }, [selectedPrestation, isMobile]);

  return (
    <div className="ticket-wizard-container m-20">
      {/* En-tête fixe */}
      <div className="fixed-header">
        <WizardNavbar />
        <div className="wizard-steps-container">
          <div className="wizard-steps-card rounded-bottom">
            <Steps
              current={calculateStepIndex()}
              vertical={!isMobile}
              small={isExtraSmall}
            >
              {renderSteps()}
            </Steps>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="main-content-area">
        <Panel className="wizard-panel">
          {renderStepContent()}
          <ToastContainer position="top-right" autoClose={5000} />
        </Panel>
      </div>

      {/* Footer */}
      <div className="fixed-footer">
        <WizardFooter />
      </div>

      {/* Modal de confirmation */}
      <SuccessModal showSuccess={showSuccess} handleReset={handleReset} />
    </div>
  );
};

export default VerticalTicketWizard;
