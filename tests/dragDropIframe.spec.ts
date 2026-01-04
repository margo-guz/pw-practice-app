import {expect} from '@playwright/test';
import {test} from '../test-options' //add this to use env variables

test.beforeEach(async({page, globalsQaURL}) => {
    await page.goto(globalsQaURL)
    await page.locator(".fc-dialog-container").getByRole('button', { name: 'Consent' }).click() 
})

test('drag and drop', async ({page}) => {
    //as locator is in iframe, we need to get to that iframe so that PW can see element
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'))

    //precide mouse control while draging
    await frame.locator('li', {hasText: "High Tatras 4"}).hover() //hover over element we want to drag
    await page.mouse.down() //click above element
    await frame.locator('#trash').hover() //move mous einto direction where we want to drop element
    await page.mouse.up() //release mouse button

    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})