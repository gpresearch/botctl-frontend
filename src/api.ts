import { LimitQuoterConfig, Bot, Order } from './types';

const API_BASE_URL = 'http://localhost:8000'; // Adjust this to match your backend URL

export async function createBot(config: LimitQuoterConfig): Promise<string> {
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

export async function getBotStatus(botId: string): Promise<Bot> {
  const response = await fetch(`${API_BASE_URL}/status/${botId}`);
  
  if (!response.ok) {
    throw new Error('Failed to get bot status');
  }

  return response.json();
}

export async function getBotOrders(botId: string): Promise<Order[]> {
  const response = await fetch(`${API_BASE_URL}/orders/${botId}`);
  
  if (!response.ok) {
    throw new Error('Failed to get bot orders');
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