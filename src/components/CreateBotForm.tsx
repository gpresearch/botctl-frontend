import React, { useState } from 'react';
import { 
  ExchangeNames, 
  StrategyType,
  BotConfig
} from '../types';
import { createBot } from '../api';

interface CreateBotFormProps {
  onBotCreated: () => void;
}

const defaultBaseConfig = {
  exchange: ExchangeNames.BINANCEUSDM,
  instrument: { base: '', quote: '' }
};

const defaultConfigs = {
  [StrategyType.LIMIT_QUOTER]: {
    ...defaultBaseConfig,
    ref_price: 0,
    bid_bps_away_from_ref: 0,
    ask_bps_away_from_ref: 0,
    qty: 0,
  },
  [StrategyType.REAL_QUOTER]: {
    ...defaultBaseConfig,
    quote_interval_ms: 1000,
    max_position_size: 1.0,
    volatility_threshold: 0.02,
  },
  [StrategyType.BASIC_QUOTER]: {
    ...defaultBaseConfig,
    spread_bps: 10,
    order_refresh_seconds: 5,
    position_limit: 1.0,
  },
};

export function CreateBotForm({ onBotCreated }: CreateBotFormProps) {
  const [strategyType, setStrategyType] = useState<StrategyType>(StrategyType.LIMIT_QUOTER);
  const [config, setConfig] = useState<any>(defaultConfigs[StrategyType.LIMIT_QUOTER]);

  const handleStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as StrategyType;
    setStrategyType(newType);
    setConfig(defaultConfigs[newType]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const botConfig: BotConfig = {
        type: strategyType,
        config: config
      };
      await createBot(botConfig);
      onBotCreated();
    } catch (error) {
      console.error('Failed to create bot:', error);
      alert('Failed to create bot');
    }
  };

  const renderStrategySpecificFields = () => {
    switch (strategyType) {
      case StrategyType.LIMIT_QUOTER:
        return (
          <>
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
            <div className="form-group">
              <label>Quantity:</label>
              <input
                type="number"
                step="any"
                value={config.qty}
                onChange={(e) => setConfig({ ...config, qty: parseFloat(e.target.value) })}
              />
            </div>
          </>
        );

      case StrategyType.REAL_QUOTER:
        return (
          <>
            <div className="form-group">
              <label>Quote Interval (ms):</label>
              <input
                type="number"
                value={config.quote_interval_ms}
                onChange={(e) => setConfig({ ...config, quote_interval_ms: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Max Position Size:</label>
              <input
                type="number"
                step="any"
                value={config.max_position_size}
                onChange={(e) => setConfig({ ...config, max_position_size: parseFloat(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Volatility Threshold:</label>
              <input
                type="number"
                step="any"
                value={config.volatility_threshold}
                onChange={(e) => setConfig({ ...config, volatility_threshold: parseFloat(e.target.value) })}
              />
            </div>
          </>
        );

      case StrategyType.BASIC_QUOTER:
        return (
          <>
            <div className="form-group">
              <label>Spread BPS:</label>
              <input
                type="number"
                step="any"
                value={config.spread_bps}
                onChange={(e) => setConfig({ ...config, spread_bps: parseFloat(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Order Refresh (seconds):</label>
              <input
                type="number"
                value={config.order_refresh_seconds}
                onChange={(e) => setConfig({ ...config, order_refresh_seconds: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Position Limit:</label>
              <input
                type="number"
                step="any"
                value={config.position_limit}
                onChange={(e) => setConfig({ ...config, position_limit: parseFloat(e.target.value) })}
              />
            </div>
          </>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-bot-form">
      <h2>Create New Bot</h2>

      <div className="form-group">
        <label>Strategy Type:</label>
        <select
          value={strategyType}
          onChange={handleStrategyChange}
        >
          {Object.values(StrategyType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Exchange:</label>
        <select
          value={config.exchange}
          onChange={(e) => setConfig({ ...config, exchange: e.target.value })}
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

      {renderStrategySpecificFields()}

      <button type="submit">Create Bot</button>
    </form>
  );
}