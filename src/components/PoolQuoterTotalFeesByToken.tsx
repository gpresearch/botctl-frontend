import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";

interface TotalFeesByTokenProps {
    feesByMint: Record<string, number>;
    convertAddressToSymbol: (address: string) => string;
}

const TotalFeesByToken: React.FC<TotalFeesByTokenProps> = ({ feesByMint, convertAddressToSymbol }) => {
    return (
        <Paper
            sx={{
                padding: "1rem",
                backgroundColor: "#1b1f2a",
                borderRadius: "10px",
                color: "white",
                fontWeight: "bold",
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                }}
            >
                Total Fees by Token
            </Typography>
            <Grid
                container
                spacing={2}
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                }}
            >
                {Object.entries(feesByMint).map(([mint, total]) => (
                    <Grid
                        item
                        key={mint}
                        sx={{
                            flex: "1 1 calc(50% - 10px)", // Ensures two columns with spacing
                            maxWidth: "calc(50% - 10px)",
                            marginBottom: "10px",
                        }}
                    >
                        <Box
                            sx={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#2a2f3e",
                                borderRadius: "8px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                            }}
                        >
                            <Typography variant="body2" sx={{ fontSize: "14px", color: "#cccccc" }}>
                                {convertAddressToSymbol(mint)}:
                            </Typography>
                            <Typography variant="body1" sx={{ fontSize: "16px", fontWeight: "bold" }}>
                                {total.toFixed(3)}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default TotalFeesByToken;
