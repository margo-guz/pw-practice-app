import {expect, test} from '@playwright/test';

test.beforeEach(async ({page}) => {
    await page.goto('/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
}); //executes before all test suites

// test.describe('forms test suite', () => {
//     test.beforeEach(async ({page}) => {
//         await page.getByText('Forms').click();
//     }); //executes before eaach test in a suite

//     test('the first test', async ({page}) => { //black page
//         await page.getByText('Form Layouts').click();
//     });

//     test.skip('the second test', async ({page}) => {
//         await page.getByText('Datepicker').click();
//     }); 
// kazkodel man sitas nesuveike   
// });

test.skip('locators', async ({page}) => {
    //by tag name
    await page.locator('input').first().click();

    //by id
    await page.locator('#inputEmail1').click(); 

    //by class
    page.locator('.shape-rectangle');

    //by attribute
    page.locator('[placeholder="Email"]');

    //by entire Class value (full)
    page.locator('class="input-full-width size-medium status-basic shape-rectangle nb-transition"');

    //combine different selectors
    page.locator('input[placeholder="Email"].shape-rectangle[nbinput]');

    //by XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]');

    //by partial text match
    page.locator(':text("Using")')

    //by exact text match
    page.locator(':text-is("Using the Grid")')
});

//best practice is to use user facing locators
test('user facing locators', async({page}) => {
    await page.getByRole('textbox', {name: "Email"}).first().click();
    await page.getByRole('button', {name: "Sign in"}).first().click();

    await page.getByLabel('Email').first().click();

    await page.getByPlaceholder('Jane Doe').click();

    await page.getByText('Using the Grid').click();

    await page.getByTestId('SignIn').click(); //for this you need to add data-testid="SignIn" in html

    await page.getByTitle('IoT Dashboard').click();

});

//find child elements
test('locating child elements', async({page}) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click() //separate child from parent with space
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click() //alternative

    await page.locator('nb-card').getByRole('button', {name: "Sign in"}).first().click()

    await page.locator('nb-card').nth(3).getByRole('button').click() //4 th element in DOM, providing index. Rarely used, avoid
});

//find parent web elements
test('locating parent elements', async({page}) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card', {has: page.locator('#inputEmail1')}).getByRole('textbox', {name: "Email"}).click()

    await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).click()
    await page.locator('nb-card').filter({has: page.locator('.status-danger')}).getByRole('textbox', {name: "Password"}).click()

    await page.locator('nb-card').filter({has: page.locator('nb-checkbox')}).filter({hasText: "Sign in"}).getByRole('textbox', {name: "Email"}).click() //benefit of using filter - you can chain them

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', {name: "Email"}).click() //using XPATH better avoid
});

//reuse locators
test('reusing locators', async ({page}) => {
    //original:
    //await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Email"}).fill('test@test.com')
    //await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('textbox', {name: "Password"}).fill('Welcome123')
    //await page.locator('nb-card').filter({hasText: "Basic form"}).getByRole('button').click()

    //refactored
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const emailField = basicForm.getByRole('textbox', {name: "Email"})

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', {name: "Password"}).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click()
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com') //assertion
})

//extract values from DOM
test('extract values', async ({page}) => {
    //get single text value
    const basicForm = page.locator('nb-card').filter({hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()

    expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1")

    //input value
    const emailField = basicForm.getByRole('textbox', {name: "Email"})
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    //get value of attribute
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

//assertion differencies
test('assertions', async ({page}) => {
    //general assertions, very straightforward
    const value = 5
    expect(value).toEqual(5)

    const basicFormButton = page.locator('nb-card').filter({hasText: "Basic form"}).locator('button')
    const text = await basicFormButton.textContent()
    expect(text).toEqual("Submit")

    //locator assertion. In stead of providing exact value in expect, we provide a locator. Need to add await
    await expect(basicFormButton).toHaveText('Submit')

    //soft assertion - text execution can continue if assertion failed. Not a good practice
    await expect.soft(basicFormButton).toHaveText('Submit5')
    await basicFormButton.click()

})
