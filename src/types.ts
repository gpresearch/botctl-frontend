export enum ExchangeNames {
  BINANCE = 'BINANCE',
  COINBASE = 'COINBASE',
  // Add other exchanges as needed
}

export interface Instrument {
  base: string;
  quote: string;
}

export interface LimitQuoterConfig {
  exchange: ExchangeNames;
  instrument: Instrument;
  ref_price: number;
  bid_bps_away_from_ref: number;
  ask_bps_away_from_ref: number;
}

export interface Bot {
  id: string;
  config: LimitQuoterConfig;
  status: 'ACTIVE' | 'STOPPED';
}

export interface Order {
  id: string;
  side: 'BUY' | 'SELL';
  price: number;
  size: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
  timestamp: string;
} 