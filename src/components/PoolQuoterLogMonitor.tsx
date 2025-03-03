import Grid from "@mui/material/Grid2";
import PoolQuoterLog from "./PoolQuoterLog.tsx";

const PoolQuoterLogMonitor = () => {
    return (
        <Grid container>
            <Grid size={6}>
                <PoolQuoterLog filename={"amm-rs"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterLog filename={"api-server"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterLog filename={"dlmm-server"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterLog filename={"pool-monitor-DRIFT-USDC"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterLog filename={"pool-monitor-TNSR-USDC"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterLog filename={"pool-monitor-IO-USDC"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterLog filename={"pool-monitor-SONIC-USDC"} />
            </Grid>
        </Grid>
    );
};

export default PoolQuoterLogMonitor;
