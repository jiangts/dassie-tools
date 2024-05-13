require('dotenv').config();

import app from './app';
import { registerOllama, registerTools } from './comms';
import LT from './tunnel';
import ngrok from '@ngrok/ngrok';
import 'colors';

const port = Number(process.env.PORT || 8888);
const domain = process.env.DOMAIN;
const ollamaPort = process.env.OLLAMA_PORT;
const ngrokAuthToken = process.env.NGROK_AUTHTOKEN;

const lt = new LT();

const server = app.listen(port, async () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */

  let toolkitServerUrl = domain;
  if (!toolkitServerUrl) {
    // Start LocalTunnel
    // give time for localtunnel server to deallocate the subdomain
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // const tunnel = await lt.startTunnel(port);
    // toolkitServerUrl = tunnel.url;
    // TODO: move ngrok tunnel code to tunnel.ts
    const tunnel = await ngrok.forward({
      addr: port,
      authtoken: ngrokAuthToken,
    });
    toolkitServerUrl = tunnel.url() || '';
  }
  console.log(`Webhook URL: ${toolkitServerUrl}`);
  await registerTools(toolkitServerUrl);
  app.set('toolkitServerUrl', toolkitServerUrl);

  if (ollamaPort) {
    if (!ngrokAuthToken) {
      console.info('\nNGROK_AUTHTOKEN is required to use Ollama.\n'.red +
      'To get a token, visit https://dashboard.ngrok.com/get-started/your-authtoken '.blue +
      'and add it to your .env file.\n'.blue);
    } else {
      // see below two links
      // https://github.com/ollama/ollama/blob/main/docs/faq.md#how-can-i-use-ollama-with-ngrok
      // https://github.com/ngrok/ngrok-javascript/blob/main/index.d.ts
      const listener = await ngrok.forward({
        addr: ollamaPort,
        authtoken: ngrokAuthToken,
        request_header_remove: ['host'],
        request_header_add: ['host:localhost:11434'],
      });
      const ollamaUrl = listener.url();
      if (ollamaUrl) {
        console.log(`Ollama server URL: ${ollamaUrl}`);
        await registerOllama(ollamaUrl);
        app.set('ollamaUrl', ollamaUrl);
      }
    }
  }
});

// Close the tunnel when the Node.js process ends
process.on('SIGINT', () => {
  lt.stopAllTunnels();
  server.close();
});
