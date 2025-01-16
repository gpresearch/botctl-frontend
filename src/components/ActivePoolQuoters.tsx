import { useState, useEffect } from 'react';
import { PoolQuoterResp } from '../types';
import { stopBots, getActivePoolQuoters } from '../api';
import './ActivePoolQuoters.css';

interface ActivePoolQuotersProps {
  onBotsUpdated: () => void;
}

export function ActivePoolQuoters({ onBotsUpdated }: ActivePoolQuotersProps) {
  const [poolQuoters, setPoolQuoters] = useState<PoolQuoterResp[]>([]);
  const [selectedBotIds, setSelectedBotIds] = useState<Set<string>>(new Set());
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoolQuoters = async () => {
      const activeQuoters = await getActivePoolQuoters();
      setPoolQuoters(activeQuoters);
    };

    fetchPoolQuoters();
    const interval = setInterval(fetchPoolQuoters, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleBotCheckbox = (botId: string, checked: boolean) => {
    const newSelected = new Set(selectedBotIds);
    if (checked) {
      newSelected.add(botId);
    } else {
      newSelected.delete(botId);
    }
    setSelectedBotIds(newSelected);
  };

  const handleStopSelectedBots = async () => {
    try {
      const botIdsToStop = Array.from(selectedBotIds);
      await stopBots(botIdsToStop);
      setNotification(`Sent Stop Bot Request for ${botIdsToStop.join(', ')}`);
      setSelectedBotIds(new Set());
      onBotsUpdated();
    } catch (error) {
      console.error('Failed to stop bots:', error);
      alert('Failed to stop bots');
    }
  };

  return (
    <div className="active-pool-quoters">
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      <div className="pool-quoters-list">
        <h2>Active Pool Quoters</h2>
        <div className="bot-controls">
          <button
            onClick={handleStopSelectedBots}
            disabled={selectedBotIds.size === 0}
          >
            Stop Selected Pool Quoters
          </button>
        </div>
        <div className="bots-grid">
          {poolQuoters.map(bot => (
            <div key={bot.id} className="bot-card">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Bot ID</th>
                    <th>Strategy</th>
                    <th>Exchange</th>
                    <th>Instrument</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedBotIds.has(bot.id)}
                        onChange={(e) => handleBotCheckbox(bot.id, e.target.checked)}
                      />
                    </td>
                    <td>{bot.id}</td>
                    <td>{bot.config.type}</td>
                    <td>{bot.config.config.exchange}</td>
                    <td>{`${bot.config.config.instrument.base}/${bot.config.config.instrument.quote}`}</td>
                  </tr>
                </tbody>
              </table>

              <div className="config-section">
                <h4>Configuration</h4>
                <table className="config-table">
                  <tbody>
                    {Object.entries(bot.config.config)
                      .filter(([key, value]) => typeof value === 'number')
                      .map(([field, value]) => (
                        <tr key={field}>
                          <td>{field}:</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 