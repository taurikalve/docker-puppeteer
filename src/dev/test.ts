import { randomUUID } from 'node:crypto';
import path from 'node:path';
import pptr from 'puppeteer';
import { PORT } from '@/lib/env';
import { __userDatasDir } from '@/lib/consts';

(async function () {
  try {
    const browser = await pptr.connect({
      browserWSEndpoint: `ws://localhost:${PORT}`,
      headers: { 'x-user-data': 'my-test-id' },
    });

    const page = await browser.newPage();

    await page.goto('https://digiway.ee');
    await page.waitForSelector('h1');

    console.log('ok');

    await browser.disconnect();
  } catch (err) {
    console.error(err);
  }
})();
