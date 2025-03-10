import { useState, useEffect } from "react";
import { Box, Container, Button } from "@mui/material";
import ButtonAppBar from "./components/UnifiedUINavbar.tsx";
import UnifiedUIDashboard from "./components/UnifiedUIDashboard.tsx";
import Grid from "@mui/material/Grid2";
import { useOktaAuth } from "@okta/okta-react";

const UnifiedUI = () => {
    const [currentPage, setCurrentPage] = useState("PoolQuoter");

    // Okta authentication hook
    const { authState, oktaAuth } = useOktaAuth();

    useEffect(() => {
        if (authState === null || authState?.isPending) {
            console.log("auth state still loading...");
            return; // Don't attempt redirect if authState is still loading
        }

        if (!authState.isAuthenticated) {
            oktaAuth.signInWithRedirect();
        }
    }, [authState, oktaAuth]);

    // Show loading state while authState is initializing
    if (!authState || authState.isPending) {
        return (
            <Grid container style={{ marginTop: '40vh' }}>
                <Grid size={12} sx={{ textAlign: 'center', color: 'white', fontSize: '18px' }}>
                    Loading...
                </Grid>
            </Grid>
        );
    }

    if (!authState.isAuthenticated) {
        return (
            <Grid container style={{ marginTop: '40vh' }}>
                <Grid size={12} sx={{ textAlign: 'center', color: 'white', fontSize: '18px' }}>
                    Redirecting to login...
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
                    onClick={() => oktaAuth.signOut()}
                >
                    Logout
                </Button>
            </Container>
        </Box>
    );
};

export default UnifiedUI;
