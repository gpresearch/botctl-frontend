import {Container} from "@mui/material";
import PoolQuoterBinData from "./PoolQuoterBinData.tsx";
import Grid from '@mui/material/Grid2';


const UnifiedUIPoolQuoter = () => {
    const tokenPair = "TNSR/USDC"
    return (
        <Container>
            <Grid container spacing={0}>
                <Grid size={12} sx={{ flexGrow: 1, textAlign: "left", color: 'white' }}>
                    <h2>Multi Pool Monitor</h2>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={4}>
                    <PoolQuoterBinData tokenPair={tokenPair} />
                </Grid>
                <Grid size={4}>
                    <PoolQuoterBinData tokenPair={tokenPair} />
                </Grid>
                <Grid size={4}>
                    <PoolQuoterBinData tokenPair={tokenPair} />
                </Grid>
                <Grid size={4}>
                    <PoolQuoterBinData tokenPair={tokenPair} />
                </Grid>
                <Grid size={4}>
                    <PoolQuoterBinData tokenPair={tokenPair} />
                </Grid>
                <Grid size={4}>
                    <PoolQuoterBinData tokenPair={tokenPair} />
                </Grid>
            </Grid>
        </Container>
    )
}

export default UnifiedUIPoolQuoter;