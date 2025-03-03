import { useEffect, useRef, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Container } from "@mui/material";

const PoolQuoterLog = ({ filename }: { filename: string }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8032';
    const logsEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const eventSource = new EventSource(`${API_BASE_URL}/api/logs/file/${filename}`);

        eventSource.onmessage = (event) => {
            setLogs((prevLogs) => {
                const newLogs = [...prevLogs, event.data];
                // Keep only the last 1000 log lines
                return newLogs.slice(-1000);
            });
        };

        eventSource.onerror = (err) => {
            console.error('Error with log streaming:', err);
            setError('Failed to stream logs.');
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [filename]);

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs]);

    const toggleVisibility = () => {
        setIsVisible((prev) => !prev);
    };

    const downloadLog = () => {
        const downloadUrl = `${API_BASE_URL}/api/logs/download/${filename}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `${filename}.log`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ padding: '1rem', backgroundColor: '#141626', color: 'white', borderRadius: '10px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Container sx={{ color: "white", textAlign: "left", fontWeight: '600', fontSize: '18px', fontFamily: 'Manrope' }}>
                    Log Stream for {filename}
                </Container>
                <div>
                    <IconButton onClick={toggleVisibility} sx={{ color: 'white' }}>
                        {isVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                    <IconButton onClick={downloadLog} sx={{ color: 'white' }}>
                        <FileDownloadIcon />
                    </IconButton>
                </div>
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

export default PoolQuoterLog;
