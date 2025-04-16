// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Créer le contexte avec une valeur par défaut
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

// Créer le provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Récupération du thème depuis localStorage au démarrage
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Appliquer le thème initial au body
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(savedTheme);
    
    return savedTheme;
  });

  // Mettre à jour le localStorage et le body quand le thème change
  useEffect(() => {
    // Mettre à jour localStorage
    localStorage.setItem('theme', theme);
    
    // Mettre à jour la classe du body
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};