// @ts-check
import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';
import { worker } from 'node:cluster';


const config=({
  testDir: './tests', 
  timeout: 30 * 1000,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : 1,

  reporter: [
    ['line'],
    ['html', { open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  expect:{
    timeout: 5000,
  },

  projects:[
    {
  name: 'chromium',
  use: {
    browserName: 'chromium',
    headless: process.env.CI ? true : false,
    screenshot: 'on',
    trace: 'on',
    video: 'retain-on-failure',
  }
    },
      {
  name: 'webkit',                                                             
  use: {
    browserName: 'webkit',
    headless: process.env.CI ? true : false,
    screenshot: 'on',
    trace: 'on',
    video: 'retain-on-failure',
    }
  },
  {
  name: 'edge',
  use: {
    browserName: 'chromium',
    channel: 'msedge',
    headless: process.env.CI ? true : false,
    screenshot: 'on',
    trace: 'on',
    video: 'retain-on-failure',
  }
  },
{
  name: 'firefox',
  use: {
    browserName: 'firefox',
    headless: process.env.CI ? true : false,
    screenshot: 'on',
    trace: 'on',
    video: 'retain-on-failure', 
  }

}]

});

module.exports = config

