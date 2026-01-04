import {expect, test} from '@playwright/test';

test.beforeEach(async({page}) => {
    await page.goto('/')
})

test.describe('Form layout page @smoke', () =>{

    test.describe.configure({retries:0}) //configure manually how many retries shouldbe applied for this block

    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async({page}, testInfo) => {

        if (testInfo.retry){
            //do something you need before retrying. For example cleanup DB or testData
        }
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('textbox', {name: "Email"})

        await usingTheGridEmailInput.fill('test@test.com') //adds value to input field
        await usingTheGridEmailInput.clear() //clear value from input field
        await usingTheGridEmailInput.pressSequentially('test2@test.com', {delay: 500}) //simulate keystrokes when entering value, delay adds delay between keystrokes to simulate slower typing

        //generic assertion
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        //locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test.only('radio buttons', async({page}) => {
        const usingTheGriForm = page.locator('nb-card', {hasText: 'Using the Grid'})

        //await usingTheGriForm.getByLabel('Option 1').check({force:true}) // will not work if element is visually hidden, force:true bypasses hidden and clicks
        await usingTheGriForm.getByRole('radio', {name: "Option 1"}).check({force:true})

        const radioStatus = await usingTheGriForm.getByRole('radio', {name: "Option 1"}).isChecked() //return true if checked

        await expect(usingTheGriForm).toHaveScreenshot()
        // expect(radioStatus).toBeTruthy()

        // await expect(usingTheGriForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

        // await usingTheGriForm.getByLabel('Option 2').check({force:true}) // will not work if element is visually hidden, force:true bypasses hidden and clicks
        // expect(await usingTheGriForm.getByRole('radio', {name: "Option 1"}).isChecked()).toBeFalsy()
        // expect(await usingTheGriForm.getByRole('radio', {name: "Option 2"}).isChecked()).toBeTruthy()
    })
})

test.describe('Modal & Overlays page', () => {
    test.beforeEach(async({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()
    }) 

    test('checkboxes', async({page}) => {
        
        await page.getByRole('checkbox', {name: 'Hide on click'}).click({force: true}) //click() performs a click, check() will not click if it is already marked. uncheck() does opposite
        await page.getByRole('checkbox', {name: 'Prevent arising of duplicate toast'}).check({force: true}) //click() performs a click, check() will not click if it is already marked. uncheck() does opposite

        //select all checkboxes
        const allCheckboxes = page.getByRole('checkbox')
        for (const box of await allCheckboxes.all()){  //all() creates an array out of listed elements
            await box.check({force: true})
            expect(await box.isChecked()).toBeTruthy()
        }

        //unselect all checkboxes
        for (const box of await allCheckboxes.all()){  //all() creates an array out of listed elements
            await box.uncheck({force: true})
            expect(await box.isChecked()).toBeFalsy()
        }
    })
})

test('list and dropdowns', async ({page}) => {
    const dropdownMenu = page.locator('ngx-header nb-select') //sometimes dropdown values displayed on click can be a separate locator as they are described separately in DOM
    await dropdownMenu.click()

    page.getByRole('list') //when the list has a Ul tag
    page.getByRole('listitem') //when the list has LI tag

    //const optionList = page.getByRole('list').locator('nb-option') //one possible way to select 
    const optionList = page.locator('nb-option-list nb-option') //more compact
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"]) //validate if list has all elements

    await optionList.filter({hasText: "Cosmic"}).click() //check for specific item

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    const colors = {
        "Light" : "rgb(255, 255, 255)",
        "Dark" : "rgb(34, 43, 69)",
        "Cosmic" : "rgb(50, 50, 89)",
        "Corporate" : "rgb(255, 255, 255)"
    }

    await dropdownMenu.click()
    for (const color in colors){
        await optionList.filter({hasText: color}).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != "Corporate") {
            await dropdownMenu.click()
        }   
    }
})

test('tooltips', async ({page}) => {
    // uses command + \ to freeze browser for tooltip inspection
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCar = page.locator('nb-card', {hasText: 'Tooltip Placements'})
    await toolTipCar.getByRole('button', {name: "Top"}).hover()

    page.getByRole('tooltip') // works only if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog boxes', async ({page}) => {
    //browser dialogs

    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //by default playwright cancels browser dialog boxes, we need to overcome this
    //create a listener and listen for dialog event
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click() 
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')
})

test('web tables', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //get row by any text in this row
    const targetRow = page.getByRole('row', {name: 'twitter@outlook.com'})
    await targetRow.locator('.nb-edit').click()

    //different locator as in edit mode, text in row is displayed as an attribute
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()
  
    //find row by specific column

    //navigate to page 2
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    //select row with column ID
    const targetRowByID = page.getByRole('row', {name: '11'}).filter({has: page.locator('td').nth(1).getByText('11')}) //getByRole('row', {name: '11'}) return 2 values, therefore we have to narrow it down
    await targetRowByID.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowByID.locator('td').nth(5)).toHaveText('test@test.com')

})

test('web tables 2 ', async ({page}) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //loop through table rows and assert values

    const ages = ["20", "30", "40", "200"]

    for(let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        await page.waitForTimeout(500)
        const ageRows = page.locator("tbody tr") //select all rows

        for (let row of await ageRows.all()){ //for each row
            const cellValue = await row.locator("td").last().textContent() //select last column

            if (age == "200") {
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            } else {
                expect(cellValue).toEqual(age) //valdiate if displayed age is correct
            }
            
        }
    }
})

test('date pickers', async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    //select value from calendar, hardcoded. Not the best one
    const calendarInput = page.getByPlaceholder('Form Picker')
    await calendarInput.click()

    await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', {exact: true}).click() //getByText does partial match, so you need to add flag exact
    await expect(calendarInput).toHaveValue('Nov 1, 2025') //hardcode

    //dynamic dates with JS help


})

test('date pickers dynamic', async ({page}) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    //dynamic dates with JS help, same test modified
    const calendarInput = page.getByPlaceholder('Form Picker')
    await calendarInput.click()

    let date = new Date()
    date.setDate(date.getDate() + 14)
    const expectedDate = date.getDate().toString()

    const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
    const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})

    const expectedYear = date.getFullYear()
    const datetoAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}` //datepicker selection

    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}` //calendar selection
 
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)) { //handle if selection goes to next month
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click() 
    await expect(calendarInput).toHaveValue(datetoAssert) 

    


})

test('sliders', async({page}) => {
    //Update attribute, put slider to max position (30C)
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate( node => {
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630') //move slider to max location
    })
    await tempGauge.click() //update UI so that not only slider end moves, but whole cirle fills in

    //simulate mouse movement to change gauge
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger') //area where mouse is moved
    await tempBox.scrollIntoViewIfNeeded() //scroll down so that entire box is displayed on a page. Otherwise mouse movement will not work properly

    const box = await tempBox.boundingBox() //Playwright creates coordinates for element. Top left corner is (0,0). X goes to right, Y down
    //for our convenience, we start at center, rather than corner
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y) //put cursor to center
    await page.mouse.down() // left click of mouse on x y coordinates to begin movement
    await page.mouse.move(x + 100, y) //move mouse horizontally to the right
    await page.mouse.move(x + 100, y + 100) //move mouse down
    await page.mouse.up() // release mouse button

    await expect(tempBox).toContainText('30')
})