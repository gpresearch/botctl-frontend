import { BotConfigReq, BotResp, FrontendOrder, SupportedExchangeNames, PoolQuoterResp, SupportedSubaccounts } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';; // Adjust this to match your backend URL

export async function createBot(config: BotConfigReq): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error('Failed to create bot');
  }

  const data = await response.json();
  return data.bot_id;
}

export async function getActiveBots(): Promise<BotResp[]> {
    console.log("Getting active bots at", API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/active_bots`);
    
    if (!response.ok) {
        throw new Error('Failed to get bot status');
    }
    return response.json();
}

export async function stopBots(botIds: string[]): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/stop`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ bot_ids: botIds }),
  });

  if (!response.ok) {
    throw new Error('Failed to stop bots');
  }
}

export interface ModifyBotParams {
  field: string;
  value: number;
}

export async function modifyBot(botId: string, config: BotConfigReq): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/modify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bot_id: botId,
      config: config,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to modify bot');
  }
}

export async function getOpenOrders(exchange: SupportedExchangeNames, base: string, counter: string): Promise<FrontendOrder[]> {
  const response = await fetch(
    `${API_BASE_URL}/open_orders?exchange=${exchange}&base=${base}&counter=${counter}`
  );

  if (!response.ok) {
    throw new Error('Failed to get open orders');
  }

  return response.json();
}

export async function getActivePoolQuoters(): Promise<PoolQuoterResp[]> {
  console.log("Getting active pool quoters at", API_BASE_URL);
  const response = await fetch(`${API_BASE_URL}/active_pool_quoters`);
  
  if (!response.ok) {
    throw new Error('Failed to get pool quoter status');
  }
  return response.json();
}

interface GetPositionRequest {
  exchange: SupportedExchangeNames;
  subaccount: SupportedSubaccounts;
  instrument: {
    base: string;
    quote: string;
  };
}

interface GetPositionResponse {
  position: number;
}

export async function getPosition(request: GetPositionRequest): Promise<GetPositionResponse> {
  // TODO: Replace with actual API call once backend is ready
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock response with a random position between -100 and 100
      resolve({
        position: Math.round((Math.random() * 200 - 100) * 100) / 100
      });
    }, 100);
  });
} 