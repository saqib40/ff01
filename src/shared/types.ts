export interface BlockedSite {
  url: string;
  customImage?: string | null; // Optional specific image
  blockedSince?: number; // Stores the timestamp (ms) when blocked
}

export interface AppSettings {
  blockedSites: BlockedSite[]; // Changed from string[] to object array
  defaultImage: string | null; // The fallback "global" image
}

export const defaultSettings: AppSettings = {
  blockedSites: [],
  defaultImage: null
};