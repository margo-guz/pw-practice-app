import { test } from '../test-options' //import fixture
import {faker} from '@faker-js/faker'  //install faker library and import for test data generation

// test.beforeEach(async({page}) => {
//     await page.goto('/') //looks to baseURl from playwright config
// }) taken care by fixture

test('parametrized methods', async({pageManager})=> { //use fixture or remove if you set auto: true in test options
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ','')}${faker.number.int(100)}@test.com` //remove spaces, generate integer between 1-100

    //await pm.navigateTo().formLayoutsPage() taken care by fixture
    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOptions('test@test.com', 'Welcom1', 'Option 1')
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailCheckbox(randomFullName, randomEmail, false)
})