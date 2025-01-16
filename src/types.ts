// TODO[alex]: Populate this from an api response that
// tells the frontend what the available exchanges are.
export enum SupportedExchangeNames {
  BINANCEUSDM = 'binanceusdm',
  BYBIT_SPOT = 'bybit_spot',
  BYBIT_FUTURES = 'bybit_futures',
  METEORA = 'meteora',
}

export enum SupportedSubaccounts {
  binance1 = 'binance1',
  binance4 = 'binance4',
  gate1sinclair = 'gate1sinclair',
  bybitengprotoacct = 'bybitengprotoacct',
}
/*
Hardcoded for now with mappings to secrets paths below.

See below comment in `BaseConfig` for more details on TODO approach.
*/
export const EXCHANGE_TO_SUPPORTED_SUBACCOUNTS_MAP = {
  [SupportedExchangeNames.BINANCEUSDM]: [SupportedSubaccounts.binance1,SupportedSubaccounts.binance4],
  [SupportedExchangeNames.BYBIT_SPOT]: [SupportedSubaccounts.bybitengprotoacct],
  [SupportedExchangeNames.BYBIT_FUTURES]: [SupportedSubaccounts.bybitengprotoacct],
  [SupportedExchangeNames.METEORA]: [SupportedSubaccounts.gate1sinclair],
}

export const SUBACCOUNT_TO_SECRET_PATH_MAP = {
  [SupportedSubaccounts.binance1]: '/prod-test/basis_bot/BINANCEUSDM_SECRET',
  [SupportedSubaccounts.binance4]: '/proto/BINANCEUSDM_SECRET',
  [SupportedSubaccounts.gate1sinclair]: '/prod-test/basis_bot/GATE1SINCLAIR_SECRET',
  [SupportedSubaccounts.bybitengprotoacct]: '/prod-test/basis_bot/BYBIT_ENGP_SECRET',
};


// TODO[alex]: Populate this from an api response that
// tells the frontend what the available instrumes are.
export enum InstrumentPair {
  BTC_USDT = 'BTC/USDT',
  ETH_USDT = 'ETH/USDT',
  SOL_USDT = 'SOL/USDT',
}

export interface Instrument {
  base: string;
  quote: string;
}
// TODO[alex]: Populate this from an api response that
// tells the frontend what the available strategies are.
export enum SupportedStrategyType {
  LIMIT_QUOTER = 'limit_quoter',
  POOL_QUOTER = 'pool_quoter',
}


/*

Define Configs for Strategies launchable through BotCTL.

*/

// Base config interface that all strategies share
interface BaseConfig {
  exchange: SupportedExchangeNames;
  instrument: Instrument;
  // TODO[alex]: Eventually we should make this a subaccount name.
  // that is brought in from a DB and mapped to a secret path so the user
  // can select a supported subaccount and not misconfigure the secret path.
  // this could be accomplished with a subaccount table in PSQL.
  subaccount_secret_path: string;
}

export const CONFIG_MAP = {
  [SupportedStrategyType.LIMIT_QUOTER]: {} as LimitQuoterConfig,
  [SupportedStrategyType.POOL_QUOTER]: {} as BaseConfig, // Using BaseConfig as fallback since no specific config defined
};

export interface TWAPConfig extends BaseConfig {
  ref_price: number;
  bid_bps_away_from_ref: number;
  ask_bps_away_from_ref: number;
  qty: number;
}
export interface PoolQuoterConfig extends BaseConfig {
  ref_price: number;
  bid_bps_away_from_ref: number;
  ask_bps_away_from_ref: number;
  qty: number;
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
  | { type: SupportedStrategyType.LIMIT_QUOTER; config: LimitQuoterConfig }
  | { type: SupportedStrategyType.POOL_QUOTER; config: PoolQuoterConfig }


/*

Bot Response Type used to populate frontend view.

*/
export interface BotResp {
  id: string;
  config: BotConfig;
  status: 'ACTIVE' | 'STOPPED';
  orders: FrontendOrder[];
}

export interface PoolQuoterResp {
  id: string;
  config: BotConfig;
  status: 'ACTIVE' | 'STOPPED';
}

// An order type for display in the frontend.
export interface FrontendOrder {
  id: string;
  side: 'BUY' | 'SELL';
  price: number;
  size: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
  timestamp: string;
} 