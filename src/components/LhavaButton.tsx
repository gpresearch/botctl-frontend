import {styled} from "@mui/material";
import Button, {ButtonProps} from "@mui/material/Button";

const LhavaButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: theme.palette.getContrastText('#000124'),
    backgroundColor: '#b040f5',
    borderRadius: '8px',
    padding: '6px 10px',
    fontWeight: '800',
    width: '80%',
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

export default LhavaButton;