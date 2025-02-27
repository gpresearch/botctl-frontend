import { useState, useEffect } from "react";

import { Box, Container } from "@mui/material";
import ButtonAppBar from "./components/UnifiedUINavbar.tsx";
import UnifiedUIDashboard from "./components/UnifiedUIDashboard.tsx";
import Grid from "@mui/material/Grid2";

const UnifiedUI = () => {
    const [currentPage, setCurrentPage] = useState("home"); // Default page is "home"
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginCode, setLoginCode] = useState<string>('');

    useEffect(() => {
        if (Number(loginCode) == 69800869 || Number(loginCode) == 8081) {
            setIsLoggedIn(true);
        }
    }, [loginCode]);

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
                {
                    isLoggedIn ? (
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
                    ) : (
                        <Grid container style={{marginTop: '40vh'}}>
                            <Grid size={12} sx={{
                                textAlign: 'center',
                                color: 'black',
                                fontSize: '18px',
                            }}>
                                ENTER CODE
                            </Grid>
                            <Grid size={12} sx={{textAlign: 'center', color: 'black', paddingTop: '12px'}}>
                                <input
                                    type="password"
                                    value={loginCode}
                                    onChange={(e) => setLoginCode(e.target.value)}
                                    placeholder={"[ENTER SUPER SECURE PASSWORD]"}
                                    style={{
                                        height: "66px",
                                        width: "237px",
                                        backgroundColor: '#E4E4E4',
                                        border: '1px solid grey',
                                        textAlign: 'center',
                                        fontSize: '12px'
                                    }}
                                />
                            </Grid>
                        </Grid>
                    )
                }
            </Box>
        </div>
    );
};

export default UnifiedUI;
