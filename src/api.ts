import { BotConfig, Bot } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';; // Adjust this to match your backend URL

export async function createBot(config: BotConfig): Promise<string> {
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

export async function getActiveBots(): Promise<Bot[]> {
    console.log("Getting actie bots");
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

export async function modifyBot(botId: string, params: ModifyBotParams): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/modify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bot_id: botId,
      ...params,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to modify bot');
  }
} 