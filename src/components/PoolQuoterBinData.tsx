import { useState, useEffect } from "react";
import PoolQuoterBinDataChart from "./PoolQuoterBinDataChart.tsx";
import {Container, Alert, Snackbar, Box} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SyncIcon from '@mui/icons-material/Sync';
import CircularProgress from '@mui/material/CircularProgress';
import {MakeOptional} from "@mui/x-charts/models/helpers";
import {BarSeriesType} from "@mui/x-charts/models/seriesType/bar";

// Define the interface for the bin data response
interface Bin {
    bin_pos: string;
    qty: number;
    price: number;
}

interface BinData {
    active_bin: number;
    strategy_stats: StrategyStats;
    position_bin_ts: string;
    bins: Bin[];
    token_x_symbol: string;
    token_y_symbol: string;
    token_x_base: number;
    token_y_base: number;
    total_token_x_usd: number;
    total_token_y_usd: number;
}

interface StrategyStats {
    last_updated: number;
    pct_allocation: number;
    pct_deviation: number;
    strategy_id: string;
    total_notional_usd: number
}

// Props for the component
interface BinDataViewerProps {
    tokenPair: string;
}

const PoolQuoterBinData = ({ tokenPair }: BinDataViewerProps) => {
    const [binData, setBinData] = useState<BinData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [refreshedAt, setRefreshedAt] = useState('');
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8032';

    const fetchBinData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/bins?token_pair=${tokenPair}`);
            if (!response.ok) {
                throw new Error(`Error fetching bin data: ${response.statusText}`);
            }
            const data: BinData = await response.json();
            setBinData(data);
        } catch (err: unknown) {
            setBinData(null)
            setLoading(false);
            setError((err as Error).message);
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBinData();
    }, [tokenPair]);

    // Auto-refresh data every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchBinData();
            setRefreshedAt(new Date().toLocaleTimeString());
        }, 5000); // Update every 5000ms (5 seconds)

        // Cleanup the interval on component unmount
        return () => clearInterval(interval);
    }, [tokenPair]);

    const handleRefresh = () => {
        const time = new Date().toLocaleTimeString();
        setRefreshedAt(time.toString());
        fetchBinData();
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return <div>Loading chart...</div>;
    }

    if (!binData && !loading) {
        return (
            <Container sx={{ textAlign: "center", padding: "2rem", color: "white" }}>
                <div>No data available for {tokenPair}.</div>
            </Container>
        );
    }

    // Map the bin data to chart format
    const xAxisLabels = binData?.bins.map((bin) => `Bin: ${bin.bin_pos}`) || [];

    // ID of the active bin to highlight
    const activeBinId = binData?.active_bin;
    const activeBinIdNumber = activeBinId !== undefined ? Number(activeBinId) : -1; // Use -1 as default if undefined

    let activeBinIndex = 0;
    binData?.bins.forEach((bin, ix) => {
        if (Number(bin.bin_pos) == Number(activeBinIdNumber)) {
            activeBinIndex = ix
        }
    })

    // Find the midpoint index and its price
    const midpointIndex = Math.floor((binData?.bins?.length ?? 0) / 2);
    const midpointPrice = binData?.bins[midpointIndex]?.price ?? 0;
    const pctDeviation = binData?.strategy_stats?.pct_deviation || 0;

    // Calculate deviation thresholds
    const lowerThreshold = midpointPrice * (1 - pctDeviation);
    const upperThreshold = midpointPrice * (1 + pctDeviation);

    // Find bin positions closest to the thresholds
    let lowerBinPos: string | null = null;
    let upperBinPos: string | null = null;

    binData?.bins.forEach(bin => {
        if (!lowerBinPos && bin.price >= lowerThreshold) {
            lowerBinPos = bin.bin_pos;
        }
        if (!upperBinPos && bin.price >= upperThreshold) {
            upperBinPos = bin.bin_pos;
        }
    });

    const seriesData: MakeOptional<BarSeriesType, 'type'>[] = [
        // Series for bins to the left of the midpoint
        {
            type: 'bar',
            data: binData?.bins.map(bin => (Number(bin.bin_pos) < Number(binData?.bins[activeBinIndex].bin_pos) ? bin.qty : 0)) || [],
            color: '#0daed4',
        },
        // Series for bins to the right of the midpoint
        {
            type: 'bar',
            data: binData?.bins.map(bin => (Number(bin.bin_pos) >=  Number(binData?.bins[activeBinIndex].bin_pos) ? bin.qty : 0)) || [],
            color: '#af3df5', // Right series color
        },
        // Series for the active bin
        {
            type: 'bar',
            data: binData?.bins.map((bin) =>
                Number(bin.bin_pos) === activeBinIdNumber ? bin.qty : null
            ) || [],
            color: '#f54242',
        },
        // Series for the lower threshold
        {
            type: 'bar',
            data: binData?.bins.map(bin => (Number(bin.bin_pos) === Number(lowerBinPos)-1 ? binData?.bins[midpointIndex].qty/2 : 0)) || [],
            color: 'white',
        },
        // Series for the upper threshold
        {
            type: 'bar',
            data: binData?.bins.map(bin => (Number(bin.bin_pos) === Number(upperBinPos) ? binData?.bins[midpointIndex].qty/2 : 0)) || [],
            color: 'white',
        },
    ];

    function formatNumber(number: number) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(number);
    }

    return (
        <Container sx={{
            width: '100%',
            border: '1px solid #282940',
            borderRadius: '1rem',
            padding: '12px',
            background: "#141626"
        }}>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                {error ? (
                    <Alert severity="error" onClose={handleCloseSnackbar}>
                        {error}
                    </Alert>
                ) : (
                    <></>
                )}
            </Snackbar>


            <Grid container spacing={1} sx={{ flexGrow: 1 }}>
                <Grid size={12}>
                    <div style={{
                        flexGrow: 1,
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 'bold',
                        paddingBottom: '12px',
                        paddingTop: '12px',
                    }}>
                        {tokenPair}
                        {
                            refreshedAt && <Box sx={{fontSize: '8px', float: 'right', position: 'absolute'}}>Refreshed at: {refreshedAt}</Box>
                        }
                        {
                            !loading ? (
                                <SyncIcon sx={{float: 'right'}} onClick={handleRefresh} />
                            ) : (
                                <CircularProgress sx={{float: 'right'}} size="24px"/>
                            )
                        }
                    </div>
                    <hr style={{
                        borderTop: '1px solid #21252e',
                        borderBottom: '1px solid #21252e',
                        borderLeft: '1px solid #21252e',
                        borderRight: '1px solid #21252e'
                    }} />
                </Grid>

                <Grid size={6}>
                    <Grid container spacing={0} sx={{ flexGrow: 1 }}>
                        <Grid size={12}>
                            <div style={{
                                color: 'grey',
                                fontSize: 10,
                                textAlign: 'left',
                                fontWeight: 'bold',
                                paddingBottom: '12px'
                            }}>
                                Current Balance
                            </div>
                        </Grid>
                        <Grid size={12}>
                            <div style={{
                                flexGrow: 1,
                                color: 'white',
                                textAlign: 'left',
                                fontSize: 12,
                                fontWeight: 'bold',
                            }}>
                                {binData?.token_x_symbol} - {binData?.token_x_base} - {formatNumber(binData?.total_token_x_usd || 0)}
                            </div>
                        </Grid>
                        <Grid size={12}>
                            <div style={{
                                flexGrow: 1,
                                color: 'white',
                                textAlign: 'left',
                                fontSize: 12,
                                fontWeight: 'bold',
                            }}>
                                {binData?.token_y_symbol} - {binData?.token_y_base} - {formatNumber(binData?.total_token_y_usd || 0)}
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid size={6}>
                    <Grid container spacing={0} sx={{ flexGrow: 1 }}>
                        <Grid size={12}>
                            <div style={{
                                color: 'grey',
                                fontSize: 10,
                                textAlign: 'left',
                                fontWeight: 'bold',
                                paddingBottom: '12px'
                            }}>
                                Total Notional
                            </div>
                        </Grid>
                        <Grid size={12}>
                            <div style={{
                                color: 'white',
                                fontSize: 18,
                                textAlign: 'left',
                                fontWeight: 'bold',
                                paddingBottom: '14px'
                            }}>
                                {formatNumber((binData?.total_token_x_usd || 0) + (binData?.total_token_y_usd || 0))}
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <hr style={{
                borderTop: '1px solid #21252e',
                borderBottom: '1px solid #21252e',
                borderLeft: '1px solid #21252e',
                borderRight: '1px solid #21252e'
            }} />

            <div style={{ paddingLeft: '-24px', marginTop: '12px', borderRadius: '2rem' }}>
                <PoolQuoterBinDataChart xAxisLabels={xAxisLabels} seriesData={seriesData} />
            </div>
        </Container>
    );
};

export default PoolQuoterBinData;
