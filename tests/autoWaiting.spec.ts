import {expect, test} from '@playwright/test';
import { chromium } from 'playwright';

// (async () => {
//   const browser = await chromium.launch();
//   const context = await browser.newContext({ ignoreHTTPSErrors: true });
//   const page = await context.newPage();
//   await page.goto('https://www.uitestingplayground.com/ajax');
//   // ...
//   await browser.close();
// })();   used this to avoid certificate errors

//documentation https://playwright.dev/docs/actionability

test.beforeEach(async({page}, testInfo) => {
    testInfo.setTimeout(testInfo.timeout + 2000) //increases default timeouts by 2 seconds
})


test('auto-wait', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();
    await page.goto(process.env.URL);
    await page.getByText('Button Triggering AJAX Request').click();
    const successButton = page.locator('.bg-success')

    await successButton.click() //waits for button to appear

    const text = await successButton.textContent() //waits for button to appear

    const text2 = await successButton.allTextContents() //fails because it does not wait

    //we can implement additional wait logic:
    await successButton.waitFor({state: "attached"})

    const text3 = await successButton.allTextContents()
    expect(text3).toContain('Data loaded with AJAX get request.')//now works, changed toEqual to toContain because it is an array

    //await expect(successButton).toHaveText('Data loaded with AJAX get request.') //fails because it waits 5s
    await expect(successButton).toHaveText('Data loaded with AJAX get request.', {timeout: 20000}) //passes as you overriden timeout

    await browser.close();
})

test('alternative waits', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();
    await page.goto(process.env.URL);
    await page.getByText('Button Triggering AJAX Request').click();
    const successButton = page.locator('.bg-success')

    //wait for element
    await page.waitForSelector('.bg-success')

    //wait for particular response
    await page.waitForResponse('https://www.uitestingplayground.com/ajaxdata')

    //wait for network calls to be completed (not recommended)
    await page.waitForLoadState('networkidle') //if your API is stuck, your test will also be stuck

    const text = await successButton.allTextContents() 
    expect(text).toContain('Data loaded with AJAX get request.')

})

test('timeouts', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();
    await page.goto(process.env.URL);
    await page.getByText('Button Triggering AJAX Request').click();

    test.setTimeout(10000) //override global timeout
    test.slow() //if you have slow flaky test, you can mark it with this and playwright will increase timeouts 3 times
    
    const successButton = page.locator('.bg-success')
    await successButton.click({timeout: 16000}) //override action timeout
})
 
 