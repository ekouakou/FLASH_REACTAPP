// src/AppPages/Home/ThemeSwitcher.js
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Toggle } from 'rsuite';
import 'rsuite/dist/rsuite.min.css'; // Import des styles React Suite

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  
  // Le Toggle est actif quand le thème est 'dark'
  const isDarkMode = theme === 'dark';
  
  return (
    <div className="theme-switcher">
      <div className="theme-toggle-container">
        {/* <span className="toggle-icon">☀️</span> */}
        <Toggle 
          checked={isDarkMode}
          onChange={toggleTheme}
          size="md"
          checkedChildren="🌙"
          unCheckedChildren="☀️"
        />
        {/* <span className="toggle-icon">🌙</span> */}
      </div>
      {/* <span className="toggle-label">
        {isDarkMode ? 'Mode sombre' : 'Mode clair'}
      </span> */}
    </div>
  );
}

export default ThemeSwitcher;