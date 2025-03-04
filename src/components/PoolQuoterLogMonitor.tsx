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
                <PoolQuoterLog filename={"alert-runner"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterLog filename={"dlmm-server"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterLog filename={"pool-monitor-DRIFT"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterLog filename={"pool-monitor-TNSR"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterLog filename={"pool-monitor-IO"} />
            </Grid>
            <Grid size={6}>
                <PoolQuoterLog filename={"pool-monitor-SONIC"} />
            </Grid>
        </Grid>
    );
};

export default PoolQuoterLogMonitor;
