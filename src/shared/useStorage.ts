import { useState, useEffect } from 'react';
import type { AppSettings } from './types';
import { defaultSettings } from './types';

export const useStorage = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    chrome.storage.local.get(Object.keys(defaultSettings), (result) => {
      setSettings({ ...defaultSettings, ...result });
      setLoading(false);
    });
  }, []);

  // Helper to save data
  const saveSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await chrome.storage.local.set(updated);
  };

  return { settings, saveSettings, loading };
};