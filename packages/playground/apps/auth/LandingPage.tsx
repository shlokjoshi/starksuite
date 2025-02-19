import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/playground');
    }
  }, [isSignedIn, navigate]);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '2rem',
    textAlign: 'center' as const,
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '1rem',
    marginTop: '2rem',
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007AFF',
    color: 'white',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#E5E5EA',
    color: '#333',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome to Stark Suite</h1>
      <div style={buttonContainerStyle}>
        <button onClick={() => navigate('/sign-in')} style={primaryButtonStyle}>
          Sign In
        </button>
        <button
          onClick={() => navigate('/sign-up')}
          style={secondaryButtonStyle}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
