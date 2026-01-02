import { useState, useEffect } from 'react';
import { useStorage } from '../shared/useStorage';

const Options = () => {
  const { settings, saveSettings, loading } = useStorage();
  const [newSiteInput, setNewSiteInput] = useState('');

  // NEW: State to force re-render every second for the timer
  const [now, setNow] = useState(Date.now());

  // NEW: Timer effect
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading Settings...</div>;

  console.log('[Options] Rendering with settings:', settings);

  // --- Helpers ---
  const handleImageToBase64 = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result as string);
    reader.readAsDataURL(file);
  };

  // NEW: Format the duration into Days, Hours, Mins, Secs
  const formatDuration = (timestamp?: number) => {
    if (!timestamp) return "Legacy Block (Re-add to track time)";

    const diff = Math.max(0, now - timestamp);
    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const addSite = () => {
    const url = newSiteInput.trim();
    if (!url) return;

    if (settings.blockedSites.some(s => s.url === url)) return;

    saveSettings({
      blockedSites: [
        ...settings.blockedSites,
        // NEW: Add 'blockedSince: Date.now()' when creating a block
        { url, customImage: null, blockedSince: Date.now() }
      ]
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

      {/* 1. GLOBAL FALLBACK IMAGE */}
      <section className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginTop: 0 }}>👁️ The Holy Vision</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          This is what appears when you stray from the path. Ginny suggests a picture of your bank balance.
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

      {/* 2. BLOCKED SITES */}
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
            placeholder="e.g. instagram.com (she doesn't care about you)"
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

              {/* MODIFIED: Site Name + Timer */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', fontSize: '15px' }}>{site.url}</div>

                {/* The Live Counter */}
                <div style={{ fontSize: '12px', marginTop: '4px', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Free for: </span>
                  <span style={{ fontFamily: 'monospace' }}>
                    {formatDuration(site.blockedSince)}
                  </span>
                </div>
              </div>

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
              No sins added? You are either a liar or already enlightened.
            </div>
          )}
        </div>
      </section>

      {/* 3. THE FOOTER */}
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