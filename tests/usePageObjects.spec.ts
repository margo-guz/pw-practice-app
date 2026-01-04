import {expect, test} from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import {faker} from '@faker-js/faker'  //install faker library and import for test data generation

test.beforeEach(async({page}) => {
    await page.goto('/') //looks to baseURl from playwright config
})

test('navigate to form page @smoke', async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

test('parametrized methods @smoke', async({page})=> {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(100)}@test.com` //remove spaces, generate integer between 1-100
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOptions('test@test.com', 'Welcom1', 'Option 1')
    await page.screenshot({path: 'screenshots/formLayoutsPage.png'}) //to make page screenshot
    const buffer = await page.screenshot() //if you need to use picture and send it to some other system
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailCheckbox(randomFullName, randomEmail, false)
    await page.locator('nb-card', {hasText: 'Inline form'}).screenshot({path: 'screenshots/inlineForm.png'}) //to make specific area screenshot

})

test('datepicker page object', async({page}) => {
    const pm = new PageManager(page)

    await pm.navigateTo().datePickerPage()
    await pm.onDatePickerPage().selectCommonDatepickerDateFromToday(10)
    await pm.onDatePickerPage().selectDatepickerWithRangeFromToday(5, 10)
})