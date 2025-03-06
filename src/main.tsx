import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import App from './App.tsx';
import UnifiedUI from './UnifiedUI.tsx';
import { Security, LoginCallback } from '@okta/okta-react';
import { OktaAuth } from '@okta/okta-auth-js';
import oktaConfig from './oktaConfig';

const devMode = true;

// Create Okta authentication instance
const oktaAuth = new OktaAuth(oktaConfig);

const AppWrapper = () => {
    const navigate = useNavigate();

    // Required function to restore the original page after login
    const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
        navigate(originalUri || '/');
    };

    return (
        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
            <Routes>
                <Route path="/login/callback" element={<LoginCallback />} />
                <Route path="/*" element={devMode ? <UnifiedUI /> : <App />} />
            </Routes>
        </Security>
    );
};

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AppWrapper />
        </BrowserRouter>
    </StrictMode>
);
