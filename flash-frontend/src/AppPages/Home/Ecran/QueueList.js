import React, { useState, useEffect } from "react";
import { Panel, List, FlexboxGrid } from "rsuite";
import "./queueStyles.css"; // Importation des styles externalisés
import useFetchData from "../../../services/useFetchData";
import NotificationBar from "./NotificationBar"; // Importation du composant NotificationBar

function QueueList({ queueItems: initialQueueItems }) {
  const [queueItems, setQueueItems] = useState(initialQueueItems || []);
  const [showNotification, setShowNotification] = useState(false);
  const [nextPatient, setNextPatient] = useState(null);
  const [processedTickets, setProcessedTickets] = useState(new Set());
  const MAX_ITEMS = 8; // Constante pour limiter le nombre d'éléments affichés

  // Fonction pour obtenir la couleur basée sur le type
  const getTypeColor = (type) => {
    switch (type) {
      case "urgent":
        return "red";
      case "premium":
        return "violet";
      default:
        return "blue";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "En cours":
        return "green";
      case "Préparation":
        return "orange";
      default:
        return "gray";
    }
  };

  const serviceParams = {
    search_value: "",
    mode: "readTicket",
    LG_AGEID: "004",
    LG_LSTID: "12926453248142854859",
  };

  // Utilisation du hook pour récupérer les services
  const {
    data: readTicketData,
    error: fetchServiceError,
    loading: fetchServiceLoading,
    refetch: refetchServices,
  } = useFetchData("TicketManager/readTicket", serviceParams);

  // Effet pour vérifier et ajouter les nouveaux tickets
  useEffect(() => {
    // Si des données sont reçues et que le code_statut est égal à 1, on ajoute le ticket à la liste
    if (readTicketData && readTicketData.code_statut === "1") {
      const ticketId = readTicketData.STR_TICNAME;

      // Vérifier que le ticket est valide et n'a pas déjà été traité
      if (ticketId && ticketId !== "--") {
        // Création d'un nouvel item formaté pour correspondre à la structure attendue
        const newTicket = {
          STR_TICNAME: ticketId,
          name: `${readTicketData.LG_LSTOPEID}`,
          LG_LSTOPEID: readTicketData.LG_LSTOPEID,
          LG_PAPID: readTicketData.LG_PAPID,
          desc_statut: readTicketData.desc_statut,
          estimatedTime: 5, // Vous pouvez ajuster cette valeur selon vos besoins
          type: "normal", // Vous pouvez définir le type en fonction de vos besoins
        };

        console.log("Nouveau ticket détecté:", newTicket);

        // Ajouter à la liste des tickets traités
        setProcessedTickets((prev) => new Set(prev).add(ticketId));

        // Retirer le ticket existant avec le même ID avant d'ajouter le nouveau
        setQueueItems((prevItems) => {
          // Filtrer pour retirer l'ancien ticket avec le même ID
          const filteredItems = prevItems.filter(
            (item) => item.STR_TICNAME !== ticketId
          );
          // Ajouter le nouveau ticket au début et limiter à MAX_ITEMS
          const updatedItems = [newTicket, ...filteredItems].slice(
            0,
            MAX_ITEMS
          );
          return updatedItems;
        });

        // Déclencher la notification de manière fiable
        setTimeout(() => {
          setNextPatient(newTicket);
          setShowNotification(true);
        }, 300); // Petit délai pour s'assurer que l'état est mis à jour
      }
    }
  }, [readTicketData]);

  // Polling toutes les 5 secondes (augmentation de 3 à 5 pour réduire la charge)
  useEffect(() => {
    console.log("Initialisation du polling des tickets...");

    // Appel immédiat après un court délai pour permettre au composant de se monter complètement
    const initialTimeout = setTimeout(() => {
      refetchServices();
    }, 500);

    // Configuration de l'intervalle (toutes les 5 secondes)
    const intervalId = setInterval(refetchServices, 5000);

    // Nettoyage à la destruction du composant
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
      console.log("Polling arrêté");
    };
  }, []); // Tableau de dépendances vide pour ne s'exécuter qu'une seule fois au montage

  // Masquer automatiquement la notification après 20 secondes (augmenté pour donner plus de temps à la synthèse vocale)
  useEffect(() => {
    if (showNotification) {
      const timeoutId = setTimeout(() => {
        setShowNotification(false);
      }, 20000);

      return () => clearTimeout(timeoutId);
    }
  }, [showNotification]);

  return (
    <>
      {showNotification && nextPatient && (
        <NotificationBar
          nextPatient={nextPatient}
          setShowNotification={setShowNotification}
        />
      )}

      <Panel bodyFill className="queue-panel">
        {queueItems.length > 0 && (
          <div className="queue-header">
            <h2 className="queue-title">File d'attente actuelle</h2>
            <p className="queue-subtitle">Mise à jour en temps réel</p>
          </div>
        )}

        <div className="queue-list-container">
          {queueItems.length > 0 ? (
            <List>
              {queueItems.map((item, index) => (
                <List.Item key={item.STR_TICNAME}>
                  <Panel
                    bordered
                    className={`queue-item ${index === 0 ? "active" : ""}`}
                    style={{
                      borderLeftColor: getTypeColor(item.type),
                    }}
                  >
                    <FlexboxGrid justify="space-between" align="middle">
                      <FlexboxGrid.Item>
                        <FlexboxGrid align="middle">
                          <FlexboxGrid.Item className="mr-15">
                            <div
                              className={`queue-number ${
                                index === 0 ? "active" : ""
                              }`}
                            >
                              <img
                                src="assets/images/logos/cartes-bancaires.svg"
                                alt="Icône Operations de caisse"
                                width="30"
                                height="30"
                                className="rounded-circle"
                              />
                            </div>
                          </FlexboxGrid.Item>

                          <FlexboxGrid.Item>
                            <div className="queue-name">{item.STR_TICNAME}</div>
                            <div
                              className={`queue-status ${getStatusColor(
                                item.LG_LSTOPEID
                              )}`}
                            >
                              {item.LG_LSTOPEID}
                            </div>
                          </FlexboxGrid.Item>
                        </FlexboxGrid>
                      </FlexboxGrid.Item>

                      <FlexboxGrid.Item className="text-right">
                        <div className="queue-room">{item.LG_PAPID}</div>
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </Panel>
                </List.Item>
              ))}
            </List>
          ) : (
            <div
              className="no-queue-image"
              style={{
                height: "100%",
                backgroundImage:
                  'url("https://afgbankcotedivoire.com/wp-content/uploads/2023/12/CONTACT12.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  padding: "15px",
                  borderRadius: "5px",
                  textAlign: "center",
                }}
              >
                <h3>Aucun ticket en attente</h3>
                <p>La file d'attente est actuellement vide</p>
              </div>
            </div>
          )}
        </div>
      </Panel>
    </>
  );
}

export default QueueList;
