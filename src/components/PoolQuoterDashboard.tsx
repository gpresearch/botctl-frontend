import {Container} from "@mui/material";
import PoolQuoterBinData from "./PoolQuoterBinData.tsx";
import Grid from '@mui/material/Grid2';
import LhavaButton from "./LhavaButton.tsx";
import {useState} from "react";
import PoolQuoterCreateAgent from "./PoolQuoterCreateAgent.tsx";
import PoolQuoterRunningAgents from "./PoolQuoterRunningAgents.tsx";
import PoolQuoterLogViewer from "./PoolQuoterLogViewer.tsx";


const PoolQuoterDashboard = () => {
    const [currentPage, setCurrentPage] = useState("all_pools"); // Default page is "home"

    // Function to handle page change
    const handlePageChange = (page: string) => {
        setCurrentPage(page);
    };

    const tokenPair = "TNSR/USDC"

    const renderDashboard = () => {
        switch (currentPage) {
            case "all_pools":
                return <Grid container spacing={2}>
                    <Grid size={6}>
                        <PoolQuoterBinData tokenPair={tokenPair} />
                    </Grid>
                    <Grid size={6}>
                        <PoolQuoterRunningAgents />
                    </Grid>
                    <Grid size={12}>
                        <PoolQuoterLogViewer tokenPair={"TNSR_USDC"} />
                    </Grid>
                </Grid>;
            case "create_agent":
                return <PoolQuoterCreateAgent/>;
            case "tnsr/usdc":
                return <PoolQuoterBinData tokenPair={tokenPair} />
            default:
                return <div>error</div>
        }
    }

    return (
        <Container>
            <Grid container spacing={0}>
                <Grid size={12} sx={{ flexGrow: 1, textAlign: "left", color: 'white' }}>
                    <h2 style={{fontFamily: 'Manrope'}}>Pool Quoter (MVP)</h2>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={2} sx={{ flexGrow: 1, color: 'white', textAlign: 'center' }}>
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
                            <LhavaButton onClick={() => handlePageChange("tnsr/usdc")}>TNSR/USDC</LhavaButton>
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