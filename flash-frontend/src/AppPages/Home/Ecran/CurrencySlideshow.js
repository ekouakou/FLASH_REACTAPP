import React from "react";
import { FlexboxGrid, IconButton } from "rsuite";
import { DollarSign, RefreshCw } from "lucide-react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";
import "./queueStyles.css"; // Importation des styles externalisés
import useFetchData from "../../../services/useFetchData";

function CurrencySlideshow({
  currencies,
  lastUpdate,
  updateCurrencyTimestamp,
}) {
  const serviceParams = {
    search_value: "",
    LG_TYLID: "DEVISE",
    mode: "listListequick",
    order: "t.strLstothervalue2",
  };

  // Utilisation du hook pour récupérer les services
  const {
    data: fetchedCoursDeviseData,
    error: fetchServiceError,
    loading: fetchServiceLoading,
    refetch: refetchServices,
  } = useFetchData(
    "ConfigurationManager/listListequick",
    serviceParams,
    "data"
  );

  // Options pour le carrousel Splide
  const splideOptions = {
    type: "loop",
    perPage: 5,
    perMove: 1,
    gap: "1rem",
    pagination: true,
    arrows: false,
    autoplay: true,
    interval: 4000,
    pauseOnHover: true,
    breakpoints: {
      768: {
        perPage: 1,
      },
    },
  };

  // Fonctions pour simuler des valeurs d'achat et de vente
  const getAchatValue = (currency) => {
    // Simulation de valeurs d'achat basées sur value
    const baseValue = currency.value * 100;
    return Math.round(baseValue * 0.95);
  };

  const getVenteValue = (currency) => {
    // Simulation de valeurs de vente basées sur value
    const baseValue = currency.value * 100;
    return Math.round(baseValue * 1.05);
  };

  return (
    <Splide options={splideOptions} className="currency-splide py-2">
      {Array.isArray(fetchedCoursDeviseData) &&
        fetchedCoursDeviseData.map((item, index) => (
          <SplideSlide key={item.code}>
            <div className="currency-slide-header ">
              <span className="currency-flag">
                <img
                  src={`assets/images/logos/${item.STR_IMAGELISTE}`}
                  alt="Icône Operations de caisse"
                  width="20"
                  height="20"
                  class="rounded-circle"
                />
              </span>
              <div className="currency-code">{item.STR_LSTDESCRIPTION}</div>
              <div className="currency-name">{item.STR_LSTDESCRIPTION}</div>
            </div>
          </SplideSlide>
        ))}
    </Splide>
  );
}

export default CurrencySlideshow;
