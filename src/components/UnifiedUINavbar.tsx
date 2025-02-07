import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import {styled} from "@mui/material";
import Button, {ButtonProps} from "@mui/material/Button";

const pages = ['PoolQuoter'];

const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText('#000124'),
    backgroundColor: '#21252e',
    borderRadius: '18px',
    padding: '6px 24px',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 0 7px rgba(0, 0, 0, 0.0)',
    transition: 'border 0.3s',
    border: '.5px solid #3b3b3b',
    fontSize: '11px',

    '&:hover': {
        border: '1px solid #af3df5',
        boxShadow: '0 0 2px #af3df5',
    },
}));

interface ButtonAppBarProps {
    onPageChange: (page: string) => void; // This specifies the function signature
}

export default function ButtonAppBar({onPageChange}: ButtonAppBarProps) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ backgroundColor: "#0b0f19" }}>
                <Toolbar>
                    <img src="/logo-lhava-white.svg" alt="Lhava Icon" width={"96px"}/>

                    <Box sx={{ flexGrow: 1, display: { md: 'flex' }, padding: '0 14px' }}>
                        {pages.map((page) => (
                            <ColorButton
                                key={page}
                                onClick={() => onPageChange(page)}
                                sx={{ my: 2, color: 'white', display: 'block', marginLeft: '8px' }}
                            >
                                {page}
                            </ColorButton>
                        ))}
                    </Box>
                    <ColorButton onClick={() => onPageChange("login")} color="inherit">
                        Login
                    </ColorButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
