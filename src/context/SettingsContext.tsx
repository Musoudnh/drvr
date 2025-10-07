import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  fontSize: 12 | 13 | 14;
  setFontSize: (size: 12 | 13 | 14) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_KEY = 'app_global_settings';

const getStoredSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading settings:', error);
  }
  return { fontSize: 12 };
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<12 | 13 | 14>(() => getStoredSettings().fontSize);

  const setFontSize = (size: 12 | 13 | 14) => {
    setFontSizeState(size);
    try {
      const settings = getStoredSettings();
      settings.fontSize = size;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--global-font-size', `${fontSize}px`);
  }, [fontSize]);

  return (
    <SettingsContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
