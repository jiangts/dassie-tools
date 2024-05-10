import app from './app';
import LT from './tunnel';

require('dotenv').config();

const port = Number(process.env.PORT || 8888);
const domain = process.env.DOMAIN;

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
});

// Close the tunnel when the Node.js process ends
process.on('SIGINT', () => {
  lt.stopAllTunnels();
  server.close();
});
