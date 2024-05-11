import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import tools from './tools';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/tools', tools);

export default router;
