import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares';
import api from './api';
import { createProxyMiddleware } from 'http-proxy-middleware';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.end('dassie-tools is running');
});

const ollamaPort = Number(process.env.OLLAMA_PORT);

if (ollamaPort) {
  app.use('/ollama', createProxyMiddleware({
    target: `http://127.0.0.1:${ollamaPort}`, // Target host
    headers: {
      host: `localhost:${ollamaPort}`, // Override the Host header
    },
  }));
}

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
