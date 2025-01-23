import { useEffect, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {Container} from "@mui/material";

const PoolQuoterLogViewer = ({ tokenPair }: { tokenPair: string }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8032';
    const logsEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const eventSource = new EventSource(`${API_BASE_URL}/api/logs/${tokenPair}`);

        eventSource.onmessage = (event) => {
            setLogs((prevLogs) => {
                const newLogs = [...prevLogs, event.data];
                // Keep only the last 100 log lines
                return newLogs.slice(-100);
            });
        };

        eventSource.onerror = (err) => {
            console.error('Error with log streaming:', err);
            setError('Failed to stream logs.');
            eventSource.close();
        };

        return () => {
            eventSource.close(); // Clean up on component unmount
        };
    }, [tokenPair]);

    useEffect(() => {
        // Scroll to the bottom whenever logs update
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const toggleVisibility = () => {
        setIsVisible((prev) => !prev);
    };

    return (
        <div style={{ padding: '1rem', backgroundColor: '#141626', color: 'white', borderRadius: '10px', position: 'relative' }}>
            <div style={{ display: 'flex' }}>
                <Container sx={{ color: "white", textAlign: "left", fontWeight: '600', fontSize: '18px', fontFamily: 'Manrope' }}>
                    Log Stream for {tokenPair.toString()}
                </Container>
                <IconButton onClick={toggleVisibility} sx={{ color: 'white' }}>
                    {isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
            </div>
            {isVisible && (
                <>
                    {error ? (
                        <p style={{ color: 'red' }}>{error}</p>
                    ) : (
                        <div
                            style={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                whiteSpace: 'pre-wrap',
                                backgroundColor: '#000000',
                                padding: '1rem',
                                borderRadius: '5px',
                                marginTop: '1rem',
                            }}
                        >
                            {logs.map((log, index) => (
                                <div key={index} style={{ color: '#00ff00', fontSize: '12px' }}>
                                    {log}
                                </div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PoolQuoterLogViewer;
