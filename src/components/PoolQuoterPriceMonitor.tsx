import React from "react";
import { Container, Box } from "@mui/material";
import StatusIcon from "./PoolQuoterStatusIcon.tsx";


const priceFeeds: { name: string; service: string; pair: string }[] = [
    { name: "TNSR/USDC", service: "amm-rs", pair: "TNSRUSDC" },
    { name: "DRIFT/USDC", service: "amm-rs", pair: "DRIFTUSDC" },
    { name: "IO/USDC", service: "amm-rs", pair: "IOUSDC" },
    { name: "SONIC/USDC", service: "amm-rs", pair: "SONICUSDC" },
];

const PriceMonitor: React.FC = () => {
    return (
        <Container
            sx={{
                backgroundColor: "#141626",
                padding: ".5rem",
                borderRadius: "10px",
                marginTop: "1rem",
                overflow: "hidden",
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                {priceFeeds.map((feed) => (
                    <Box
                        key={`${feed.service}-${feed.pair}`}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#1e2034",
                            padding: "0.5rem 1rem",
                            borderRadius: "8px",
                            margin: "0.5rem",
                        }}
                    >
                        <div
                            style={{ color: "white", marginRight: "0.5rem", fontSize: '14px', fontWeight: 600 }}
                        >
                            {feed.name}
                        </div>
                        <StatusIcon service={feed.service} pair={feed.pair} />
                    </Box>
                ))}
            </Box>
        </Container>
    );
};

export default PriceMonitor;
