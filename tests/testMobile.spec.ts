import {expect, test} from '@playwright/test';


 test('input fields', async({page}, testInfo) => {

    await page.goto('/')
    if (testInfo.project.name == 'mobile'){  ///when you want to have universal tests for mobile and web
        await page.locator('.sidebar-toggle').click()
    }
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    if (testInfo.project.name == 'mobile'){
        await page.locator('.sidebar-toggle').click()
    }

    const usingTheGridEmailInput = page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: "Email"})

    await usingTheGridEmailInput.fill('test@test.com') //adds value to input field
    await usingTheGridEmailInput.clear() //clear value from input field
    await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500}) //simulate keystrokes when entering value, delay adds delay between keystrokes to simulate slower typing
 })