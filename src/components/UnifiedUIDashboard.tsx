import PoolQuoterDashboard from "./PoolQuoterDashboard.tsx";
import UnifiedUIPoolQuoter from "./UnifiedUIPoolQuoter.tsx";

interface UnifiedUIDashboardProps {
    currentPage: string;
}

const UnifiedUIDashboard = ({currentPage}: UnifiedUIDashboardProps) => {
    const renderPage = () => {
        switch (currentPage) {
            case "PoolQuoter":
                return <PoolQuoterDashboard/>;
            case "AllPools":
                return <UnifiedUIPoolQuoter/>;
            case "settings":
                return <div>Settings Page</div>;
            default:
                return <div>Welcome to the Home Page</div>;
        }
    };

    return <div>{renderPage()}</div>;
}

export default UnifiedUIDashboard;