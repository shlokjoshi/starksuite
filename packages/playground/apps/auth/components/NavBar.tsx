import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function NavBar() {
  const { signOut, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Initial theme check
    setIsLightMode(!document.body.classList.contains('dark'));

    // Watch for theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          setIsLightMode(!document.body.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!isSignedIn) {
    return null;
  }

  const buttonColor = isLightMode ? '#ff0000' : '#00ffff';
  const buttonHoverBg = isLightMode ? '#ff000020' : '#00ffff20';
  const buttonShadow = isLightMode
    ? '0 0 10px rgba(255, 0, 0, 0.3)'
    : '0 0 10px rgba(0, 255, 255, 0.3)';
  const buttonHoverShadow = isLightMode
    ? '0 0 20px rgba(255, 0, 0, 0.5)'
    : '0 0 20px rgba(0, 255, 255, 0.5)';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleSignOut}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = buttonHoverBg;
          e.currentTarget.style.boxShadow = buttonHoverShadow;
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.boxShadow = buttonShadow;
          e.currentTarget.style.transform = 'scale(1)';
        }}
        style={{
          padding: '12px 24px',
          backgroundColor: 'transparent',
          border: `2px solid ${buttonColor}`,
          color: buttonColor,
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: '14px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: buttonShadow,
        }}
      >
        Disconnect
      </button>
    </div>
  );
}
