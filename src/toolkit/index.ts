import { z } from 'zod';

export const toolkit = {
  toolkit_id: '669a0e19-4f8e-4f59-82b0-008f76dcf2b5',
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