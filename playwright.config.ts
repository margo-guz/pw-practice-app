import { defineConfig, devices, firefox } from '@playwright/test';
import type { TestOptions } from './test-options';

require('dotenv').config(); //enable reading env file from filesystem (proess variables)

export default defineConfig<TestOptions>({ //set <testOptions> if you use environment variables
  timeout: 40000, //configurable
  //globalTimeout: 60000, //configurable, removed for Docker as tests in Docker might run slower
  expect:{
    timeout: 2000 // custom value for expect timeouts
  },
  testDir: './tests', 

  /* Run tests in files in parallel */
  fullyParallel: true, //false for one worker only (executed one by one)
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1, //when we run in CI, retry 2 times, otherwise, no retries
  /* Opt out of parallel tests on CI. */
  
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: [ //for CI/CD
  //   ['json', {outputFile: 'test-results/jsonReport.json'}],
  //   ['junit', {outputFile: 'test-results/junitReport.xml'}],
  //   ['line'], ['allure-playwright'],  //for Allure
  // ],
  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
     baseURL: 'http://localhost:4200',
     globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop', //environment variable, add test-options.ts file

    trace: 'on-first-retry',
    screenshot: "only-on-failure",
    //actionTimeout: 5000, //configurable
    //navigationTimeout: 5000, //configurable
    video: {
      mode: 'off', //to enable video
      size: {width: 1920, height: 1080} //set resolution
     } 
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
    },

    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'dev',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200'  //base URL for dev env
       },
      
    },
    {
      name: 'staging',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4200' //base URL for staging env
       },
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['iPhone 13 Pro']
      }
    },
  ],

  webServer: { //to start up application automatically without having to run it manually
    command: 'npm run start',
    url: 'http://localhost:4200'
  }
});
