import localtunnel from 'localtunnel';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

export default class LT {
  tunnels: Record<number, localtunnel.Tunnel> = {};

  async startTunnel(port: number, cacheid: string) {
    const getSubdomain = () => {
      const subdomainPath = path.join(os.tmpdir(), cacheid);
      if (fs.existsSync(subdomainPath)) {
        return fs.readFileSync(subdomainPath, 'utf8');
      }
      const newSubdomain = uuidv4();
      fs.writeFileSync(subdomainPath, newSubdomain);
      return newSubdomain;
    };
    this.tunnels[port] = await localtunnel({ port, subdomain: getSubdomain() });
    return this.tunnels[port];
  }

  async stopTunnel(port: number) {
    return this.tunnels[port]?.close();
  }

  async stopAllTunnels() {
    return Promise.all(Object.keys(this.tunnels).map((port) => {
      return this.stopTunnel(Number(port));
    }));
  }
}