import type { AppSettings } from '../shared/types';

checkAndBlock();

function checkAndBlock() {
  const currentUrl = window.location.href.toLowerCase();

  chrome.storage.local.get(['blockedSites', 'defaultImage'], (result) => {
    const settings = result as unknown as AppSettings;
    const blockedSites = settings.blockedSites || [];

    const matchedSite = blockedSites.find((site) => 
      currentUrl.includes(site.url.toLowerCase())
    );

    if (matchedSite) {
      const imageToShow = matchedSite.customImage || settings.defaultImage;

      chrome.storage.local.set({ activeImage: imageToShow }, () => {
        // FIX: Attach the original URL as a query parameter '?from=...'
        const baseUrl = chrome.runtime.getURL('src/blocked/index.html');
        const fullUrl = `${baseUrl}?from=${encodeURIComponent(currentUrl)}`;
        window.location.href = fullUrl;
      });
    }
  });
}