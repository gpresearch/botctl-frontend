import React, { useState } from 'react';
import { ExchangeNames, LimitQuoterConfig } from '../types';
import { createBot } from '../api';

interface CreateBotFormProps {
  onBotCreated: () => void;
}

export function CreateBotForm({ onBotCreated }: CreateBotFormProps) {
  const [config, setConfig] = useState<LimitQuoterConfig>({
    exchange: ExchangeNames.BINANCE,
    instrument: { base: '', quote: '' },
    ref_price: 0,
    bid_bps_away_from_ref: 0,
    ask_bps_away_from_ref: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createBot(config);
      onBotCreated();
    } catch (error) {
      console.error('Failed to create bot:', error);
      alert('Failed to create bot');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-bot-form">
      <h2>Create New Bot</h2>
      
      <div className="form-group">
        <label>Exchange:</label>
        <select
          value={config.exchange}
          onChange={(e) => setConfig({ ...config, exchange: e.target.value as ExchangeNames })}
        >
          {Object.values(ExchangeNames).map((exchange) => (
            <option key={exchange} value={exchange}>{exchange}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Base Currency:</label>
        <input
          type="text"
          value={config.instrument.base}
          onChange={(e) => setConfig({
            ...config,
            instrument: { ...config.instrument, base: e.target.value.toUpperCase() }
          })}
          placeholder="BTC"
        />
      </div>

      <div className="form-group">
        <label>Quote Currency:</label>
        <input
          type="text"
          value={config.instrument.quote}
          onChange={(e) => setConfig({
            ...config,
            instrument: { ...config.instrument, quote: e.target.value.toUpperCase() }
          })}
          placeholder="USDT"
        />
      </div>

      <div className="form-group">
        <label>Reference Price:</label>
        <input
          type="number"
          step="any"
          value={config.ref_price}
          onChange={(e) => setConfig({ ...config, ref_price: parseFloat(e.target.value) })}
        />
      </div>

      <div className="form-group">
        <label>Bid BPS Away:</label>
        <input
          type="number"
          step="any"
          value={config.bid_bps_away_from_ref}
          onChange={(e) => setConfig({ ...config, bid_bps_away_from_ref: parseFloat(e.target.value) })}
        />
      </div>

      <div className="form-group">
        <label>Ask BPS Away:</label>
        <input
          type="number"
          step="any"
          value={config.ask_bps_away_from_ref}
          onChange={(e) => setConfig({ ...config, ask_bps_away_from_ref: parseFloat(e.target.value) })}
        />
      </div>

      <button type="submit">Create Bot</button>
    </form>
  );
} 