import { z } from 'zod';

export const toolkit = {
  toolkit_id: '839a5a30-17ab-4381-be7b-734ccee6a7f6',
  tools: [
    {
      name: 'Run SQL',
      description: 'A collection of tools for DassieAI',
      schema: z.object({
        query: z.string().describe('The SQL query to execute'),
      }),
      handler: function (data: any) {
        data = this.schema.parse(data);
        return `Executing SQL query: ${JSON.stringify(data.query)}`;
      },
    },
  ],
};