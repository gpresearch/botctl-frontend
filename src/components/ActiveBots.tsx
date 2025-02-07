// Import required dependencies from React and custom types/API functions
import React, { useState, useEffect } from 'react';
import { BotResp } from '../types';
import { stopBots, getActiveBots, modifyBot } from '../api';
import './ActiveBots.css';

// Define the props interface for the ActiveBots component
interface ActiveBotsProps {
  botIds: string[];        // Array of bot IDs to display
  onBotsUpdated: () => void; // Callback function when bots are updated
}

interface EditableField {
  id: string;
  field: string;  // Make this more generic to handle any field
  value: number;
}

export function ActiveBots({ botIds, onBotsUpdated }: ActiveBotsProps) {
  const [bots, setBots] = useState<BotResp[]>([]);
  const [selectedBotIds, setSelectedBotIds] = useState<Set<string>>(new Set());
  const [editingField, setEditingField] = useState<EditableField | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchBots = async () => {
      const activeBots = await getActiveBots();
      console.log("Got active bots", activeBots);
      setBots(activeBots);
    };

    fetchBots();
    const interval = setInterval(fetchBots, 5000);
    return () => clearInterval(interval);
  }, [botIds]);

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

  const handleEditField = (botId: string, field: string, value: number) => {
    setEditingField({ id: botId, field, value });
  };

  const handleFieldKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editingField) {
      try {
        const bot = bots.find(b => b.id === editingField.id);
        if (!bot) return;

        let updatedConfig = { ...bot.config };
        // Update local state immediately
        setBots(currentBots => currentBots.map(b => {
          if (b.id === editingField.id) {
            updatedConfig = { ...b.config };
            if (updatedConfig.type === bot.config.type) {
              updatedConfig.config = {
                ...updatedConfig.config,
                [editingField.field]: editingField.value
              };
            }
            return {
              ...b,
              config: updatedConfig
            };
          }
          return b;
        }));

        // Need to update config here bc above setState seems to execute after this function completes.
        bot.config.config = {
          ...updatedConfig.config,
          [editingField.field]: editingField.value
        };
  
        await modifyBot(editingField.id, bot.config);
        setNotification('Updated value sent to bot');
        setEditingField(null);
      } catch (error) {
        console.error('Failed to modify bot:', error);
        alert('Failed to modify bot');
      }
    } else if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const renderEditableField = (bot: BotResp, field: string) => {
    const isEditing = editingField?.id === bot.id && editingField?.field === field;
    const value = bot.config.config[field as keyof typeof bot.config.config];

    if (typeof value !== 'number') return null;

    if (isEditing) {
      return (
        <input
          type="number"
          className="editable-field"
          value={editingField.value}
          onChange={(e) => setEditingField({
            ...editingField,
            value: parseFloat(e.target.value)
          })}
          onKeyDown={handleFieldKeyPress}
          onBlur={() => setEditingField(null)}
          autoFocus
        />
      );
    }

    return (
      <div
        className="editable-field-display"
        onClick={() => handleEditField(bot.id, field, value)}
      >
        {value}
      </div>
    );
  };

  const renderConfigFields = (bot: BotResp) => {
    const configFields = Object.entries(bot.config.config)
      .filter(([_, value]) => typeof value === 'number')
      .map(([field, _]) => (
        <tr key={field}>
          <td>{field}:</td>
          <td>{renderEditableField(bot, field)}</td>
        </tr>
      ));

    return configFields;
  };

  return (
    <div className="active-bots">
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
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
        <div className="bots-grid">
          {bots.map(bot => (
            <div key={bot.id} className="bot-card">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Bot ID</th>
                    <th>Strategy</th>
                    <th>Exchange</th>
                    <th>Instrument</th>
                    <th>Type</th>
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
                    <td>{`${bot.config.config.exchange_instrument.base}/${bot.config.config.exchange_instrument.counter}`}</td>
                    <td>{bot.config.config.exchange_instrument.type}</td>
                  </tr>
                </tbody>
              </table>

              <div className="config-section">
                <h4>Configuration</h4>
                <table className="config-table">
                  <tbody>
                    {renderConfigFields(bot)}
                  </tbody>
                </table>
              </div>

              <div className="orders-section">
                <h4>Open Orders</h4>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Side</th>
                      <th>Price</th>
                      <th>Size</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bot.orders.map(order => (
                      <tr key={order.id}>
                        <td className={order.side.toLowerCase()}>{order.side}</td>
                        <td>{order.price}</td>
                        <td>{order.size}</td>
                        <td>{order.status}</td>
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