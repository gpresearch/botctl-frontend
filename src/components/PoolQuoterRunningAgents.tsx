import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
    Container
} from "@mui/material";
import Button from "@mui/material/Button";

interface ProcessConfig {
    [key: string]: string | number | boolean;
}

interface StrategyStats {
    strategy_id: string;
    pct_allocation: number;
    pct_deviation: number;
    total_notional_usd: number;
}

interface Process {
    pid: number;
    name: string;
    config: ProcessConfig;
    status: string;
    start_time: number;
    last_updated: number;
    strategy_id?: string;
    strategy_stats?: StrategyStats;
}


const ProcessManagerTable: React.FC = () => {
    const [processes, setProcesses] = useState<Process[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8032';

    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/processes`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }
                const data: Process[] = await response.json();
                setProcesses(data);
                setLoading(false);
            } catch {
                setError("Failed to fetch processes. Please try again.");
                setLoading(false);
            }
        };

        fetchProcesses();
    }, []);


    const handleKillProcess = async (pid: number) => {
        if (!window.confirm(`Are you sure you want to kill process ${pid}? This may disrupt ongoing tasks.`)) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/processes/${pid}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error(`Failed to kill process ${pid}: ${response.statusText}`);
            }
            setProcesses((prev) => prev.filter((process) => process.pid !== pid));
        } catch (err) {
            setError(`Failed to kill process ${pid}. Please try again. ${err}`);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <TableContainer component={Paper} sx={{ backgroundColor: "#141626", borderRadius: '1rem', border: '1px solid #282940' }}>
            <Container sx={{ margin: "24px 0", color: "white", textAlign: "left", paddingLeft: '24px', fontWeight: '600', fontSize: '18px', fontFamily: 'Manrope' }}>
                Running Agents
            </Container>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940'}}>PID</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Name</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Strategy</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Notional</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Pct Allocation</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Pct Deviation</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Status</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Start Time</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {processes.map((process) => (
                        <TableRow key={process.pid}>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>{process.pid}</TableCell>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>{process.name}</TableCell>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>
                                {process.strategy_id ? process.strategy_id : "N/A"}
                            </TableCell>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>
                                {process.strategy_stats?.pct_allocation !== undefined
                                    ? `$${(process.strategy_stats.total_notional_usd).toFixed(0)}`
                                    : "N/A"}
                            </TableCell>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>
                                {process.strategy_stats?.pct_allocation !== undefined
                                    ? `${(process.strategy_stats.pct_allocation).toFixed(0)}%`
                                    : "N/A"}
                            </TableCell>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>
                                {process.strategy_stats?.pct_deviation !== undefined
                                    ? `${(process.strategy_stats.pct_deviation).toFixed(2)}%`
                                    : "N/A"}
                            </TableCell>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>{process.status}</TableCell>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>
                                {new Date(process.start_time * 1000).toLocaleString()}
                            </TableCell>
                            <TableCell sx={{ color: "white", borderBottom: '1px solid #282940' }}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleKillProcess(process.pid)}
                                >
                                    Kill
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    );
};

export default ProcessManagerTable;
