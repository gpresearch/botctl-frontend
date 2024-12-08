// Import required dependencies from React and custom types/API functions
import React, { useState, useEffect } from 'react';
import { Bot, Order } from '../types';
import { getBotStatus, getBotOrders, stopBots } from '../api';

// Define the props interface for the ActiveBots component
interface ActiveBotsProps {
  botIds: string[];        // Array of bot IDs to display
  onBotsUpdated: () => void; // Callback function when bots are updated
}

export function ActiveBots({ botIds, onBotsUpdated }: ActiveBotsProps) {
  // State management using React hooks
  const [bots, setBots] = useState<Bot[]>([]); // Store list of bots
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null); // Currently selected bot
  const [orders, setOrders] = useState<Order[]>([]); // Orders for selected bot
  const [selectedBotIds, setSelectedBotIds] = useState<Set<string>>(new Set()); // Bots selected for bulk actions

  // Effect hook to fetch and update bot statuses periodically
  useEffect(() => {
    const fetchBots = async () => {
      const botPromises = botIds.map(id => getBotStatus(id));
      const fetchedBots = await Promise.all(botPromises);
      setBots(fetchedBots);
    };

    fetchBots(); // Initial fetch
    const interval = setInterval(fetchBots, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [botIds]);

  // Effect hook to fetch and update orders for selected bot
  useEffect(() => {
    const fetchOrders = async () => {
      if (selectedBotId) {
        const fetchedOrders = await getBotOrders(selectedBotId);
        setOrders(fetchedOrders);
      }
    };

    fetchOrders(); // Initial fetch
    const interval = setInterval(fetchOrders, 2000); // Refresh every 2 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [selectedBotId]);

  // Handler for when a bot row is clicked
  const handleBotSelect = (botId: string) => {
    setSelectedBotId(botId);
  };

  // Handler for bot checkbox selection
  const handleBotCheckbox = (botId: string, checked: boolean) => {
    const newSelected = new Set(selectedBotIds);
    if (checked) {
      newSelected.add(botId);
    } else {
      newSelected.delete(botId);
    }
    setSelectedBotIds(newSelected);
  };

  // Handler for stopping multiple selected bots
  const handleStopSelectedBots = async () => {
    try {
      await stopBots(Array.from(selectedBotIds));
      setSelectedBotIds(new Set()); // Clear selections after stopping
      onBotsUpdated(); // Notify parent component of update
    } catch (error) {
      console.error('Failed to stop bots:', error);
      alert('Failed to stop bots');
    }
  };

  return (
    <div className="active-bots">
      {/* Bots list section */}
      <div className="bots-list">
        <h2>Active Bots</h2>
        <div className="bot-controls">
          <button
            onClick={handleStopSelectedBots}
            disabled={selectedBotIds.size === 0}
          >
            Stop Selected Bots
          </button>
        </div>
        {/* Table displaying bot information */}
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Exchange</th>
              <th>Instrument</th>
              <th>Reference Price</th>
              <th>Bid BPS</th>
              <th>Ask BPS</th>
            </tr>
          </thead>
          <tbody>
            {bots.map(bot => (
              <tr
                key={bot.id}
                onClick={() => handleBotSelect(bot.id)}
                className={selectedBotId === bot.id ? 'selected' : ''}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedBotIds.has(bot.id)}
                    onChange={(e) => handleBotCheckbox(bot.id, e.target.checked)}
                    onClick={(e) => e.stopPropagation()} // Prevent row selection when clicking checkbox
                  />
                </td>
                <td>{bot.config.exchange}</td>
                <td>{`${bot.config.instrument.base}/${bot.config.instrument.quote}`}</td>
                <td>{bot.config.ref_price}</td>
                <td>{bot.config.bid_bps_away_from_ref}</td>
                <td>{bot.config.ask_bps_away_from_ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Orders list section - only shown when a bot is selected */}
      {selectedBotId && (
        <div className="orders-list">
          <h3>Open Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Side</th>
                <th>Price</th>
                <th>Size</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className={order.side.toLowerCase()}>{order.side}</td>
                  <td>{order.price}</td>
                  <td>{order.size}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 