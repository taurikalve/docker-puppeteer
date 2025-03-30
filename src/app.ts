import fs from 'node:fs';
import { __userDatasDir } from '@/lib/consts';
import BrowserServer from '@/lib/server';

const server = new BrowserServer();
server.start();

// Process clean-up
process.once('SIGTERM', server.close).once('SIGINT', server.close);

// Ensure existence of userDatas dir
fs.mkdirSync(__userDatasDir, { recursive: true });
