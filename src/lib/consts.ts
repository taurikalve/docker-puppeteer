import type { LaunchOptions } from 'puppeteer';
import path from 'node:path';

export const isDev = process.env.NODE_ENV === 'development';

export const __rootDir = path.resolve(__dirname, '..', '..');
export const __userDatasDir = path.join(__rootDir, 'userDatas');

export const launchArgs: LaunchOptions['args'] = [
  // '--no-sandbox',
  '--disable-features=' +
    [
      'MetricsReportingEnabled',
      'UsageStats',
      'IsolateOrigins', // Reduce process isolation
      'site-per-process', // Reduce process isolation
      'BackForwardCache', // Prevents caching for better stealth
      'AutofillServerCommunication', // Disables autofill suggestions
      'InterestCohort', // Blocks Google's FLoC tracking
    ].join(','),
  '--disable-background-networking', // Stops background connections
  '--disable-component-extensions-with-background-pages',
  '--disable-default-apps', // Prevents installation of default apps
  '--disable-device-discovery-notifications',
  '--disable-sync', // Disables sync with Google services
  '--disable-blink-features=AutomationControlled', // Prevents bot detection
  '--disable-client-side-phishing-detection', // Prevents phishing warnings
  '--disable-site-isolation-trials', // Disables site isolation
  // Stealth Enhancements
  '--no-first-run', // Skips first-run setup
  '--no-default-browser-check', // Avoids the "set default browser" prompt
  '--hide-scrollbars', // Hides scrollbars (avoids scrollbar-based detection)
  '--disable-remote-fonts', // Optional: Blocks font fingerprinting
  '--disable-remote-playback-api', // Blocks media remote playback features
  // Performance Enhancements
  '--disable-backgrounding-occluded-windows', // Prevents background throttling
  '--disable-renderer-backgrounding', // Keeps renderer processes active
  '--disable-background-timer-throttling', // Prevents task delays
  '--disable-extensions', // Ensures no unnecessary extensions run
  // Extra - attempting to solve CPU occasional flooding
  '--disable-logging',
  '--disable-crash-reporter',
  '--disable-gpu',
  '--disable-software-rasterizer',
];
