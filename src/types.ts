// TODO[alex]: Populate this from an api response that
// tells the frontend what the available exchanges are.
export enum SupportedExchangeNames {
  BINANCEUSDM = 'binanceusdm',
  BYBIT = 'bybit',
  METEORA = 'meteora',
}

export enum SupportedSubaccounts {
  binance1 = 'binance1',
  binance4 = 'binance4',
  binance_alex_testnet = 'binance_alex_testnet',
  gate1sinclair = 'gate1sinclair',
  bybitengprotoacct = 'bybitengprotoacct',
  bybit_alex_testnet = 'bybit_alex_testnet'
}
/*
Hardcoded for now with mappings to secrets paths below.

See below comment in `BaseConfig` for more details on TODO approach.
*/
export const EXCHANGE_TO_SUPPORTED_SUBACCOUNTS_MAP = {
  [SupportedExchangeNames.BINANCEUSDM]: [SupportedSubaccounts.binance1,SupportedSubaccounts.binance4,SupportedSubaccounts.binance_alex_testnet],
  [SupportedExchangeNames.BYBIT]: [SupportedSubaccounts.bybitengprotoacct,SupportedSubaccounts.bybit_alex_testnet],
  [SupportedExchangeNames.METEORA]: [SupportedSubaccounts.gate1sinclair],
}

export const SUBACCOUNT_TO_SECRET_PATH_MAP = {
  [SupportedSubaccounts.binance1]: '/prod-test/basis_bot/BINANCEUSDM_SECRET',
  [SupportedSubaccounts.binance4]: '/proto/BINANCEUSDM_SECRET',
  [SupportedSubaccounts.gate1sinclair]: '/prod-test/basis_bot/GATE1SINCLAIR_SECRET',
  [SupportedSubaccounts.bybitengprotoacct]: '/prod-test/basis_bot/BYBIT_ENGP_SECRET',
  [SupportedSubaccounts.bybit_alex_testnet]: '/alex/basis_bot/BYBIT_SECRET',
  [SupportedSubaccounts.binance_alex_testnet]: '/alex/basis_bot/BINANCEUSDM_SECRET',

};


// TODO[alex]: Populate this from an api response that
// tells the frontend what the available instrumes are.
export enum InstrumentPair {
  BTC_USDT = 'BTC/USDT',
  ETH_USDT = 'ETH/USDT',
  SOL_USDT = 'SOL/USDT',
  XRP_USDT = 'XRP/USDT',
}

export enum InstrumentType {
  SPOT = 'spot',
  PERP = 'perp',
}

export function getInstrumentFromEnum(instrument: InstrumentPair): Instrument {
  const [base, quote] = instrument.split('/');
  return { base: base, counter: quote };
}

export interface Instrument {
  base: string;
  counter: string;
}

export interface ExchangeInstrument {
  base: string;
  counter: string;
  exchange: string;
  type: InstrumentType;
}

// TODO[alex]: Populate this from an api response that
// tells the frontend what the available strategies are.
export enum SupportedStrategyType {
  LIMIT_QUOTER = 'limit_quoter',
  POOL_QUOTER = 'pool_quoter',
  TWAP = 'twap'
}


/*

Define Configs for Strategies launchable through BotCTL.

*/

// Base config interface that all strategies share
interface BaseConfig {
  exchange: SupportedExchangeNames;
  exchange_instrument: ExchangeInstrument;
  // TODO[alex]: Eventually we should make this a subaccount name.
  // that is brought in from a DB and mapped to a secret path so the user
  // can select a supported subaccount and not misconfigure the secret path.
  // this could be accomplished with a subaccount table in PSQL.
  subaccount_secret_path: string;
}





export const CONFIG_MAP = {
  [SupportedStrategyType.LIMIT_QUOTER]: {} as LimitQuoterConfig,
  [SupportedStrategyType.POOL_QUOTER]: {} as PoolQuoterConfig,
  [SupportedStrategyType.TWAP]: {} as TWAPConfigReq,
};

export interface TWAPConfigReq extends BaseConfig {
  target_position: number;
  twap_interval: string;
  twap_qty: number;
  width_bps: number;
  order_size_usd: number;
  order_jitter_usd: number;
  price_tol_bps: number;
  allow_cross: boolean;
  min_cross_bps : number;
  max_cross_bps : number;
  min_resting_time: string;
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
  max_position_usd: number;
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

export type BotConfigReq = 
  | { type: SupportedStrategyType.LIMIT_QUOTER; config: LimitQuoterConfig }
  | { type: SupportedStrategyType.POOL_QUOTER; config: PoolQuoterConfig }
  | { type: SupportedStrategyType.TWAP; config: TWAPConfigReq }


/*

Bot Response Type used to populate frontend view.

*/
export interface BotResp {
  id: string;
  config: BotConfigReq;
  status: 'ACTIVE' | 'STOPPED';
  orders: FrontendOrder[];
}

export interface PoolQuoterResp {
  id: string;
  config: BotConfigReq;
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