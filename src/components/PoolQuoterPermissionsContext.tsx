import { createContext, useContext, useState, useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";

const PermissionsContext = createContext<any>(null);

export const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
    const { authState } = useOktaAuth();
    const [permissions, setPermissions] = useState<string | null>(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8032';

    const fetchUserGroups = async (accessToken: string | null, data: any) => {
        try {
            const response = await fetch("https://lhava.okta.com/oauth2/v1/userinfo", {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const userInfo = await response.json();
            setPermissions(data[userInfo.email] || "READ_ONLY"); // Default to READ_ONLY
        } catch (error) {
            console.error("Error fetching user groups:", error);
        }
    };

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/permissions`);

                const data = await response.json();

                if (authState && authState.accessToken) {
                    fetchUserGroups(authState?.accessToken.accessToken, data);
                }
            } catch (error) {
                console.error("Error fetching permissions:", error);
                setPermissions("READ_ONLY"); // Default fallback
            }
        };

        if (authState?.isAuthenticated) {
            fetchPermissions();
        }
    }, [authState]);

    return (
        <PermissionsContext.Provider value={permissions}>
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissions = () => useContext(PermissionsContext);
