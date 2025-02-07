import { useEffect, useState } from "react";
import CircleIcon from '@mui/icons-material/Circle';

const StatusIcon = ({ service, pair }: { service: string; pair?: string }) => {
    const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8032';

    const checkServiceHealth = async () => {
        try {
            const url = pair
                ? `${API_BASE_URL}/api/health/${service}?pair=${pair}`
                : `${API_BASE_URL}/api/health/${service}`;
            const response = await fetch(url);
            if (response.ok) {
                const { status } = await response.json();
                setIsHealthy(status === 'healthy');
            } else {
                setIsHealthy(false);
            }
        } catch (err) {
            console.error(`Error fetching health status for ${service}${pair ? ` (${pair})` : ''}:`, err);
            setIsHealthy(false);
        }
    };

    useEffect(() => {
        checkServiceHealth();
        const interval = setInterval(checkServiceHealth, 30000); // Check health every 30 seconds
        return () => clearInterval(interval); // Clean up on component unmount
    }, [service, pair]);

    return (
        <CircleIcon
            sx={{
                color: isHealthy === null ? 'gray' : isHealthy ? 'green' : 'red',
                marginLeft: '12px',
                fontSize: '16px',
            }}
            titleAccess={`${service}${pair ? ` (${pair})` : ''} status: ${
                isHealthy === null ? 'loading...' : isHealthy ? 'healthy' : 'unhealthy'
            }`}
        />
    );
};

export default StatusIcon;
