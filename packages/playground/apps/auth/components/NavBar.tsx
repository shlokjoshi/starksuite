import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export function NavBar() {
  const { signOut, isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        padding: '1rem',
        zIndex: 1000,
      }}
    >
      <button
        className="cyber-button cyan"
        onClick={handleSignOut}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '0.9rem',
        }}
      >
        Disconnect
      </button>
    </div>
  );
}
