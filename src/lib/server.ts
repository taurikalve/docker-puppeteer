import type { Socket } from 'node:net';
import type { IncomingMessage, Server } from 'node:http';
import http from 'node:http';
import { promises as fsp } from 'node:fs';
import { printTime } from '@/lib/utils';
import { isDev } from '@/lib/consts';
import { MAX_BROWSERS, PORT } from '@/lib/env';
import BrowserSwarm from '@/lib/swarm';

export default class BrowserServer {
  private swarm: BrowserSwarm;

  constructor() {
    this.swarm = new BrowserSwarm();
  }

  private server: Server = http
    .createServer()
    .on('upgrade', async (req: IncomingMessage, socket: Socket, head) => {
      this.handleSocket(req, socket, head);
    })
    .on('listening', () => {
      console.log(printTime(), '- browser-handler running');
      console.log(
        Object.entries({ PORT, MAX_BROWSERS })
          .map((e) => e.join('='))
          .join('\n'),
      );
      // ...
    });

  private async handleSocket(
    req: IncomingMessage,
    socket: Socket,
    head: Buffer,
  ) {
    // console.log('socket headers:', req.headers);
    const browser = await this.swarm.get(req.headers['x-user-data']);

    socket
      .setNoDelay(true)
      .setKeepAlive(true, 0)
      .once('close', () => this.swarm.push(browser));

    const wsUrl = new URL(browser.wsEndpoint());
    const proxyReq = http.request({
      hostname: wsUrl.hostname,
      port: wsUrl.port,
      path: wsUrl.pathname + wsUrl.search,
      method: req.method,
      headers: req.headers,
    });

    proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
      // Setup proxySocket
      proxySocket
        .setTimeout(0)
        .setNoDelay(true)
        .setKeepAlive(true, 0)
        .on('close', () => {
          socket.destroy();
        });

      socket.write(
        'HTTP/1.1 101 Switching Protocols\r\n' +
          'Connection: Upgrade\r\n' +
          'Upgrade: websocket\r\n' +
          `Sec-WebSocket-Accept: ${proxyRes.headers['sec-websocket-accept']}\r\n\r\n`,
      );

      // Establish full duplex
      proxySocket.pipe(socket).pipe(proxySocket);
    });

    // Error
    proxyReq.on('error', (err) => {
      console.error('Proxy request error:', err);
      socket.destroy();
    });

    proxyReq.end();
  }

  public async start() {
    this.server.listen({ port: PORT, host: '0.0.0.0' });
  }

  public async close() {
    await this.swarm.close();
    this.server.close();
  }
  // ...
}
