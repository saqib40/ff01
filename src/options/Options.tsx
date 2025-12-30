import { useState } from 'react';
import { useStorage } from '../shared/useStorage';

const Options = () => {
  const { settings, saveSettings, loading } = useStorage();
  const [newSiteInput, setNewSiteInput] = useState('');

  if (loading) return <div style={{padding: 20}}>Loading...</div>;

  // --- Helpers ---
  const handleImageToBase64 = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  const addSite = () => {
    const url = newSiteInput.trim();
    if (!url) return;
    
    // Check duplicates
    if (settings.blockedSites.some(s => s.url === url)) return;

    saveSettings({
      blockedSites: [...settings.blockedSites, { url, customImage: null }]
    });
    setNewSiteInput('');
  };

  const removeSite = (urlToRemove: string) => {
    saveSettings({
      blockedSites: settings.blockedSites.filter(s => s.url !== urlToRemove)
    });
  };

  const updateSiteImage = (urlToUpdate: string, file: File) => {
    handleImageToBase64(file, (base64) => {
      const updatedSites = settings.blockedSites.map(site => 
        site.url === urlToUpdate ? { ...site, customImage: base64 } : site
      );
      saveSettings({ blockedSites: updatedSites });
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px 60px 20px' }}>
      <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>FF01 Settings</h1>
      
      <section className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0 }}>👁️ The Holy Vision</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          This is what appears when you stray from the path. Guruji Ginny suggests picture of your bank balance, 
          your disappointed parents, or the bike you can't afford yet will be most appropriate but then he also doesn't mind you uploading your stupid photo too.
        </p>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginTop: '16px' }}>
          <div style={{ flex: 1 }}>
            <label className="btn btn-primary" style={{ display: 'inline-block' }}>
              Upload Enlightenment
              <input 
                type="file" 
                hidden 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageToBase64(e.target.files[0], (b64) => saveSettings({ defaultImage: b64 }));
                  }
                }} 
              />
            </label>
          </div>
          
          {settings.defaultImage && (
            <div style={{ width: '150px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #444' }}>
              <img src={settings.defaultImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>
      </section>

      <section className="card">
        <h2 style={{ marginTop: 0 }}>🧠 The Sources of Brain Rot</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
           Which websites are keeping you poor? List them here. Be honest.
        </p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="text" 
            value={newSiteInput}
            onChange={(e) => setNewSiteInput(e.target.value)}
            placeholder="e.g. instagram.com (yes of course)"
            style={{ flex: 1 }}
            onKeyDown={(e) => e.key === 'Enter' && addSite()}
          />
          <button className="btn btn-primary" onClick={addSite}>Ban It</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {settings.blockedSites.map((site) => (
            <div key={site.url} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              background: 'var(--bg-input)', 
              padding: '12px', 
              borderRadius: '8px' 
            }}>
              {/* Site Name */}
              <div style={{ flex: 1, fontWeight: '500' }}>{site.url}</div>
              
              {/* Custom Image Logic */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {site.customImage ? (
                  <img src={site.customImage} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Using Global</span>
                )}
                
                <label className="btn" style={{ background: '#475569', fontSize: '12px', padding: '6px 12px' }}>
                  {site.customImage ? 'Change' : 'Set Custom'}
                  <input 
                    type="file" 
                    hidden 
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && updateSiteImage(site.url, e.target.files[0])} 
                  />
                </label>
              </div>

              <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => removeSite(site.url)}>
                ✕
              </button>
            </div>
          ))}
          
          {settings.blockedSites.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
              No sins added? Surely a liar.
            </div>
          )}
        </div>
      </section>

      <footer style={{ 
        marginTop: '60px', 
        textAlign: 'center', 
        color: 'var(--text-muted)', 
        fontSize: '13px',
        lineHeight: '1.8',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        paddingTop: '30px'
      }}>
        <p style={{ fontWeight: 'bold', fontSize: '15px', color: 'var(--text-main)', marginBottom: '10px' }}>
          Yo stupid, what's up?
        </p>
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <p>
            You finally reached here.
          </p>
          <p style={{ marginTop: '10px' }}>
             Post-reading that self-help book, and listening to that podcast you found on the last page—the one that 
             claimed to change your life—you surely are on the right track. Of course it will change your life. 
             How else does change happen?
          </p>
          <p style={{ marginTop: '10px' }}>
            You will get a girl soon (despite what your friends tell you). Your dad will be proud of you—despite and regardless of your behavior.
          </p>
          <p style={{ marginTop: '10px' }}>
            You will make money despite knowing skills close to none. You won't have to beg your friend anymore. 
            <span style={{ fontStyle: 'italic', color: 'var(--primary)' }}> Unbelievable, I know.</span>
          </p>
          <p style={{ marginTop: '10px' }}>
            And as that self-help guru told you, the path to such a life starts with this extension from 
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}> Room FF01, SVN Hostel</span>. 
            You have finally found it after your long & tiring odyssey.
          </p>
          <p style={{ marginTop: '15px' }}>
            Yes, it surely is the first step to achieve Buddha's enlightenment. No doubt about that.
          </p>
          <div style={{ fontStyle: 'italic', opacity: 0.8, marginTop: '20px', fontSize: '12px', padding: '0 20px' }}>
             Tried, tested, and verified by the already enlightened <span style={{ color: 'var(--text-main)' }}>ChatGPT</span> and 
             <span style={{ color: 'var(--text-main)' }}> Ginny</span> (the godmen from FF01, SVN, NHCE, writer of numerous self-help books).
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Options;