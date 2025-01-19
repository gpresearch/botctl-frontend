import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";

interface ProcessConfig {
    // Define specific expected fields in the config object.
    [key: string]: string | number | boolean; // Adjust as per actual data structure
}

interface Process {
    pid: number;
    name: string;
    config: ProcessConfig; // Use the defined `ProcessConfig` interface
    status: string;
    start_time: number;
    last_updated: number;
}

const ProcessManagerTable: React.FC = () => {
    const [processes, setProcesses] = useState<Process[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8032/api/processes");
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`);
                }
                const data: Process[] = await response.json();
                setProcesses(data);
                setLoading(false);
            } catch {
                setError("Failed to fetch processes. Please try again."); // Removed unused variable
                setLoading(false);
            }
        };

        fetchProcesses();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    // Handle process termination
    const handleKillProcess = async (pid: number) => {
        try {
            const response = await fetch(`http://127.0.0.1:8032/api/processes/${pid}`, {
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

    return (
        <TableContainer component={Paper} sx={{ backgroundColor: "#141626", borderRadius: '1rem', border: '1px solid #282940' }}>
            <Typography variant="h6" align="center" sx={{ margin: "1rem 0", color: "white", textAlign: "left", paddingLeft: '24px', fontWeight: '800' }}>
                Running Agents
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940'}}>PID</TableCell>
                        <TableCell sx={{ color: "white", fontWeight: "bold", backgroundColor: '#141626', borderBottom: '1px solid #282940' }}>Name</TableCell>
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
