import { z } from 'zod';

export const toolkit = {
  handle: 'Allan/local-toolkit',
  tools: [
    {
      name: 'Run-SQL',
      description: 'Runs SQL query on a database',
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