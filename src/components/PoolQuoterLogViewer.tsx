import { useEffect, useState } from 'react';

const PoolQuoterLogViewer = ({ tokenPair }: { tokenPair: string }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8032';

    useEffect(() => {
        const eventSource = new EventSource(`${API_BASE_URL}/api/logs/${tokenPair}`);

        eventSource.onmessage = (event) => {
            setLogs((prevLogs) => {
                const newLogs = [...prevLogs, event.data];
                // Keep only the last 10 log lines
                return newLogs.slice(-10);
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

    return (
        <div style={{ padding: '1rem', backgroundColor: '#141626', color: 'white' }}>
            <h2>Log Stream for {tokenPair}</h2>
            {error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {logs.map((log, index) => (
                        <div key={index}>{log}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PoolQuoterLogViewer;
