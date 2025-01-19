import {Box, Container} from "@mui/material";
import Grid from "@mui/material/Grid2";

const UnifiedUILogin = () => {
    return (
        <Container>
            <Grid container spacing={0}>
                <Grid size={12} sx={{ flexGrow: 1, textAlign: "left", color: 'white' }}>
                    <h2>Login</h2>
                </Grid>
            </Grid>
            <Box sx={{ flexGrow: 1, textAlign: "center", color: 'white', marginTop: '35vh' }}>
                <img src="/logo-lhava-white.svg" alt="Lhava Icon" width={"20%"}/>
            </Box>
        </Container>
    )
}

export default UnifiedUILogin;