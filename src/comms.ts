import { Express } from 'express';
import { toolkit } from './toolkit';
import zodToJsonSchema from 'zod-to-json-schema';
import _ from 'lodash';

const API_KEY = process.env.DASSIE_API_KEY;
const DASSIE_ORIGIN = process.env.DASSIE_ORIGIN || 'https://api.dassieai.com';

export const registerTools = async (app: Express, toolkitServerUrl: string) => {

  const toolkitData = _.cloneDeep(toolkit);
  for (const tool of toolkitData.tools) {
    tool.schema = zodToJsonSchema(tool.schema) as any;
  }
  const body = {
    toolkit,
    toolkitServerUrl,
  };

  const response = await fetch(DASSIE_ORIGIN + '/api/toolkits/register', {
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

  const response = await fetch(DASSIE_ORIGIN + '/api/toolkits/register-ollama', {
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
