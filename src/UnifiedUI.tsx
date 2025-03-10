import { useState, useEffect } from "react";
import { Box, Container, Button } from "@mui/material";
import ButtonAppBar from "./components/UnifiedUINavbar.tsx";
import UnifiedUIDashboard from "./components/UnifiedUIDashboard.tsx";
import Grid from "@mui/material/Grid2";
import { useOktaAuth } from "@okta/okta-react";
import { useLocation } from "react-router-dom";
import { AccessToken, IDToken } from "@okta/okta-auth-js";

type TokenData = {
    idToken: string | null;
    accessToken: string | null;
};

const extractTokensFromUrl = (): TokenData => {
    const hash = window.location.hash.substring(1); // Remove #
    const params = new URLSearchParams(hash);
    const idToken = params.get("id_token");
    const accessToken = params.get("access_token");

    window.history.replaceState(null, "", window.location.pathname);

    return { idToken, accessToken };
};

const UnifiedUI = () => {
    const [currentPage, setCurrentPage] = useState("PoolQuoter");
    const { authState, oktaAuth } = useOktaAuth();
    const [tokens, setTokens] = useState<TokenData>({ idToken: null, accessToken: null });

    const location = useLocation();

    useEffect(() => {
        console.log("AuthState at Start:", authState);

        if (!tokens.idToken || !tokens.accessToken) {
            const extractedTokens = extractTokensFromUrl();
            if (extractedTokens.idToken && extractedTokens.accessToken) {
                setTokens(extractedTokens);

                const accessTokenObj: AccessToken = {
                    accessToken: extractedTokens.accessToken,
                    expiresAt: Math.floor(Date.now() / 1000) + 3600,  // 1-hour expiration
                    tokenType: "Bearer",
                    scopes: ["openid", "profile", "email"],
                    authorizeUrl: "https://lhava.okta.com/oauth2/default/v1/authorize",
                    userinfoUrl: "https://lhava.okta.com/oauth2/default/v1/userinfo",
                    claims: { sub: "user-unknown" }
                };

                const idTokenObj: IDToken = {
                    idToken: extractedTokens.idToken,
                    claims: { sub: "user-unknown" },
                    issuer: "https://lhava.okta.com/oauth2",
                    clientId: "0oa1v07fa8xRbg52K1d8",
                    expiresAt: Math.floor(Date.now() / 1000) + 3600,
                    authorizeUrl: "https://lhava.okta.com/oauth2/default/v1/authorize",
                    scopes: ["openid", "profile", "email"]
                };

                oktaAuth.tokenManager.setTokens({ accessToken: accessTokenObj, idToken: idTokenObj });

                oktaAuth.authStateManager.updateAuthState();
            }
        }
    }, [authState, location, tokens, oktaAuth]);

    const handleLogin = async () => {
        await oktaAuth.signInWithRedirect();
    };

    const handleLogout = () => {
        setTokens({ idToken: null, accessToken: null });
        oktaAuth.signOut();
    };

    if (!authState || authState.isPending) {
        return (
            <Grid container style={{ marginTop: "40vh" }}>
                <Grid size={12} sx={{ textAlign: "center", color: "white", fontSize: "18px" }}>
                    Loading...
                </Grid>
            </Grid>
        );
    }

    // ✅ Show login button if not authenticated & no tokens
    if (!authState.isAuthenticated && (!tokens.idToken || !tokens.accessToken)) {
        return (
            <Grid container style={{ marginTop: "40vh" }}>
                <Grid size={12} sx={{ textAlign: "center", color: "white", fontSize: "18px" }}>
                    <Button variant="contained" color="primary" onClick={handleLogin}>
                        Login
                    </Button>
                </Grid>
            </Grid>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minHeight: "100vh",
                width: "100vw",
                textAlign: "center",
                backgroundColor: "#0b0f19",
            }}
        >
            <Container
                disableGutters={true}
                maxWidth="lg"
                sx={{
                    backgroundColor: "#0b0f19",
                    paddingBottom: "2rem",
                }}
            >
                <ButtonAppBar onPageChange={setCurrentPage} />
                <UnifiedUIDashboard currentPage={currentPage} />
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ marginTop: "1rem" }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Container>
        </Box>
    );
};

export default UnifiedUI;
