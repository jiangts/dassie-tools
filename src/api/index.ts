import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import tools from './tools';
import register from './register';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/tools', tools);
router.use('/register', register);

export default router;
