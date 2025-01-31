import PoolQuoterDashboard from "./PoolQuoterDashboard.tsx";
import UnifiedUIPoolQuoter from "./UnifiedUIPoolQuoter.tsx";
import UnifiedUILogin from "./UnifiedUILogin.tsx";
import UnifiedUISettings from "./UnifiedUISettings.tsx";

interface UnifiedUIDashboardProps {
    currentPage: string;
}

const UnifiedUIDashboard = ({currentPage}: UnifiedUIDashboardProps) => {
    const renderPage = () => {
        switch (currentPage) {
            case "PoolQuoter":
                return <PoolQuoterDashboard/>;
            case "Agents":
                return <UnifiedUIPoolQuoter/>;
            case "Settings":
                return <UnifiedUISettings/>;
            default:
                return <UnifiedUILogin/>;
        }
    };

    return <div>{renderPage()}</div>;
}

export default UnifiedUIDashboard;