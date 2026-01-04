import { Locator, Page } from "@playwright/test";
import { using } from "rxjs";
import { HelperBase } from "./helperBase";

export class FormLayoutsPage extends HelperBase{

    constructor(page: Page){
        super(page)
    }

    async submitUsingTheGridFormWithCredentialsAndSelectOptions(email: string, password: string, optionText: string) {
        const usingTheGriForm = this.page.locator('nb-card', {hasText: 'Using the Grid'})
        await usingTheGriForm.getByRole('textbox', {name: "Email"}).fill(email)
        await usingTheGriForm.getByRole('textbox', {name: "Password"}).fill(password)
        await usingTheGriForm.getByRole('radio', {name: optionText}).check({force:true})
        await usingTheGriForm.getByRole('button').click()
    }

    /**
     * This method fills out Inline form with user details
     * @param name first and last name
     * @param email valid email
     * @param rememberMe indicator whether to mark remember me
     */
    async submitInlineFormWithNameEmailCheckbox (name: string, email: string, rememberMe: boolean) {
        const inlineForm = this.page.locator('nb-card', {hasText: 'Inline Form'})
        await inlineForm.getByRole('textbox', {name: "Jane Doe"}).fill(name)
        await inlineForm.getByRole('textbox', {name: "Email"}).fill(email)
        if (rememberMe) {
            await inlineForm.getByRole('checkbox').check({force: true})
            await inlineForm.getByRole('button').click()
        }
    }
}