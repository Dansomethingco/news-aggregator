'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface Preferences {
  categories: string[];
  articleLength: string;
  contentTypes: string[];
  notifications: string[];
  country: string;
}

interface PreferencesContextType {
  preferences: Preferences;
  updatePreferences: (updatedPreferences: Partial<Preferences>) => void;
}

const defaultPreferences: Preferences = {
  categories: ['General', 'Business', 'Technology', 'Sports', 'Entertainment', 'Health', 'Science'],
  articleLength: 'medium',
  contentTypes: ['text articles', 'videos', 'podcasts'],
  notifications: ['breaking news alerts', 'daily news digest'],
  country: 'gb' // Default to Great Britain
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

  const updatePreferences = (updatedPreferences: Partial<Preferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updatedPreferences
    }));
  };

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      const parsedPrefs = JSON.parse(savedPreferences);
      // Ensure country is always set with a default value if not present
      if (!parsedPrefs.country) {
        parsedPrefs.country = 'gb';
      }
      setPreferences(parsedPrefs);
    } else {
      // Initialize with default preferences
      setPreferences(defaultPreferences);
    }
  }, []);

  useEffect(() => {
    // Save preferences to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Ensure country is always set in the state
    if (!preferences.country) {
      updatePreferences({ country: 'gb' });
    }
  }, [preferences]);

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
