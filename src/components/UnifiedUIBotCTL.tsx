import { Box, Typography, Container } from "@mui/material";

const UnifiedUIBotCTL = () => {
    return (
        <Container 
            maxWidth="lg" 
            sx={{ 
                backgroundColor: "#0b0f19", 
                color: "white", 
                padding: "2rem" 
            }}
        >
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    BotCTL Dashboard
                </Typography>
                <Typography variant="body1">
                    Bot Control Panel functionality will go here
                </Typography>
            </Box>
        </Container>
    );
}

export default UnifiedUIBotCTL; 