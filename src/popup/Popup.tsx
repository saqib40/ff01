import { useEffect, useState } from 'react';
import { useStorage } from '../shared/useStorage';
import type { BlockedSite } from '../shared/types';
import './Popup.css';

const Popup = () => {
  const { settings, saveSettings, loading } = useStorage();
  const [currentHost, setCurrentHost] = useState<string>('');
  const [originalFullUrl, setOriginalFullUrl] = useState<string>('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab?.url) {
        try {
          let urlToAnalyze = currentTab.url;
          
          if (urlToAnalyze.includes('src/blocked/index.html')) {
            const urlObj = new URL(urlToAnalyze);
            const fromParam = urlObj.searchParams.get('from');
            if (fromParam) {
              urlToAnalyze = decodeURIComponent(fromParam);
              setOriginalFullUrl(urlToAnalyze);
            }
          } else {
            setOriginalFullUrl(urlToAnalyze);
          }

          const urlObj = new URL(urlToAnalyze);
          if (urlObj.protocol.startsWith('http')) {
            setCurrentHost(urlObj.hostname);
          }
        } catch (e) {
          console.error("Invalid URL", e);
        }
      }
    });
  }, []);

  if (loading) return <div style={{ padding: '20px', background: 'var(--bg-main)', color: 'var(--text-main)' }}>Loading...</div>;

  const blockedEntry = settings.blockedSites.find(site => 
    currentHost.includes(site.url) && site.url !== ''
  );
  const isBlocked = !!blockedEntry;

  const toggleBlock = async () => {
    if (!currentHost) return;

    if (isBlocked) {
      const newSites = settings.blockedSites.filter(site => !currentHost.includes(site.url));
      await saveSettings({ blockedSites: newSites });
      
      if (originalFullUrl && originalFullUrl !== currentHost) {
         chrome.tabs.update({ url: originalFullUrl });
      } else {
         chrome.tabs.reload();
      }
    } else {
      const newSite: BlockedSite = { url: currentHost, customImage: null };
      await saveSettings({ blockedSites: [...settings.blockedSites, newSite] });
      chrome.tabs.reload();
    }
    
    window.close();
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      padding: '16px', 
      background: 'var(--bg-main)', 
      color: 'var(--text-main)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ fontSize: '20px' }}>🎯</span>
        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>FF01</h2>
      </div>

      {/* Main Card */}
      <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
        {currentHost ? (
          <>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                {originalFullUrl.includes('src/blocked/index.html') ? 'Target Website' : 'Current Website'}
              </span>
              <span style={{ fontWeight: 600, fontSize: '16px', wordBreak: 'break-all' }}>
                {currentHost}
              </span>
            </div>

            {isBlocked ? (
              <>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🛡️</div>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                  Access Denied. Go do some work.
                </p>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }} 
                  onClick={toggleBlock}
                >
                  Unblock Site
                </button>
              </>
            ) : (
              <>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>👀</div>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                  This site is currently safe. For now.
                </p>
                <button 
                  className="btn btn-danger" 
                  style={{ width: '100%' }} 
                  onClick={toggleBlock}
                >
                  Ban This Distraction
                </button>
              </>
            )}
          </>
        ) : (
          <div style={{ color: 'var(--text-muted)', fontSize: '14px', fontStyle: 'italic' }}>
            FF01 has no power here. <br/>(System Page)
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto' }}>
        <button 
          className="btn" 
          style={{ 
            width: '100%', 
            background: 'var(--bg-input)', 
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--text-muted)',
            fontSize: '13px'
          }}
          onClick={() => chrome.runtime.openOptionsPage()}
        >
          ⚙️ Manage Settings
        </button>
      </div>
    </div>
  );
};

export default Popup;