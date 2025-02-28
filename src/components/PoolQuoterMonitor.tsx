import Grid from "@mui/material/Grid2";
import PoolQuoterBinData from "./PoolQuoterBinData.tsx";

const PoolQuoterMonitor = () => {
    return (
        <Grid container>
            <Grid size={6}>
                <PoolQuoterBinData tokenPair={"TNSR/USDC"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterBinData tokenPair={"IO/USDC"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterBinData tokenPair={"DRIFT/USDC"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterBinData tokenPair={"SONIC/USDC"} />
            </Grid>
        </Grid>
    )
}

export default PoolQuoterMonitor