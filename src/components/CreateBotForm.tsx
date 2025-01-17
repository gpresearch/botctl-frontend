import React, { useState, useEffect } from 'react';
import { 
  SupportedExchangeNames, 
  SupportedStrategyType,
  BotConfig,
  InstrumentPair,
  SupportedSubaccounts,
  SUBACCOUNT_TO_SECRET_PATH_MAP,
  EXCHANGE_TO_SUPPORTED_SUBACCOUNTS_MAP,
  getInstrumentFromEnum
} from '../types';
import { createBot, getPosition } from '../api';
import './CreateBotForm.css';

interface CreateBotFormProps {
  onBotCreated: () => void;
}

const defaultBaseConfig = {
  exchange: SupportedExchangeNames.BINANCEUSDM,
  instrument: getInstrumentFromEnum(InstrumentPair.BTC_USDT),
  subaccount_secret_path : SUBACCOUNT_TO_SECRET_PATH_MAP[SupportedSubaccounts.binance1]
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
  [SupportedStrategyType.TWAP]: {
    ...defaultBaseConfig,
    target_position: 125,
    twap_interval: "1s",
    twap_qty: 0.5,
    width_bps: 25,
    order_size_usd: 25,
    order_jitter_usd: 8.0,
    price_tol_bps: 1.0,
    allow_cross: false,
    time_between_orders: "1s",
    min_resting_time: "5s"
  },
};

export function CreateBotForm({ onBotCreated }: CreateBotFormProps) {
  const [strategyType, setStrategyType] = useState<SupportedStrategyType>(SupportedStrategyType.LIMIT_QUOTER);
  const [config, setConfig] = useState<any>(defaultConfigs[SupportedStrategyType.LIMIT_QUOTER]);
  const [selectedSubaccount, setSelectedSubaccount] = useState<SupportedSubaccounts>(SupportedSubaccounts.binance1);
  const [currentPosition, setCurrentPosition] = useState<number | null>(null);
  const [isLoadingPosition, setIsLoadingPosition] = useState(false);

  // Fetch position when relevant fields change
  useEffect(() => {
    let isMounted = true;

    const fetchPosition = async () => {
      if (strategyType !== SupportedStrategyType.TWAP) {
        setCurrentPosition(null);
        return;
      }

      setIsLoadingPosition(true);
      try {
        const response = await getPosition({
          exchange: config.exchange,
          subaccount: selectedSubaccount,
          instrument: config.instrument
        });
        if (isMounted) {
          setCurrentPosition(response.position);
        }
      } catch (error) {
        console.error('Failed to fetch position:', error);
        if (isMounted) {
          setCurrentPosition(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingPosition(false);
        }
      }
    };

    fetchPosition();
    const interval = setInterval(fetchPosition, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [strategyType, config.exchange, selectedSubaccount, config.instrument]);

  const handleStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as SupportedStrategyType;
    setStrategyType(newType);
    setConfig(defaultConfigs[newType]);
  };

  const handleInstrumentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ins = e.target.value as InstrumentPair;
    setConfig({
      ...config,
      instrument: getInstrumentFromEnum(ins)
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
      case SupportedStrategyType.TWAP:
        return (
          <>
            <div className="form-group">
              <label>Target Position:</label>
              <input
                type="number"
                step="any"
                value={config.target_position}
                onChange={(e) => setConfig({ ...config, target_position: parseFloat(e.target.value) })}
              />
              <div className="current-position">
                <label>Current Position:</label>
                <span className={`position-value ${currentPosition === null ? '' : 'highlight'}`}>
                  {isLoadingPosition ? 'Loading...' : currentPosition === null ? 'N/A' : currentPosition}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label>TWAP Interval:</label>
              <input
                type="text"
                value={config.twap_interval}
                onChange={(e) => setConfig({ ...config, twap_interval: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>TWAP Quantity:</label>
              <input
                type="number"
                step="any"
                value={config.twap_qty}
                onChange={(e) => setConfig({ ...config, twap_qty: parseFloat(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Width BPS:</label>
              <input
                type="number"
                step="any"
                value={config.width_bps}
                onChange={(e) => setConfig({ ...config, width_bps: parseFloat(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Order Size USD:</label>
              <input
                type="number"
                step="any"
                value={config.order_size_usd}
                onChange={(e) => setConfig({ ...config, order_size_usd: parseFloat(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Order Jitter USD:</label>
              <input
                type="number"
                step="any"
                value={config.order_jitter_usd}
                onChange={(e) => setConfig({ ...config, order_jitter_usd: parseFloat(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Price Tolerance BPS:</label>
              <input
                type="number"
                step="any"
                value={config.price_tol_bps}
                onChange={(e) => setConfig({ ...config, price_tol_bps: parseFloat(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Allow Cross:</label>
              <input
                type="checkbox"
                checked={config.allow_cross}
                onChange={(e) => setConfig({ ...config, allow_cross: e.target.checked })}
              />
            </div>
            <div className="form-group">
              <label>Time Between Orders:</label>
              <input
                type="text"
                value={config.time_between_orders}
                onChange={(e) => setConfig({ ...config, time_between_orders: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Min Resting Time:</label>
              <input
                type="text"
                value={config.min_resting_time}
                onChange={(e) => setConfig({ ...config, min_resting_time: e.target.value })}
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