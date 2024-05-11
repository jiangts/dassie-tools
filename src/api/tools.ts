import express from 'express';
import { toolkit } from '../toolkit';
import _ from 'lodash';

const router = express.Router();

const { tools = [] } = toolkit;

const toolMap = tools.reduce((acc: any, tool) => {
  acc[tool.name] = tool;
  return acc;
}, {});

router.use('/', (req, res, next) => {
  try {
    const { tool: toolName } = req.query;
    const tool = toolMap[toolName as string];
    if (!tool) {
      return res.status(404).json({ error: 'Tool not found' });
    }
    const input = tool.schema.parse(req.body);
    _.set(req, 'fn', { tool, input });
    next();
  } catch (error: any) {
    res.status(400).json(error);
  }
}, async (req, res) => {
  try {
    const { tool, input } = _.get(req, 'fn') as any;
    const { handler } = tool;
    const output = await handler.call(tool, input);
    return res.json({ output });
  } catch (error: any) {
    res.status(500).json(error);
  }
});

export default router;
