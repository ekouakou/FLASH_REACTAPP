import React, { useEffect, useState } from "react";
import { Grid, Row, Col, Button } from "rsuite";
import useFetchData from "../../../../services/useFetchData";
import SelectionCard from "./SelectionCard";

const SatisfactionFeedback = ({
  handleEmotionSelect,
  handlePrevious,
  selectedEmotion,
  selectionDelay,
  getSelectedPrestationColor,
  isMobile,
}) => {
  const [emotions, setEmotions] = useState([]);

  const serviceColors = [
    "#3498db",
    "#9b59b6",
    "#2ecc71",
    "#e74c3c",
    "#f39c12",
    "#1abc9c",
  ];
  const serviceParams = {
    search_value: "",
    LG_TYLID: "EMOTICONE",
    mode: "listListequick",
    order: "t.strLstothervalue2",
  };

  const {
    data: fetchedServiceData,
    error: fetchServiceError,
    loading: fetchServiceLoading,
    refetch: refetchServices,
  } = useFetchData(
    "ConfigurationManager/listListequick",
    serviceParams,
    "data"
  );

  // Map the raw API data to the format expected by SelectionCard
  useEffect(() => {
    if (fetchedServiceData && Array.isArray(fetchedServiceData)) {
      const mappedEmotions = fetchedServiceData.map((item, index) => ({
        id: item.LG_LSTID,
        name: item.STR_LSTDESCRIPTION, // This is what was missing - we need a name property
        description: item.STR_LSTDESCRIPTION,
        iconName: item.STR_LSTOTHERVALUE,

        color: item.STR_LSTOTHERVALUE3, // Attribuer une couleur depuis la liste
        imagePath: `assets/images/${
          item.STR_FOLDER
        }${item.STR_LSTOTHERVALUE.trim()}`,
        iconName: item.STR_LSTOTHERVALUE,
      }));
      setEmotions(mappedEmotions);
    }
  }, [fetchedServiceData]);

  console.log("Original data:", fetchedServiceData);
  console.log("Mapped emotions:", emotions);

  return (
    <>
      <div className="wizard-container">
        <h3 className="wizard-step-title">Votre satisfaction</h3>
        <p className="wizard-step-description">
          Merci de nous faire part de votre niveau de satisfaction concernant
          nos services.
        </p>

        <Grid fluid className="selection-grid">
          <Row gutter={isMobile ? 10 : 20}>
            {Array.isArray(emotions) &&
              emotions.map((item) => (
                <Col
                  xs={24}
                  sm={12}
                  md={6}
                  key={item.id}
                  style={{ marginBottom: "20px" }}
                  className="equal-height-col"
                >
                  <SelectionCard
                    item={item}
                    isSelected={selectedEmotion === item.id}
                    disabled={selectionDelay && selectedEmotion !== item.id}
                    onSelect={() =>
                      !selectionDelay && handleEmotionSelect(item.id)
                    }
                    icon={item.iconName} // Use the iconName from our mapped data
                    type="service"
                  />
                </Col>
              ))}
          </Row>
        </Grid>

        <div className="wizard-actions mt-4">
          <Button appearance="subtle" onClick={handlePrevious}>
            Retour
          </Button>
          <Button
            appearance="primary"
            onClick={() => {
              /* This button should not need an action as clicking an emoticon will trigger handleEmotionSelect */
            }}
            disabled={!selectedEmotion}
            style={{
              backgroundColor: getSelectedPrestationColor(),
              borderColor: getSelectedPrestationColor(),
              opacity: !selectedEmotion ? 0.6 : 1,
            }}
          >
            Continuer
          </Button>
        </div>
      </div>
    </>
  );
};

export default SatisfactionFeedback;
