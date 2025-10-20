import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const defaultTheme = {
  boardLight: '#F0D9B5',
  boardDark: '#B58863',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  primaryColor: '#667eea',
  secondaryColor: '#764ba2',
  textColor: '#ffffff',
  glassOpacity: 0.08,
  pieceSet: 'default'
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('chessTheme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem('chessTheme', JSON.stringify(theme));
  }, [theme]);

  const updateTheme = (newTheme) => {
    setTheme(prev => ({ ...prev, ...newTheme }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
