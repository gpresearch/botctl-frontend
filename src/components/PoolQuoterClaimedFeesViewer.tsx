import React, { useEffect, useState } from "react";
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Paper,
    Tooltip,
    Button,
    ButtonGroup,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

interface Fee {
    tx_hash: string;
    timestamp: number; // Unix timestamp
    fees: {
        mint: string;
        amount: string;
        decimals: number;
        uiAmount: number;
        uiAmountString: string;
    }[];
}

interface Metrics {
    totalFeesByMint: Record<string, number>;
    totalFees: number;
}

type TimeFilterKey = "1h" | "24h" | "7day" | "30day";

const timeFilters: Record<TimeFilterKey, number> = {
    "1h": 1 * 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7day": 7 * 24 * 60 * 60 * 1000,
    "30day": 30 * 24 * 60 * 60 * 1000,
};

const ClaimedFeesViewer: React.FC = () => {
    const [fees, setFees] = useState<Fee[]>([]);
    const [filteredFees, setFilteredFees] = useState<Fee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<Metrics>({ totalFeesByMint: {}, totalFees: 0 });
    const [selectedFilter, setSelectedFilter] = useState<TimeFilterKey>("1h");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8032";

    const convertAddressToSymbol = (address: string) => {
        switch (address) {
            case "TNSRxcUxoT9xBG3de7PiJyTDYu7kskLqcpddxnEJAS6":
                return "TNSR";
            case "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v":
                return "USDC";
            case "BZLbGTNCSFfoth2GYDtwr7e4imWzpR5jqcUuGEwr646K":
                return "IO"
            case "DriFtupJYLTosbwoN8koMbEYSx54aFAVLddWsbksjwg7":
                return "DRIFT"
            case "SonicxvLud67EceaEzCLRnMTBqzYUUYNr93DBkBdDES":
                return "SONIC"
            default:
                return address;
        }
    };

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
        return Intl.DateTimeFormat("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date);
    };

    const calculateMetrics = (data: Fee[]) => {
        const totalFeesByMint: Record<string, number> = {};
        let totalFees = 0;

        data.forEach((fee) => {
            fee.fees.forEach((token) => {
                if (!totalFeesByMint[token.mint]) {
                    totalFeesByMint[token.mint] = 0;
                }
                totalFeesByMint[token.mint] += token.uiAmount;
                totalFees += token.uiAmount;
            });
        });

        return { totalFeesByMint, totalFees };
    };

    const applyFilter = (filter: TimeFilterKey) => {
        const now = Date.now();
        const filtered = fees.filter(
            (fee) => now - fee.timestamp * 1000 <= timeFilters[filter]
        );
        setFilteredFees(filtered);
        setMetrics(calculateMetrics(filtered));
        setSelectedFilter(filter);
    };

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/fees`);
                if (!response.ok) {
                    throw new Error(`Error fetching fees: ${response.statusText}`);
                }
                const data = await response.json();

                // Sort the data by timestamp (most recent first)
                const sortedData = data.sort((a: Fee, b: Fee) => b.timestamp - a.timestamp);

                setFees(sortedData);

                // Apply default filter (1h)
                applyFilter("1h");
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, []);

    const openInSolscan = (txHash: string) => {
        const url = `https://solscan.io/tx/${txHash}`;
        window.open(url, "_blank");
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container
            sx={{
                backgroundColor: "#141626",
                padding: "1rem",
                borderRadius: "10px",
                marginTop: "1rem",
                overflow: "hidden",
            }}
        >
            {/* Filter Buttons */}
            <ButtonGroup
                variant="contained"
                color="primary"
                sx={{ marginBottom: "1rem", backgroundColor: "#1b1f2a" }}
            >
                {Object.keys(timeFilters).map((filter) => (
                    <Button
                        key={filter}
                        onClick={() => applyFilter(filter as TimeFilterKey)}
                        sx={{
                            backgroundColor: selectedFilter === filter ? "#3b3b3b" : "#1b1f2a",
                            "&:hover": { backgroundColor: "#3b3b3b" },
                        }}
                    >
                        {filter.toUpperCase()}
                    </Button>
                ))}
            </ButtonGroup>

            {/* Metrics Pane */}
            <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
                <Grid size={6}>
                    <Paper
                        sx={{
                            padding: "1rem",
                            backgroundColor: "#1b1f2a",
                            borderRadius: "10px",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        <div>Total Round Trips</div>
                        <div style={{fontSize: '24px'}}>{filteredFees.length}</div>
                    </Paper>
                </Grid>
                <Grid size={6}>
                    <Paper
                        sx={{
                            padding: "1rem",
                            backgroundColor: "#1b1f2a",
                            borderRadius: "10px",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        <div>Total Fees by Token</div>
                        <Grid container spacing={2}>
                            {Object.entries(metrics.totalFeesByMint).map(([mint, total]) => (
                                <Grid size={12} key={mint}>
                                    <div style={{fontSize: '24px'}}>
                                        <span style={{fontSize: '14px'}}>{convertAddressToSymbol(mint)}:</span> {total.toFixed(3)}
                                    </div>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            {/* Table */}
            <Typography
                variant="h6"
                gutterBottom
                sx={{
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    textAlign: "left",
                }}
            >
                Claimed Fees
            </Typography>
            <TableContainer
                component={Paper}
                sx={{
                    maxHeight: "600px",
                    backgroundColor: "#1b1f2a",
                    border: "1px solid #21252e",
                    borderRadius: "10px",
                    overflowY: "auto",
                    "::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                }}
            >
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    color: "white",
                                    backgroundColor: "#21252e",
                                    fontWeight: "bold",
                                }}
                            >
                                Transaction Hash
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: "white",
                                    backgroundColor: "#21252e",
                                    fontWeight: "bold",
                                }}
                            >
                                Timestamp
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: "white",
                                    backgroundColor: "#21252e",
                                    fontWeight: "bold",
                                }}
                            >
                                Mint
                            </TableCell>
                            <TableCell
                                sx={{
                                    color: "white",
                                    backgroundColor: "#21252e",
                                    fontWeight: "bold",
                                }}
                            >
                                Amount
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredFees.map((fee) => (
                            <React.Fragment key={fee.tx_hash}>
                                {fee.fees.map((token, index) => (
                                    <TableRow
                                        key={`${fee.tx_hash}-${index}`}
                                        sx={{
                                            "&:nth-of-type(odd)": {
                                                backgroundColor: "#1f2532",
                                            },
                                            "&:nth-of-type(even)": {
                                                backgroundColor: "#141926",
                                            },
                                            "&:hover": {
                                                backgroundColor: "#2d3343",
                                            },
                                        }}
                                    >
                                        {index === 0 && (
                                            <>
                                                <TableCell
                                                    rowSpan={fee.fees.length}
                                                    sx={{ color: "white", fontWeight: "bold", fontSize: "12px" }}
                                                >
                                                    <Tooltip title="Open in Solscan" arrow>
                                                        <span
                                                            style={{
                                                                cursor: "pointer",
                                                                textDecoration: "underline",
                                                                color: "#00afff",
                                                            }}
                                                            onClick={() => openInSolscan(fee.tx_hash)}
                                                        >
                                                            {fee.tx_hash.slice(0, 10)}...{fee.tx_hash.slice(-10)}
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell
                                                    rowSpan={fee.fees.length}
                                                    sx={{ color: "white", fontSize: "12px" }}
                                                >
                                                    {formatTimestamp(fee.timestamp)}
                                                </TableCell>
                                            </>
                                        )}
                                        <TableCell sx={{ color: "white", fontSize: "12px" }}>
                                            {convertAddressToSymbol(token.mint)}
                                        </TableCell>
                                        <TableCell sx={{ color: "white", fontSize: "12px" }}>
                                            {token.uiAmountString}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default ClaimedFeesViewer;
