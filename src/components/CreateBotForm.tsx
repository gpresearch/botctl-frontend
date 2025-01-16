import React, { useState } from 'react';
import { 
  SupportedExchangeNames, 
  SupportedStrategyType,
  BotConfig,
  InstrumentPair,
  SupportedSubaccounts,
  SUBACCOUNT_TO_SECRET_PATH_MAP,
  EXCHANGE_TO_SUPPORTED_SUBACCOUNTS_MAP
} from '../types';
import { createBot } from '../api';

interface CreateBotFormProps {
  onBotCreated: () => void;
}

const defaultBaseConfig = {
  exchange: SupportedExchangeNames.BINANCEUSDM,
  instrument: InstrumentPair.BTC_USDT,
};

const defaultConfigs = {
  [SupportedStrategyType.LIMIT_QUOTER]: {
    ...defaultBaseConfig,
    ref_price: 0,
    bid_bps_away_from_ref: 0,
    ask_bps_away_from_ref: 0,
    qty: 0,
  },
  [SupportedStrategyType.POOL_QUOTER]: {
    ...defaultBaseConfig,
    ref_price: 0,
    bid_bps_away_from_ref: 0,
    ask_bps_away_from_ref: 0,
    qty: 0,
  },
};

export function CreateBotForm({ onBotCreated }: CreateBotFormProps) {
  const [strategyType, setStrategyType] = useState<SupportedStrategyType>(SupportedStrategyType.LIMIT_QUOTER);
  const [config, setConfig] = useState<any>(defaultConfigs[SupportedStrategyType.LIMIT_QUOTER]);
  const [selectedSubaccount, setSelectedSubaccount] = useState<SupportedSubaccounts>(SupportedSubaccounts.binance1);


  const handleStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as SupportedStrategyType;
    setStrategyType(newType);
    setConfig(defaultConfigs[newType]);
  };

  const handleInstrumentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [base, quote] = (e.target.value as InstrumentPair).split('/');
    setConfig({
      ...config,
      instrument: { base, quote }
    });
  };

  const handleSubaccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subaccount = (e.target.value as SupportedSubaccounts);
    setSelectedSubaccount(subaccount);
    setConfig({
      ...config,
      subaccount_secret_path: SUBACCOUNT_TO_SECRET_PATH_MAP[subaccount]
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const botConfig: BotConfig = {
        type: strategyType,
        config: config
      };
      console.log("Submitting bot config to backend:", botConfig);
      await createBot(botConfig);
      onBotCreated();
    } catch (error) {
      alert('Failed to create bot');
    }
  };

  const renderStrategySpecificFields = () => {
    switch (strategyType) {
      case SupportedStrategyType.LIMIT_QUOTER:
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
      case SupportedStrategyType.POOL_QUOTER:
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
          {Object.values(SupportedStrategyType).map((type) => (
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
          {Object.values(SupportedExchangeNames).map((exchange) => (
            <option key={exchange} value={exchange}>{exchange}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Instrument:</label>
        <select
          value={`${config.instrument.base}/${config.instrument.quote}`}
          onChange={handleInstrumentChange}
        >
          {Object.values(InstrumentPair).map((instrument) => (
            <option key={instrument} value={instrument}>{instrument}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Subaccount:</label>
        <select
          value={selectedSubaccount}
          onChange={handleSubaccountChange}
        >
          {EXCHANGE_TO_SUPPORTED_SUBACCOUNTS_MAP[config.exchange as SupportedExchangeNames].map((subaccount: SupportedSubaccounts) => (
            <option key={subaccount} value={subaccount}>{subaccount}</option>
          ))}
        </select>
      </div>

      {renderStrategySpecificFields()}

      <button type="submit">Create Bot</button>
    </form>
  );
}