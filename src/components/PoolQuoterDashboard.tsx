import {Container} from "@mui/material";
import PoolQuoterBinData from "./PoolQuoterBinData.tsx";
import Grid from '@mui/material/Grid2';
import LhavaButton from "./LhavaButton.tsx";
import {useState} from "react";


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
                        <PoolQuoterBinData tokenPair={tokenPair} />
                    </Grid>
                    <Grid size={6}>
                        <PoolQuoterBinData tokenPair={tokenPair} />
                    </Grid>
                    <Grid size={6}>
                        <PoolQuoterBinData tokenPair={tokenPair} />
                    </Grid>
                </Grid>;
            case "create_pool":
                return <div>create pool</div>;
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
                    <h2>Pool Quoter</h2>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid size={2} sx={{ flexGrow: 1, color: 'white', textAlign: 'center' }}>
                    <Grid container spacing={2}>
                        <Container>
                            <div style={{textAlign: "center", fontSize: 11, fontWeight: 'bold'}}>
                                Actions
                            </div>
                        </Container>
                        <Container sx={{ borderRadius: '10px'}}>
                            <LhavaButton onClick={() => handlePageChange("all_pools")}>View All Pools</LhavaButton>
                        </Container>
                        <Container sx={{ borderRadius: '10px' }}>
                            <LhavaButton  onClick={() => handlePageChange("create_pool")}>Create Pool</LhavaButton>
                        </Container>
                        <Container>
                            <div style={{textAlign: "center", fontSize: 11, fontWeight: 'bold'}}>
                                Pools
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