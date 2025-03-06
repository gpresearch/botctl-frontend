import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UnifiedUI from './UnifiedUI.tsx'
import { Security, LoginCallback, useOktaAuth } from '@okta/okta-react';
import oktaConfig from './oktaConfig.ts';
import { OktaAuth } from '@okta/okta-auth-js'; // ✅ Import OktaAuth instance

const devMode = true

const oktaAuth = new OktaAuth(oktaConfig);

function AuthWrapper() {
  const { authState, oktaAuth } = useOktaAuth();

  if (!authState || !authState.isAuthenticated) {
    oktaAuth.signInWithRedirect(); // Automatically redirect to login
    return <div>Redirecting to login...</div>;
  }

  return devMode ? <UnifiedUI /> : <App />;
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Security oktaAuth={oktaAuth} restoreOriginalUri={async (_oktaAuth, originalUri) => {
            window.location.replace(originalUri || '/');
        }}>      {window.location.pathname === '/login/callback' ? (
            <LoginCallback />
        ) : (
            <AuthWrapper />
        )}
        </Security>
    </StrictMode>,
)
