import { useState, useEffect } from 'react';
import type { AppSettings } from './types';
import { defaultSettings } from './types';

export const useStorage = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    chrome.storage.local.get(Object.keys(defaultSettings), (result) => {
      const merged = { ...defaultSettings, ...result };

      // Migration: Ensure all blocked sites have a blockedSince timestamp
      let needsUpdate = false;
      const migratedBlockedSites = merged.blockedSites.map((site: any) => {
        if (!site.blockedSince) {
          needsUpdate = true;
          console.log(`[useStorage] Migrating site ${site.url} with new timestamp`);
          return { ...site, blockedSince: Date.now() };
        }
        return site;
      });

      if (needsUpdate) {
        const updated = { ...merged, blockedSites: migratedBlockedSites };
        setSettings(updated);
        chrome.storage.local.set(updated);
      } else {
        setSettings(merged);
      }

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