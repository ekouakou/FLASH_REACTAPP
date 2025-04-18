import React from 'react';
import { Panel, List, FlexboxGrid } from 'rsuite';
import './queueStyles.css'; // Importation des styles externalisés

function QueueList({ queueItems }) {
  // Fonction pour obtenir la couleur basée sur le type
  const getTypeColor = (type) => {
    switch (type) {
      case 'urgent': return 'red';
      case 'premium': return 'violet';
      default: return 'blue';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En cours': return 'green';
      case 'Préparation': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <Panel bodyFill className="queue-panel">
      <div className="queue-header">
        <h2 className="queue-title">File d'attente actuelle</h2>
        <p className="queue-subtitle">Mise à jour en temps réel</p>
      </div>

      <div className="queue-list-container">
        <List>
          {queueItems.map((item, index) => (
            <List.Item key={item.id}>
              <Panel
                bordered
                className={`queue-item ${index === 0 ? 'active' : ''}`}
                style={{
                  borderLeftColor: getTypeColor(item.type)
                }}
              >
                <FlexboxGrid justify="space-between" align="middle">
                  <FlexboxGrid.Item>
                    <FlexboxGrid align="middle">
                      <FlexboxGrid.Item className="mr-15">
                        <div className={`queue-number ${index === 0 ? 'active' : ''}`}>
                          {item.id.slice(-2)}
                        </div>
                      </FlexboxGrid.Item>

                      <FlexboxGrid.Item>
                        <div className="queue-name">{item.name}</div>
                        <div className={`queue-status ${getStatusColor(item.status)}`}>
                          {item.status}
                        </div>
                      </FlexboxGrid.Item>
                    </FlexboxGrid>
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item className="text-right">
                    <div className="queue-room">{item.room}</div>
                    <div className="queue-time">{item.estimatedTime} min</div>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </Panel>
            </List.Item>
          ))}
        </List>
      </div>
    </Panel>
  );
}

export default QueueList;