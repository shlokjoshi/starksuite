import type { ReactNode } from 'react';

import { useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
}
