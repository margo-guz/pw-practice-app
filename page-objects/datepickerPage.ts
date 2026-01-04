import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class DatepickerPage extends HelperBase {

       constructor(page: Page){
        super(page)
    }

    async selectCommonDatepickerDateFromToday(numberOfDaysFromToday: number){

        const calendarInput = this.page.getByPlaceholder('Form Picker')
        await calendarInput.click()

        const datetoAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInput).toHaveValue(datetoAssert)
    }

    async selectDatepickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number){
        const calendarInput = this.page.getByPlaceholder('Range Picker')
        await calendarInput.click()

        const datetoAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const datetoAssertEnd= await this.selectDateInTheCalendar(endDayFromToday)

        const datetoAssert = `${datetoAssertStart} - ${datetoAssertEnd}` 
        await expect(calendarInput).toHaveValue(datetoAssert)
    }

    private async selectDateInTheCalendar(numberOfDaysFromToday: number){

        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
    
        const expectedMonthShort = date.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
    
        const expectedYear = date.getFullYear()
        const datetoAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}` //datepicker selection
    
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}` //calendar selection
        
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)) { //handle if selection goes to next month
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
    
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).first().click() 
        return datetoAssert
    }
}
