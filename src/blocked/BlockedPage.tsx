import { useEffect, useState } from 'react';

const BlockedPage = () => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    chrome.storage.local.get(['activeImage'], (result) => {
      // FIX: Check if activeImage exists AND is a string
      if (typeof result.activeImage === 'string') {
        setImage(result.activeImage);
      }
    });
  }, []);

  // ... rest of your return statement stays exactly the same ...
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'var(--bg-main)',
      color: 'var(--text-main)',
    }}>
      {image ? (
        <img 
          src={image} 
          alt="Focus" 
          style={{
            maxWidth: '90%',
            maxHeight: '80vh',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            objectFit: 'contain'
          }} 
        />
      ) : (
        <h1>FF01 Active</h1>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <button 
          className="btn" 
          style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)' }}
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default BlockedPage;