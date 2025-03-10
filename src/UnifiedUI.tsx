import { useState, useEffect } from "react";
import { Box, Container, Button } from "@mui/material";
import ButtonAppBar from "./components/UnifiedUINavbar.tsx";
import UnifiedUIDashboard from "./components/UnifiedUIDashboard.tsx";
import Grid from "@mui/material/Grid2";
import { useOktaAuth } from "@okta/okta-react";

const UnifiedUI = () => {
    const [currentPage, setCurrentPage] = useState("PoolQuoter");
    const { authState, oktaAuth } = useOktaAuth();

    // Login function (no redirects)
    const handleLogin = async () => {
        try {
            const transaction = await oktaAuth.signIn({
                username: "your-email@example.com", // Replace with user input
                password: "your-password", // Replace with user input
            });

            if (transaction.status === "SUCCESS") {
                await oktaAuth.token.getWithoutPrompt();
                console.log("Login successful!", transaction.sessionToken);
            } else {
                console.error("Login failed:", transaction);
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    useEffect(() => {
        console.log("AuthState at Start:", authState);
    }, [authState]);

    // Show loading while checking auth
    if (!authState || authState.isPending) {
        return (
            <Grid container style={{ marginTop: "40vh" }}>
                <Grid size={12} sx={{ textAlign: "center", color: "white", fontSize: "18px" }}>
                    Loading...
                </Grid>
            </Grid>
        );
    }

    // Show login button if not authenticated (No redirect)
    if (!authState.isAuthenticated) {
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

    // Show the full UI once authenticated
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
