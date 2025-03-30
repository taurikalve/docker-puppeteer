import type { Browser, LaunchOptions } from 'puppeteer';
import path from 'node:path';
import pptr from 'puppeteer';
import { __userDatasDir, launchArgs } from '@/lib/consts';
import { MAX_BROWSERS } from '@/lib/env';

export default class BrowserSwarm {
  private waiting: (() => Promise<void>)[] = [];
  private swarm: Browser[] = [];

  private get activeBrowsers() {
    return this.swarm.length;
  }

  public async get(userDataDir?: string): Promise<Browser> {
    if (this.activeBrowsers === MAX_BROWSERS) {
      return new Promise<Browser>((resolve) => {
        this.waiting.push(async () => {
          resolve(await this.startBrowser(userDataDir));
        });
      });
    } else {
      return this.startBrowser(userDataDir);
    }
  }

  public async push(browser: Browser) {
    await this.stopBrowser(browser);

    const next = this.waiting.shift();
    if (next) {
      setImmediate(next);
      return;
    }
  }

  private async startBrowser(userDataDir?: string): Promise<Browser> {
    const launchOpts: LaunchOptions = { args: launchArgs };
    if (userDataDir) {
      launchOpts.userDataDir = path.join(__userDatasDir, userDataDir);
    }

    const browser = await pptr.launch(launchOpts);

    this.swarm.push(browser);
    return browser;
  }
  private async stopBrowser(browser: Browser) {
    // this.swarm = this.swarm.filter((swarmBrowser) => browser !== swarmBrowser);
    await browser.close();
    // Clean-up
    this.swarm = this.swarm.filter((swarmBrowser) => swarmBrowser.connected);
  }

  public async close() {
    return Promise.all(this.swarm.map((browser) => browser.close()));
  }
}
