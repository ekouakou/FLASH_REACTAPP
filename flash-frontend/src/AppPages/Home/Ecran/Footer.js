import React from "react";
import "./queueStyles.css"; // Importation des styles externalisés
import useFetchData from "../../../services/useFetchData";

function Footer() {
  // Paramètres pour la requête des services
  const serviceParams = {
    search_value: "",
    LG_TYLID: "TEXTMULTIMEDIA",
    mode: "listAgenceListe",
    order: "t.lgLstid.strLstothervalue2",
    LG_AGEID: "004",
  };

  // Utilisation du hook pour récupérer les services
  const {
    data: fetchedServiceData,
    error: fetchServiceError,
    loading: fetchServiceLoading,
    refetch: refetchServices,
  } = useFetchData(
    "ConfigurationManager/listAgenceListe",
    serviceParams,
    "data"
  );

  return (
    <footer className="app-footer">
      <div className="marquee-container">
        {Array.isArray(fetchedServiceData) &&
          fetchedServiceData.map((item, index) => (
            <p key={index} className="marquee-content">
              {item.STR_LSTDESCRIPTION}
            </p>
          ))}
      </div>
    </footer>
  );
}

export default Footer;
