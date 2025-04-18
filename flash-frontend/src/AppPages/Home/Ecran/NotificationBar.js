import React from 'react';
import { Panel, FlexboxGrid, IconButton } from 'rsuite';
import { X, Bell } from 'lucide-react';
import './queueStyles.css'; // Importation des styles externalisés

function NotificationBar({ nextPatient, setShowNotification }) {
  return (
    <Panel bordered className="notification-bar">
      <FlexboxGrid justify="space-between" align="middle" className="mb-10">
        <FlexboxGrid.Item>
          <h4>Prochain patient</h4>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <IconButton
            icon={<X size={16} />}
            size="xs"
            appearance="subtle"
            onClick={() => setShowNotification(false)}
          />
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <FlexboxGrid align="middle">
        <FlexboxGrid.Item className="mr-15">
          <div className="notification-icon">
            <Bell size={18} color="#1c64f2" />
          </div>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <p className="notification-name">{nextPatient.name}</p>
          <p className="notification-room">{nextPatient.room}</p>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Panel>
  );
}

export default NotificationBar;