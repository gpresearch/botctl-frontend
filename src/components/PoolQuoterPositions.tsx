import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Button, Container
} from "@mui/material";

interface Position {
    symbol: string;
    position_pubkey: string;
    total_x_usd: number;
    total_y_usd: number;
}

const UserPositions: React.FC = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8032';

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/positions`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch positions: ${response.statusText}`);
                }
                const data: Position[] = await response.json();
                setPositions(data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch positions. Please try again.");
                setLoading(false);
            }
        };

        fetchPositions();
    }, []);

    const removeLiquidity = async (position_pubkey: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/remove-liquidity`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ position_pubkey }),
            });

            if (!response.ok) {
                throw new Error(`Failed to remove liquidity: ${response.statusText}`);
            }

            setPositions(prevPositions => prevPositions.filter(pos => pos.position_pubkey !== position_pubkey));

        } catch (err) {
            setError(`Failed to remove liquidity: ${err}`);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <TableContainer component={Paper} sx={{ backgroundColor: "#141626", borderRadius: '1rem', border: '1px solid #282940' }}>
            <Container sx={{ margin: "24px 0", color: "white", textAlign: "left", paddingLeft: '24px', fontWeight: '600', fontSize: '18px', fontFamily: 'Manrope' }}>
                User Positions
            </Container>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940'}}>Pool</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Position PubKey</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Total X (USD)</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Total Y (USD)</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {positions.map((position) => (
                        <TableRow key={position.position_pubkey}>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>{position.symbol}</TableCell>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>{position.position_pubkey}</TableCell>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>${position.total_x_usd.toFixed(2)}</TableCell>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>${position.total_y_usd.toFixed(2)}</TableCell>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => removeLiquidity(position.position_pubkey)}
                                >
                                    Remove Liquidity
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserPositions;
