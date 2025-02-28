import { ChangeEvent, useState } from 'react';
import { Container, ContainerProps, styled, TextField, Alert, AlertTitle, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import LhavaButton from "./LhavaButton.tsx";

const LhavaForm = styled(Container)<ContainerProps>(({ theme }) => ({
    color: theme.palette.getContrastText('#000124'),
    backgroundColor: "#141626",
    borderRadius: '1rem',
    padding: '24px',
    fontWeight: '800',
    width: '100%',
    cursor: 'pointer',
    boxShadow: '0 0 7px rgba(0, 0, 0, 0.0)',
    transition: 'border 0.3s',
    border: '1px solid #282940',
    fontSize: '11px',
    '&:hover': {
        border: '1px solid #af3df5',
        boxShadow: '0 0 2px #af3df5',
    },
}));

const POOL_MAPPING: Record<string, { pool_address: string; base: string; counter: string }> = {
    "TNSR/USDC": { pool_address: "EZwNTDiGdT1W56wXWvU5NH2PUSJ21bPmQrRuzTmPyibu", base: "TNSR", counter: "USDC" },
    "DRIFT/USDC": { pool_address: "ESkg5Jjd9b5iCg7GfHT3LrcYtxQ7saCctznpncG4wxuL", base: "DRIFT", counter: "USDC" },
    "USDC/IO": { pool_address: "67q6kZD6PD29pCvPhMkYSdT6MXJqmkCjeaVNfSYLZ2F2", base: "USDC", counter: "IO" },
    "SONIC/USDC": { pool_address: "5LhUQbRDTzgL6RJd3ecgu62wsve71LnWY59seXxBrMqw", base: "SONIC", counter: "USDC" },
};

const PoolQuoterCreateAgent = () => {
    const [pool, setPool] = useState('');
    const [strategy, setStrategy] = useState('');
    const [notionalUSD, setNotional] = useState('');
    const [pctSpot, setPctSpot] = useState('');
    const [priceDeviation, setPriceDeviation] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handlePoolChange = (event: SelectChangeEvent) => {
        setPool(event.target.value);
    };

    const handleStrategyChange = (event: SelectChangeEvent) => {
        setStrategy(event.target.value);
    };

    const handleNotionalInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNotional(event.target.value);
    };

    const handlePctSpotInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPctSpot(event.target.value);
    };

    const handlePriceDeviationInput = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPriceDeviation(event.target.value);
    };

    const validateInput = (): boolean => {
        if (!pool) {
            setErrorMsg("Pool is required.");
            return false;
        }
        if (!strategy) {
            setErrorMsg("Strategy is required.");
            return false;
        }
        if (!notionalUSD || isNaN(Number(notionalUSD)) || Number(notionalUSD) <= 0) {
            setErrorMsg("Notional USD must be a positive number.");
            return false;
        }
        if (!pctSpot || isNaN(Number(pctSpot)) || Number(pctSpot) <= 0 || Number(pctSpot) > 100) {
            setErrorMsg("Allocation must be a number between 1 and 100.");
            return false;
        }
        if (!priceDeviation || isNaN(Number(priceDeviation)) || Number(priceDeviation) <= 0) {
            setErrorMsg("Price Deviation must be a positive number.");
            return false;
        }
        setErrorMsg('');
        return true;
    };

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8032';

    const createAgent = async () => {
        if (!validateInput()) return;

        // Derive base, counter, and pool_address from the selected pool
        const { base, counter, pool_address } = POOL_MAPPING[pool] || {};

        try {
            const body = JSON.stringify({
                base: base,
                counter: counter,
                pool: pool,
                pool_address: pool_address,
                strategy: strategy,
                notional_usd: Number(notionalUSD),
                pct_spot: Number(pctSpot),
                price_deviation_pct: Number(priceDeviation),
            })

            const response = await fetch(`${API_BASE_URL}/api/create-agent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMsg(`Error: ${errorData.detail}`);
                return;
            }

            const data = await response.json();
            setSuccessMsg(`Agent successfully created: ${data.message}`);
        } catch (error) {
            setErrorMsg(`An unexpected error occurred: ${error}`);
        }
    };

    return (
        <Container sx={{ padding: "1rem" }}>
            <LhavaForm>
                <Grid container spacing={1} sx={{ flexGrow: 1 }}>
                    <Grid size={12}>
                        <div style={{
                            color: 'white',
                            fontSize: 18,
                            fontWeight: 'bold',
                            paddingBottom: '12px',
                            paddingTop: '12px',
                        }}>
                            Create Agent
                        </div>
                        <hr style={{
                            borderTop: '1px solid #21252e',
                        }} />
                    </Grid>

                    <Grid size={6}>
                        <div style={{ color: 'white', fontWeight: 'bold', paddingBottom: '12px' }}>Pool</div>
                        <Select
                            value={pool}
                            onChange={handlePoolChange}
                            sx={{ width: '80%', color: 'white', fontWeight: 'bold', backgroundColor: '#1e212b' }}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            {Object.keys(POOL_MAPPING).map((poolName) => (
                                <MenuItem key={poolName} value={poolName}>{poolName}</MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    <Grid size={6}>
                        <div style={{ color: 'white', fontWeight: 'bold', paddingBottom: '12px' }}>Strategy</div>
                        <Select
                            value={strategy}
                            onChange={handleStrategyChange}
                            sx={{ width: '80%', color: 'white', fontWeight: 'bold', backgroundColor: '#1e212b' }}
                        >
                            <MenuItem value=""><em>None</em></MenuItem>
                            <MenuItem value="osmosis">Bid/Ask</MenuItem>
                        </Select>
                    </Grid>

                    <Grid size={4}>
                        <div style={{ color: 'white', fontWeight: 'bold', paddingBottom: '12px' }}>Total Notional USD</div>
                        <TextField
                            type="number"
                            value={notionalUSD}
                            onChange={handleNotionalInput}
                            sx={{ width: '80%', backgroundColor: '#1e212b', input: { color: 'white', fontWeight: 'bold' } }}
                        />
                    </Grid>

                    <Grid size={4}>
                        <div style={{ color: 'white', fontWeight: 'bold', paddingBottom: '12px' }}>% Allocation to Spot</div>
                        <TextField
                            type="number"
                            value={pctSpot}
                            onChange={handlePctSpotInput}
                            sx={{ width: '80%', backgroundColor: '#1e212b', input: { color: 'white', fontWeight: 'bold' } }}
                        />
                    </Grid>

                    <Grid size={4}>
                        <div style={{ color: 'white', fontWeight: 'bold', paddingBottom: '12px' }}>% Deviation</div>
                        <TextField
                            type="number"
                            value={priceDeviation}
                            onChange={handlePriceDeviationInput}
                            sx={{ width: '80%', backgroundColor: '#1e212b', input: { color: 'white', fontWeight: 'bold' } }}
                        />
                    </Grid>

                    <Grid size={12}>
                        {errorMsg && (
                            <Alert severity="error" sx={{ marginTop: '1rem' }}>
                                <AlertTitle>Error</AlertTitle>
                                {errorMsg}
                            </Alert>
                        )}
                        {successMsg && (
                            <Alert severity="success" sx={{ marginTop: '1rem' }}>
                                <AlertTitle>Success</AlertTitle>
                                {successMsg}
                            </Alert>
                        )}
                    </Grid>

                    <Grid size={4} sx={{ padding: '1rem' }}>
                        <LhavaButton onClick={createAgent}>Create Agent</LhavaButton>
                    </Grid>
                </Grid>
            </LhavaForm>
        </Container>
    );
};

export default PoolQuoterCreateAgent;
