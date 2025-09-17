export class supplierStartPage {
    constructor(page) {
        this.page = page;
    }

    async gotoSite() {
        await this.page.goto('https://testppe10.plusnavigate.ikeadt.com/Thingworx/Runtime/index.html?mashup=IKEA.Supplier.Portal.V1');
    }

    async login(){
        await this.page.waitForTimeout(1000);
        await this.page.locator('#username').click();
        await this.page.locator('#username').fill('plustest21');
        await this.page.locator('#password').click();
        await this.page.locator('#password').fill('plus21Q4');
        await this.page.getByTitle('Sign On').click();
        await this.page.waitForTimeout(1000);
    }
    async newIRCOption() {
        //click on the menu icon
        //await this.page.locator('#root_flexcontainer-87-bounding-box iron-icon'). click();
        //await this.page.locator('#root_ptcsdropdown-95 #select').click();
        //await this.page.locator('#root_ptcsdropdown-95').getByLabel('Choose an option').click();
        //await this.page.locator('#root_ptcsdropdown-95').getByText('Choose an option').click();
        //await this.page.locator('#root_ptcsdropdown-95').click();
        //await this.page.locator('#root_ptcsdropdown-95 iron-icon').click();
        await this.page.locator('#root_ptcsdropdown-86 iron-icon').click();


        //choose the IR
        await this.page.getByLabel('IR', { exact: true }).locator('ptcs-div').click();
        //await this.page.waitForTimeout(5 * 1000);
        //choose the implemented option
        //await this.page.locator('ptcs-div').filter({ hasText: 'Implemented' }).nth(1).click();
        //await this.page.locator('ptcs-div').filter({ hasText: 'Implemented' }).nth(2).click();
        //await this.page.getByText('Implemented').nth(1).click();
        //await this.page.getByText('Implemented', { exact: true }).nth(1).click();


        await this.page.waitForTimeout(1 * 1000);

    }

    async onGoingPage() {
        await this.page.getByText('Ongoing').nth(1).click();
        //await page.locator('ptcs-div').filter({ hasText: 'Ongoing' }).nth(2).click();
    }
    async searchForIRWithArticleNumber(articleNumber) {
        await this.page.getByText('Search with Impl.request,').click();
        await this.page.getByLabel('Search with Impl.request,').fill(articleNumber);
        await this.page.getByLabel('Search with Impl.request,').press('Enter');
    }

}

module.exports = supplierStartPage;