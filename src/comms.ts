import { Express } from 'express';

const API_KEY = process.env.DASSIE_API_KEY;
const DASSIE_ORIGIN = process.env.DASSIE_ORIGIN || 'https://api.dassieai.com';

export const registerTools = async (app: Express, toolServerUrl: string) => {
  const tools = app.get('tools') || [];

  const body = {
    tools,
    toolServerUrl,
  };

  const response = await fetch(DASSIE_ORIGIN + '/api/tools/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    } as any,
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log('response', data);
  return data;
};


export const registerOllama = async (ollamaUrl: string) => {
  const body = { ollamaUrl };

  const response = await fetch(DASSIE_ORIGIN + '/api/tools/register-ollama', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    } as any,
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log('response', data);
  return data;
};
