const { test, expect } = require("@playwright/test");
import { helper } from "../helper-functions/helper-windchill.js";
let credentials = require("../credentials.json");
import { locators } from "../locators/locators-windchill.js";



//Test 1: "Validate Product Part Creator is Able to Create Part in Product Context in Folder Level"
test("Basic Part Creation", async({page}) => {

    //Login Using PLUSTEST14 Credentials
    test.step("Login to Windchill", async() => {
        await helper.performLoginWithSteps(page);
        await helper.fillLoginFormIfNeeded(page);
        expect(locators.projectManagerHomePage(page)).toBeVisible();
    });

    //Navigate to browse -> Products -> BEDS -> Folders
    test.step.skip("Navigator to Folders", async() =>{
       //await helper.navigaToTestAutomationFolder(page);

    });

    test.step.skip("Create New Part Using Part Icon in Folder Level", async() => {


    });

    test.step.skip("Verify User Can Create Part", async() => {



    });
});

//Test 2: Validate User While Creating Part is Able to Classify and Define the Part and do Checkin
test("Classify and Define Part Creation Validation", async ({page}) => {

    //Login Using PLUSTEST14 Credentials
    test.step("Login to Windchill", async() => {
        await helper.performLoginWithSteps(page);
        await helper.fillLoginFormIfNeeded(page);
        expect(locators.projectManagerHomePage(page)).toBeVisible();

    });

    //Navigate to browse -> Products -> BEDS -> Folders
    test.step("Navigator to Folders", async() =>{


    });

    test.step("Create New Part and Fill Classify and Define Parts", async() => {


    });




});




