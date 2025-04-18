// src/components/InfoPanel.js
import React from 'react';
import { Panel, FlexboxGrid, List } from 'rsuite';
import { Info } from 'lucide-react';
import './queueStyles.css'; // Importation des styles externalisés

function InfoPanel() {
  return (
    <Panel 
      header={
        <FlexboxGrid align="middle">
          <Info size={20} className="panel-header-icon" />
          <span className="panel-header-text">
            Informations importantes
          </span>
        </FlexboxGrid>
      } 
      bordered 
      className="info-panel"
    >
      <div className="scrollable-content">
        <List>
          <List.Item>
            <FlexboxGrid align="top">
              <FlexboxGrid.Item className="mr-10">
                <div className="circle-icon blue">1</div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item>
                Veuillez garder votre téléphone allumé pour recevoir les notifications.
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>

          <List.Item>
            <FlexboxGrid align="top">
              <FlexboxGrid.Item className="mr-10">
                <div className="circle-icon blue">2</div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item>
                Préparez vos documents d'identité et votre numéro de dossier avant l'appel.
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>

          <List.Item>
            <FlexboxGrid align="top">
              <FlexboxGrid.Item className="mr-10">
                <div className="circle-icon blue">3</div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item>
                L'ordre de passage peut être modifié selon les urgences et les priorités.
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </List.Item>
        </List>
      </div>
    </Panel>
  );
}

export default InfoPanel;