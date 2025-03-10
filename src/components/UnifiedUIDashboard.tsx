import PoolQuoterDashboard from "./PoolQuoterDashboard.tsx";
import UnifiedUIPoolQuoter from "./UnifiedUIPoolQuoter.tsx";
import UnifiedUILogin from "./UnifiedUILogin.tsx";
import UnifiedUISettings from "./UnifiedUISettings.tsx";
import UnifiedUIBotCTL from "./UnifiedUIBotCTL.tsx";
import UnifiedUIQA from "./UnifiedUIQA.tsx";

interface UnifiedUIDashboardProps {
    currentPage: string;
}

const UnifiedUIDashboard = ({currentPage}: UnifiedUIDashboardProps) => {
    const renderPage = () => {
        switch (currentPage) {
            case "PoolQuoter":
                return <PoolQuoterDashboard/>;
            case "BotCTL":
                return <UnifiedUIBotCTL/>;
            case "QA":
                return <UnifiedUIQA/>;
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