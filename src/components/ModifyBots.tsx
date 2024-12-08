import React, { useState, useEffect } from 'react';
import { Bot } from '../types';
import { getActiveBots, modifyBot, ModifyBotParams } from '../api';

interface ModifyBotsProps {
  botIds: string[];
}

interface EditingBot {
  id: string;
  ref_price: number;
  bid_bps_away_from_ref: number;
  ask_bps_away_from_ref: number;
}

export function ModifyBots({ botIds }: ModifyBotsProps) {
  const [bots, setBots] = useState<Bot[]>([]);
  const [editingBot, setEditingBot] = useState<EditingBot | null>(null);

  useEffect(() => {
    const fetchBots = async () => {
      const botPromises = botIds.map(id => getActiveBots(id));
      const fetchedBots = await Promise.all(botPromises);
      setBots(fetchedBots);
    };

    fetchBots();
    const interval = setInterval(fetchBots, 5000);
    return () => clearInterval(interval);
  }, [botIds]);

  const handleEditClick = (bot: Bot) => {
    setEditingBot({
      id: bot.id,
      ref_price: bot.config.ref_price,
      bid_bps_away_from_ref: bot.config.bid_bps_away_from_ref,
      ask_bps_away_from_ref: bot.config.ask_bps_away_from_ref,
    });
  };

  const handleSaveClick = async () => {
    if (!editingBot) return;

    try {
      const params: ModifyBotParams = {
        ref_price: editingBot.ref_price,
        bid_bps_away_from_ref: editingBot.bid_bps_away_from_ref,
        ask_bps_away_from_ref: editingBot.ask_bps_away_from_ref,
      };

      await modifyBot(editingBot.id, params);
      setEditingBot(null);
    } catch (error) {
      console.error('Failed to modify bot:', error);
      alert('Failed to modify bot');
    }
  };

  const handleCancelClick = () => {
    setEditingBot(null);
  };

  return (
    <div className="modify-bots">
      <h2>Modify Bots</h2>
      <table>
        <thead>
          <tr>
            <th>Exchange</th>
            <th>Instrument</th>
            <th>Reference Price</th>
            <th>Bid BPS</th>
            <th>Ask BPS</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bots.map(bot => (
            <tr key={bot.id}>
              <td>{bot.config.exchange}</td>
              <td>{`${bot.config.instrument.base}/${bot.config.instrument.quote}`}</td>
              <td>
                {editingBot?.id === bot.id ? (
                  <input
                    type="number"
                    step="any"
                    value={editingBot.ref_price}
                    onChange={(e) => setEditingBot({
                      ...editingBot,
                      ref_price: parseFloat(e.target.value)
                    })}
                    className="edit-input"
                  />
                ) : (
                  bot.config.ref_price
                )}
              </td>
              <td>
                {editingBot?.id === bot.id ? (
                  <input
                    type="number"
                    step="any"
                    value={editingBot.bid_bps_away_from_ref}
                    onChange={(e) => setEditingBot({
                      ...editingBot,
                      bid_bps_away_from_ref: parseFloat(e.target.value)
                    })}
                    className="edit-input"
                  />
                ) : (
                  bot.config.bid_bps_away_from_ref
                )}
              </td>
              <td>
                {editingBot?.id === bot.id ? (
                  <input
                    type="number"
                    step="any"
                    value={editingBot.ask_bps_away_from_ref}
                    onChange={(e) => setEditingBot({
                      ...editingBot,
                      ask_bps_away_from_ref: parseFloat(e.target.value)
                    })}
                    className="edit-input"
                  />
                ) : (
                  bot.config.ask_bps_away_from_ref
                )}
              </td>
              <td>
                {editingBot?.id === bot.id ? (
                  <div className="button-group">
                    <button
                      onClick={handleSaveClick}
                      className="save-button"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelClick}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick(bot)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 