import {useState, useEffect} from "react";
import PoolQuoterBinDataChart from "./PoolQuoterBinDataChart.tsx";
import {Container} from "@mui/material";
import Grid from "@mui/material/Grid2";

// Define the interface for the bin data response
interface Bin {
    bin_pos: string;
    qty: number;
}

interface BinData {
    position_bin_ts: string;
    bins: Bin[];
    token_x_symbol: string;
    token_y_symbol: string;
    token_x_base: number;
    token_y_base: number;
    total_token_x_usd: number;
    total_token_y_usd: number;
}

// Props for the component
interface BinDataViewerProps {
    tokenPair: string;
}

const PoolQuoterBinData = ({ tokenPair }: BinDataViewerProps) => {
    const [binData, setBinData] = useState<BinData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBinData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8032/api/bins?token_pair=${tokenPair}`);
                if (!response.ok) {
                    throw new Error(`Error fetching bin data: ${response.statusText}`);
                }
                const data: BinData = await response.json();
                setBinData(data);
            } catch (err: unknown) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchBinData();
    }, []);

    if (loading) {
        return <div>Loading chart...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!binData) {
        return <div>No data available.</div>;
    }

    // Map the bin data to chart format
    const xAxisLabels = binData.bins.map((bin) => `Bin: ${bin.bin_pos}`);
    const seriesData = [
        { data: binData.bins.map((bin) => bin.qty), color: '#af3df5' },
    ];

    function formatNumber(number: number) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(number)
    }

    return (
        <Container sx={{
            width: '100%',
            border: '1px solid #282940',
            borderRadius: '1rem',
            padding: '12px',
            background: "#141626"
        }}>
            <Grid container spacing={1} sx={{flexGrow: 1}}>
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
                    </div>
                    <hr style={{
                        borderTop: '1px solid #21252e',
                        borderBottom: '1px solid #21252e',
                        borderLeft: '1px solid #21252e',
                        borderRight: '1px solid #21252e'
                    }}/>

                </Grid>
                <Grid size={6}>
                    <Grid container spacing={0} sx={{flexGrow: 1}}>
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
                                {binData.token_x_symbol} - {binData.token_x_base} - {formatNumber(binData.total_token_x_usd)}
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
                                {binData.token_y_symbol} - {binData.token_y_base} - {formatNumber(binData.total_token_y_usd)}
                            </div>
                        </Grid>
                    </Grid>

                </Grid>
                <Grid size={6}>
                    <Grid container spacing={0} sx={{flexGrow: 1}}>
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
                                {formatNumber(binData.total_token_x_usd + binData.total_token_y_usd)}
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
            }}/>

            <div style={{paddingLeft: '-24px', marginTop: '12px', borderRadius: '2rem'}}>
                <PoolQuoterBinDataChart xAxisLabels={xAxisLabels} seriesData={seriesData}/>
            </div>
        </Container>
    );
};

export default PoolQuoterBinData;
