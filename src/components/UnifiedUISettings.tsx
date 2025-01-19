import {Box, Container} from "@mui/material";
import Grid from "@mui/material/Grid2";

const UnifiedUISettings = () => {
    return (
        <Container>
            <Grid container spacing={0}>
                <Grid size={12} sx={{ flexGrow: 1, textAlign: "left", color: 'white' }}>
                    <h2>Settings</h2>
                </Grid>
            </Grid>
            <Box sx={{ flexGrow: 1, textAlign: "center", color: 'white', marginTop: '35vh' }}>
                <img src="/logo-lhava-white.svg" alt="Lhava Icon" width={"20%"}/>
            </Box>
        </Container>
    )
}

export default UnifiedUISettings;