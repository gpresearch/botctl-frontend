import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import UnifiedUI from "./UnifiedUI.tsx";
import { Security } from "@okta/okta-react";
import { OktaAuth } from "@okta/okta-auth-js";
import oktaConfig from "./oktaConfig";

const oktaAuth = new OktaAuth(oktaConfig);

const AppWrapper = () => {
    const navigate = useNavigate();

    const restoreOriginalUri = async (_oktaAuth: OktaAuth, originalUri: string) => {
        navigate(originalUri || "/");
    };

    return (
        <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
            <Routes>
                <Route path="/*" element={<UnifiedUI />} />
            </Routes>
        </Security>
    );
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <AppWrapper />
        </BrowserRouter>
    </StrictMode>
);
