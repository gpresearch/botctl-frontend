import { Box, Typography, Container } from "@mui/material";

const UnifiedUIQA = () => {
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
                    QA Dashboard
                </Typography>
                <Typography variant="body1">
                    Quality Assurance functionality will go here
                </Typography>
            </Box>
        </Container>
    );
}

export default UnifiedUIQA; 