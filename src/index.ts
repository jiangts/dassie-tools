import app from './app';
import LT from './tunnel';
import ngrok from '@ngrok/ngrok';

require('dotenv').config();

const port = Number(process.env.PORT || 8888);
const domain = process.env.DOMAIN;
const ollamaPort = process.env.OLLAMA_PORT;

const lt = new LT();

const server = app.listen(port, async () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */

  if (!domain) {
    // Start LocalTunnel
    // give time for localtunnel server to deallocate the subdomain
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const tunnel = await lt.startTunnel(port, 'dassie-tools');
    console.log(`Webhook URL: ${tunnel.url}`);
  } else {
    console.log(`Webhook URL: ${domain}`);
  }
  if (ollamaPort) {
    // see below two links
    // https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-use-ollama-with-ngrok
    // https://github.com/ngrok/ngrok-javascript/blob/main/index.d.ts
    const listener = await ngrok.forward({
      addr: ollamaPort,
      authtoken_from_env: true,
      request_header_remove: ['host'],
      request_header_add: ['host:localhost:11434'],
    });
    console.log(`Ingress established at: ${listener.url()}`);
  }
});

// Close the tunnel when the Node.js process ends
process.on('SIGINT', () => {
  lt.stopAllTunnels();
  server.close();
});
