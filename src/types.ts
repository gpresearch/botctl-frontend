export enum ExchangeNames {
  BINANCEUSDM = 'binanceusdm',  // Add other exchanges as needed
}

export interface Instrument {
  base: string;
  quote: string;
}

export enum StrategyType {
  LIMIT_QUOTER = 'limit_quoter',
  REAL_QUOTER = 'real_quoter',
//   TWAP = 'TWAP',
  BASIC_QUOTER = 'basic_quoter'
}

// Base config interface that all strategies share
interface BaseConfig {
  exchange: ExchangeNames;
  instrument: Instrument;
}

export interface LimitQuoterConfig extends BaseConfig {
  ref_price: number;
  bid_bps_away_from_ref: number;
  ask_bps_away_from_ref: number;
  qty: number;
}

export interface RealQuoterConfig extends BaseConfig {
  quote_interval_ms: number;
  max_position_size: number;
  volatility_threshold: number;
}

export interface TWAPConfig extends BaseConfig {
  target_size: number;
  time_window_seconds: number;
  max_participation_rate: number;
}

export interface BasicQuoterConfig extends BaseConfig {
  spread_bps: number;
  order_refresh_seconds: number;
  position_limit: number;
}

export type BotConfig = 
  | { type: StrategyType.LIMIT_QUOTER; config: LimitQuoterConfig }
  | { type: StrategyType.REAL_QUOTER; config: RealQuoterConfig }
//   | { type: StrategyType.TWAP; config: TWAPConfig }
  | { type: StrategyType.BASIC_QUOTER; config: BasicQuoterConfig }

export interface Bot {
  id: string;
  config: BotConfig;
  status: 'ACTIVE' | 'STOPPED';
  orders: Order[];
}

export interface Order {
  id: string;
  side: 'BUY' | 'SELL';
  price: number;
  size: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
  timestamp: string;
} 