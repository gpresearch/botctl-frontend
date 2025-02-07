import { useState } from "react";

import { Box, Container } from "@mui/material";
import ButtonAppBar from "./components/UnifiedUINavbar.tsx";
import UnifiedUIDashboard from "./components/UnifiedUIDashboard.tsx";

const UnifiedUI = () => {
    const [currentPage, setCurrentPage] = useState("home"); // Default page is "home"

    // Function to handle page change
    const handlePageChange = (page: string) => {
        setCurrentPage(page);
    };

    return (
        <div>
            {/* TODO: Update to use AppTheme / styling */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center", // Centers horizontally
                    minHeight: "100vh", // Full viewport height to center vertically
                    width: "100vw", // Full viewport height to center vertically
                    textAlign: "center", // Optional: Center text inside containers
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
                    <ButtonAppBar onPageChange={handlePageChange} />
                    <UnifiedUIDashboard currentPage={currentPage} />
                </Container>
            </Box>
        </div>
    );
};

export default UnifiedUI;
