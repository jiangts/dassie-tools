import express from 'express';
import { registerOllama, registerTools } from '../comms';

const router = express.Router();

router.get('/tools', async (req, res) => {
  try {
    const { app } = req;
    const toolkitServerUrl = app.get('toolkitServerUrl');
    const result = await registerTools(toolkitServerUrl);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ollama', async (req, res) => {
  try {
    const { app } = req;
    const ollamaUrl = app.get('ollamaUrl');
    const result = await registerOllama(ollamaUrl);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
