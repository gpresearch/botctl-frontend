import {Container} from "@mui/material";
import PoolQuoterBinData from "./PoolQuoterBinData.tsx";
import Grid from '@mui/material/Grid2';
import LhavaButton from "./LhavaButton.tsx";
import {useState} from "react";
import PoolQuoterCreateAgent from "./PoolQuoterCreateAgent.tsx";
import PoolQuoterRunningAgents from "./PoolQuoterRunningAgents.tsx";
import PoolQuoterLogViewer from "./PoolQuoterLogViewer.tsx";
import Box from "@mui/material/Box";
import StatusIcon from "./PoolQuoterStatusIcon.tsx";
import ClaimedFeesViewer from "./PoolQuoterClaimedFeesViewer.tsx";
import PriceMonitor from "./PoolQuoterPriceMonitor.tsx";
import PoolQuoterPositions from "./PoolQuoterPositions.tsx";


const PoolQuoterDashboard = () => {
    const [currentPage, setCurrentPage] = useState("all_pools"); // Default page is "home"

    // Function to handle page change
    const handlePageChange = (page: string) => {
        setCurrentPage(page);
    };

    const renderDashboard = () => {
        switch (currentPage) {
            case "all_pools":
                return (
                    <Grid container spacing={2}>
                        <Grid size={12} sx={{  textAlign: "left", color: 'white' }}>
                            <PriceMonitor/>
                        </Grid>
                        <Grid size={6}>
                            <PoolQuoterBinData tokenPair={"TNSR/USDC"} />
                        </Grid>
                        <Grid size={6}>
                            <PoolQuoterBinData tokenPair={"USDC/IO"} />
                        </Grid>
                        <Grid size={6}>
                            <PoolQuoterBinData tokenPair={"DRIFT/USDC"} />
                        </Grid>
                        <Grid size={6}>
                            <PoolQuoterBinData tokenPair={"SONIC/USDC"} />
                        </Grid>
                        <Grid size={12}>
                            <PoolQuoterRunningAgents />
                        </Grid>
                        <Grid size={12}>
                            <PoolQuoterPositions />
                        </Grid>
                        <Grid size={12} sx={{  textAlign: "left", color: 'white' }}>
                            <ClaimedFeesViewer/>
                        </Grid>
                    </Grid>
                )
            case "create_agent":
                return <PoolQuoterCreateAgent/>;
            default:
                return (
                    <Grid container>
                        <Grid size={12}>
                            <PoolQuoterBinData tokenPair={currentPage} />
                        </Grid>
                        <br/>
                        <Grid size={12}>
                            <PoolQuoterLogViewer tokenPair={currentPage.replace("/", "_")} />
                        </Grid>
                    </Grid>
                )
        }
    }

    return (
        <Container>
            <Grid container spacing={0}>
                <Grid size={6} sx={{  textAlign: "left", color: 'white' }}>
                    <h2 style={{fontFamily: 'Manrope'}}>Pool Quoter</h2>
                </Grid>
                <Grid size={6}>
                    <Box sx={{ padding: '2rem', textAlign: 'right', marginRight: '16px' }}>
                        <StatusIcon service="pool-monitor" />
                        <StatusIcon service="redis" />
                        <StatusIcon service="dlmm" />
                    </Box>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={{xs: 1, md: 2}} sx={{ flexGrow: 1, color: 'white', textAlign: 'center' }}>
                    <Grid container spacing={2}>
                        <Container>
                            <div style={{textAlign: "center", fontSize: 12, textDecoration: 'underline', fontWeight: 'bold'}}>
                                Views
                            </div>
                        </Container>
                        <Container sx={{ borderRadius: '10px'}}>
                            <LhavaButton onClick={() => handlePageChange("all_pools")}>Dasbhoard</LhavaButton>
                        </Container>
                        <Container sx={{ borderRadius: '10px' }}>
                            <LhavaButton  onClick={() => handlePageChange("create_agent")}>Create Agent</LhavaButton>
                        </Container>
                        <Container>
                            <div style={{textAlign: "center", fontSize: 12, textDecoration: 'underline', fontWeight: 'bold'}}>
                                Agents
                            </div>
                        </Container>
                        <Container sx={{ borderRadius: '10px' }}>
                            <LhavaButton onClick={() => handlePageChange("TNSR/USDC")}>TNSR/USDC</LhavaButton>
                        </Container>
                        <Container sx={{ borderRadius: '10px' }}>
                            <LhavaButton onClick={() => handlePageChange("USDC/IO")}>IO/USDC</LhavaButton>
                        </Container>
                        <Container sx={{ borderRadius: '10px' }}>
                            <LhavaButton onClick={() => handlePageChange("DRIFT/USDC")}>DRIFT/USDC</LhavaButton>
                        </Container>
                        <Container sx={{ borderRadius: '10px' }}>
                            <LhavaButton onClick={() => handlePageChange("SONIC/USDC")}>SONIC/USDC</LhavaButton>
                        </Container>
                    </Grid>
                </Grid>
                <Grid size={9} sx={{ flexGrow: 1, textAlign: "left", color: 'white' }}>
                    {renderDashboard()}
                </Grid>
            </Grid>

        </Container>
    )
}

export default PoolQuoterDashboard;