import 'dotenv/config';
import util from 'node:util';
import { __rootDir } from '@/lib/consts';

export const PORT = parseInt(process.env.PORT!) as number;
export const MAX_BROWSERS = parseInt(process.env.MAX_BROWSERS!) as number;

// Ensure required
if (([PORT, MAX_BROWSERS] as unknown[]).includes(undefined)) {
  console.error('>process env err:', '\n' + process.env);
  throw new Error('invalid env');
}
