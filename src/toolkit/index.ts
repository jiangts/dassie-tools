import { z } from 'zod';
import './sql-example'
import { describeTable, describeTables, rawQuery } from './sql-example';

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
        return rawQuery(data.query);
      },
    },
    {
      name: 'Describe-Tables',
      description: 'Describes database table schema',
      schema: z.object({
        all_tables: z.boolean().default(true),
      }),
      handler: function (data: any) {
        data = this.schema.parse(data);
        return describeTables()
      },
    },
  ],
};