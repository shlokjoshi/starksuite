import { SignIn, SignUp } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';

import { AuthenticatedPlayground } from './AuthenticatedPlayground';
import { AuthProvider } from './AuthProvider';
import { LandingPage } from './LandingPage';
import { ProtectedRoute } from './ProtectedRoute';

const SignInPage = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  };

  return (
    <div style={containerStyle}>
      <SignIn
        appearance={{
          elements: {
            rootBox: {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
            },
          },
        }}
        path="/sign-in"
        redirectUrl="/playground"
        routing="path"
        signUpUrl="/sign-up"
      />
    </div>
  );
};

const SignUpPage = () => {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  };

  return (
    <div style={containerStyle}>
      <SignUp
        appearance={{
          elements: {
            rootBox: {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
            },
          },
        }}
        path="/sign-up"
        redirectUrl="/playground"
        routing="path"
        signInUrl="/sign-in"
      />
    </div>
  );
};

function RouteHandler() {
  const location = useLocation();

  useEffect(() => {
    // Hide debug menu on non-playground routes
    const debugMenu = document.querySelector('.debug-menu');
    if (debugMenu) {
      debugMenu.style.display =
        location.pathname === '/playground' ? 'block' : 'none';
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route element={<LandingPage />} path="/" />
      <Route element={<SignInPage />} path="/sign-in/*" />
      <Route element={<SignUpPage />} path="/sign-up/*" />
      <Route
        element={
          <ProtectedRoute>
            <AuthenticatedPlayground />
          </ProtectedRoute>
        }
        path="/playground"
      />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RouteHandler />
      </AuthProvider>
    </BrowserRouter>
  );
}
