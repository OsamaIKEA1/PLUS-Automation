const { test, expect } = require("@playwright/test");
const { setupHooks, sharedData } = require("../hooks/hooks.js"); // Import hooks and shared data
const dynamicValues = require("../dynamic-values.js");

import { locators } from "../locators/locators.js";
import { locators as windchillLocators } from "../locators/locators-windchill.js";
import * as helperSupplier from "../helper-functions/helper-supplier.js";
import * as helperWindchill from "../helper-functions/helper-windchill.js";
import * as purchasingHelper from "../helper-functions/helper-purchasing.js";
import * as sharedHelper from "../helper-functions/shared-helpers.js";

setupHooks();
//let columnsNamesNewIrPage;
let dialogHandled = false;
let dialogHandledSupplier = false;
let dialogHandledPurchasing = false;
let newPageForSupplier;
let newPageForPurchasing;
test.beforeAll(async ({ browser, playwright }) => {
  //columnsNamesNewIrPage = await purchasingHelper.saveColumnsNamesIrTableNewIrPage(sharedData.page);
  //let columnsNamesOngoingPage = await purchasingHelper.saveColumnsNamesIrTableOngoingPage(sharedData.page);
  //let columnsNamesImplementedPage = await purchasingHelper.saveColumnsNamesIrTableImplementedPage(sharedData.page);
  //let columnsNamesRevisionRequestPage = await purchasingHelper.saveColumnsNamesIrTableRevisionRequestPage(sharedData.page);
  //let columnsNamesCancellationRequestPage = await purchasingHelper.saveColumnsNameIrTableCancellationPage(sharedData.page);
  // New context for the supplier portal
  const browserr = sharedData.page.context().browser();
  const newContext = await browserr.newContext();
  newPageForSupplier = await newContext.newPage();

  const browserForPur = sharedData.page.context().browser();
  //const newContextPur = await browserForPur.newContext();
  newPageForPurchasing = await sharedData.page.context().newPage();
});

// Tested
// Required: 1 IR with status (Released for Purchasing) in Windchill that is not cancelled and can be cancelled through the enviroment user and connected to an article number in the test environment.(will moved to cancelled tab in purchasing/supplier)
test.describe("Validation for IR with status (Release for Purchasing) when getting cancelled", () => {
  let IRNumber = "";
  let IRIsCancelled = true;
  let rowForNotCancelledIr = 0;
  let row2 = 0;

  test("Test Case #1: Validate that IR with (Released for Purchasing) in windchill is removed from purchasing user when sending a cancell request.", async ({ playwright }) => {
    while (IRIsCancelled) {
      // Expected result: user should be able to open the IR details page in windchill for the status "Released for Purchasing" and IR number should be displayed.
      await test.step("Login to windchill and open the IR details which is in Release for Purchasing state", async () => {
        await helperWindchill.performLoginWithSteps(sharedData.page);
        await helperWindchill.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);
        await windchillLocators.stateButtonInAdvancedSearch(sharedData.page).click();
        await windchillLocators.stateButtonInAdvancedSearch(sharedData.page).click();

        let foundReleasedIr = false;

        while (!foundReleasedIr) {
          let state = await windchillLocators
            .tableInAdvancedSearch(sharedData.page)
            .nth(row2 + rowForNotCancelledIr)
            .locator("td")
            .nth(dynamicValues.numberStatusColumnAdvancedSearchTableWindchill)
            .innerText();
          if (state === "Released to Purchasing") {
            foundReleasedIr = true;
          } else {
            row2++;
            if (row2 + rowForNotCancelledIr > (await windchillLocators.tableInAdvancedSearch(sharedData.page).count())) {
              throw new Error("No Released IR found in the first 10 search result");
            }
          }
        }

        await windchillLocators
          .tableInAdvancedSearch(sharedData.page)
          .nth(row2 + rowForNotCancelledIr)
          .locator("td")
          .nth(dynamicValues.numberInfoColumnInAdvancedSearchTableWindchill)
          .click();
        let tempIRNumber = await windchillLocators.irColumnInAdvancedSearchResultTable(sharedData.page);
        IRNumber = tempIRNumber.trim();
        expect(IRNumber).not.toBeNull();
        expect(IRNumber).not.toBe("");
      });

      await test.step("Check if the IR is allready cancelled", async () => {
        await helperWindchill.performLoginWithSteps(newPageForPurchasing);
        await windchillLocators.globalSearchBar(newPageForPurchasing).click();
        await newPageForPurchasing.waitForTimeout(0.2 * 1000);
        await windchillLocators.globalSearchBar(newPageForPurchasing).fill(IRNumber);
        await newPageForPurchasing.keyboard.press("Enter");
        await newPageForPurchasing.waitForTimeout(2 * 1000);
        let table = await windchillLocators.tableInGlobalSearch(newPageForPurchasing);
        await table.getByText(IRNumber).first().click();
        await newPageForPurchasing.waitForTimeout(2 * 1000);
        await newPageForPurchasing.locator("#infoPageinfoPanelID__infoPage_myTab_object_changeReviewProcessTab").click();
        //const element = await newPageForPurchasing.locator('.x-grid3-col-ASSIGNMENT_OBJECT').nth(1);
        const element = await newPageForPurchasing.locator(".x-grid3-col-procName ").first();
        //let te= await element.locator("label");
        let irInnerTextForLatestStatus = await element.innerText();
        let trimmedirInnerTextForLatestStatus = await irInnerTextForLatestStatus.trim();
        if (trimmedirInnerTextForLatestStatus == "Design Review Cancellation Workflow") {
          IRIsCancelled = true;
          rowForNotCancelledIr++;
        } else {
          IRIsCancelled = false;
        }
      });
    }

    // Expected result: user should be able to see the action button in the IR details page and click on cancel implementation request option.
    await test.step("Click on action button and click on Cancell Implementation reuquest option.", async () => {
      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.actionButtonInIrPage(sharedData.page));
      await windchillLocators.actionButtonInIrPage(sharedData.page).click();
      if (!dialogHandled) {
        await sharedData.page.on("dialog", async (dialog) => {
          console.log(`Dialog message: ${dialog.message()}`);
          dialogHandled = true;
          // To click "OK"
          await dialog.accept();

          // Or to click "Cancel"
          // await dialog.dismiss();
        });
      }

      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.cancelImplementationRequestButton(sharedData.page));
      expect(windchillLocators.cancelImplementationRequestButton(sharedData.page)).toBeVisible();
      await windchillLocators.cancelImplementationRequestButton(sharedData.page).click();

      await sharedData.page.waitForTimeout(5 * 1000);
    });

    // Expected result: user should be able to see the status of the cancelled Ir changed to (Cancelled) instead of (Released for Purchasing).
    await test.step("Check if the status of the IR is changed to Cancelled in the Windchilll", async () => {
      await helperWindchill.performLoginWithSteps(sharedData.page);
      await helperWindchill.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);
      await windchillLocators.stateButtonInAdvancedSearch(sharedData.page).click();
      await windchillLocators.stateButtonInAdvancedSearch(sharedData.page).click();
      // seach for the cancelled IR in windchill
      await windchillLocators.searchBarInAdvancedSearchResult(sharedData.page).click();
      await windchillLocators.searchBarInAdvancedSearchResult(sharedData.page).fill(IRNumber);
      await sharedData.page.keyboard.press("Enter");

      // check that the state is changed to cancelled
      let state = await windchillLocators.tableInAdvancedSearch(sharedData.page).nth(0).locator("td").nth(dynamicValues.numberStatusColumnAdvancedSearchTableWindchill).innerText();
      expect(state).toBe("Cancelled");
    });

    // Expected result: user should not be able to find the IR in SCP New IR page.
    await test.step("Login to purchasing SCP view in New IR page and search the cancalled IR details in all tab.", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToNewIrPage(sharedData.page);
      let isIrExsit = await purchasingHelper.isIrExistInListPage(sharedData.page, IRNumber);
      expect(isIrExsit).toBe(false);
    });

    // Expected result: user should not be able to find the IR in SCP Ongoing page.
    await test.step("Login to purchasing SCP view in Ongoing page and search the cancalled IR details in all tab.", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToOngoingPage(sharedData.page);
      let isIrExsit = await purchasingHelper.isIrExistInListPage(sharedData.page, IRNumber);
      expect(isIrExsit).toBe(false);
    });

    // Expected result: user should not be able to find the IR in SCP Implemented page.
    await test.step("Login to purchasing SCP view in Implemented page and search the cancalled IR details in all tab.", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToImplementedPage(sharedData.page);
      let isIrExsit = await purchasingHelper.isIrExistInListPage(sharedData.page, IRNumber);
      expect(isIrExsit).toBe(false);
    });

    // Expected result: user should not be able to find the IR in SCP Revision request page.
    await test.step("Login to purchasing SCP view in Revision request page and search the cancalled IR details in all tab.", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToRevisionRequestPage(sharedData.page);
      let isIrExsit = await purchasingHelper.isIrExistInListPage(sharedData.page, IRNumber);
      expect(isIrExsit).toBe(false);
    });

    // Expected result: user should not be able to find the IR in SCP Cancellation request page.
    await test.step("Login to purchasing SCP view in Cancellation request page and search the cancalled IR details in all tab.", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToCancellationPage(sharedData.page);
      await sharedData.page.waitForTimeout(2 * 1000);
      let isIrExsit = await purchasingHelper.isIrExistInListPage(sharedData.page, IRNumber);
      expect(isIrExsit).toBe(false);
    });
  });
});

// Tested
// Required: 2 IR with status (Released for Purchasing) in Windchill that is not cancelled and can be cancelled through the enviroment user and connected to an article number in the test environment.
test.describe("Validation for IR with status (Release for Implementation) when getting cancelled and ability for the Supplier approval", () => {
  test("Test Case #1: Validate that cancelled IR with status (Release for Implementation) visible in Cancellation tab for purchasing user.", async ({ playwright }) => {
    let IRNumber = "";
    let IRIsCancelled = true;
    let rowForNotCancelledIr = 0;
    let row2 = 0;

    while (IRIsCancelled) {
      // Expected result: user should be able to open the IR details page in windchill for the status "Released for Implementation" and IR number should be displayed.
      await test.step("Login to windchill and open the IR details which are in Release for Implementation state", async () => {
        await helperWindchill.performLoginWithSteps(sharedData.page);

        await helperWindchill.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);
        await windchillLocators.stateButtonInAdvancedSearch(sharedData.page).click();
        await windchillLocators.stateButtonInAdvancedSearch(sharedData.page).click();

        let foundReleasedIr = false;

        while (!foundReleasedIr) {
          let state = await windchillLocators
            .tableInAdvancedSearch(sharedData.page)
            .nth(row2 + rowForNotCancelledIr)
            .locator("td")
            .nth(dynamicValues.numberStatusColumnAdvancedSearchTableWindchill)
            .innerText();
          if (state === "Released for Implementation") {
            foundReleasedIr = true;
          } else {
            row2++;
            if (row2 + rowForNotCancelledIr > (await windchillLocators.tableInAdvancedSearch(sharedData.page).count())) {
              throw new Error("No IR found ");
            }
          }
        }

        await windchillLocators
          .tableInAdvancedSearch(sharedData.page)
          .nth(row2 + rowForNotCancelledIr)
          .locator("td")
          .nth(dynamicValues.numberInfoColumnInAdvancedSearchTableWindchill)
          .click();
        let tempIRNumber = await windchillLocators.irColumnInAdvancedSearchResultTable(sharedData.page);
        IRNumber = tempIRNumber.trim();
        expect(IRNumber).not.toBeNull();
        expect(IRNumber).not.toBe("");
      });

      await test.step("Check if the IR is allready cancelled", async () => {
        await helperWindchill.performLoginWithSteps(newPageForPurchasing);
        await windchillLocators.globalSearchBar(newPageForPurchasing).click();
        await newPageForPurchasing.waitForTimeout(0.2 * 1000);
        await windchillLocators.globalSearchBar(newPageForPurchasing).fill(IRNumber);
        await newPageForPurchasing.keyboard.press("Enter");
        await newPageForPurchasing.waitForTimeout(2 * 1000);
        let table = await windchillLocators.tableInGlobalSearch(newPageForPurchasing);
        await table.getByText(IRNumber).first().click();
        await newPageForPurchasing.waitForTimeout(2 * 1000);
        await newPageForPurchasing.locator("#infoPageinfoPanelID__infoPage_myTab_object_changeReviewProcessTab").click();
        //const element = await newPageForPurchasing.locator('.x-grid3-col-ASSIGNMENT_OBJECT').nth(1);
        const element = await newPageForPurchasing.locator(".x-grid3-col-procName ").first();
        //let te= await element.locator("label");
        let irInnerTextForLatestStatus = await element.innerText();
        let trimmedirInnerTextForLatestStatus = await irInnerTextForLatestStatus.trim();
        if (trimmedirInnerTextForLatestStatus == "Design Review Cancellation Workflow") {
          IRIsCancelled = true;
          rowForNotCancelledIr++;
        } else {
          IRIsCancelled = false;
        }
      });
    }
    // Expected result: user should be able to see the action button in the IR details page and click on cancel implementation request option.
    await test.step("Click on action button and click on Cancell Implementation reuquest option.", async () => {
      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.actionButtonInIrPage(sharedData.page));
      await windchillLocators.actionButtonInIrPage(sharedData.page).click();

      if (!dialogHandled) {
        await sharedData.page.on("dialog", async (dialog) => {
          console.log(`Dialog message: ${dialog.message()}`);
          dialogHandled = true;
          // To click "OK"
          await dialog.accept();

          // Or to click "Cancel"
          // await dialog.dismiss();
        });
      }
      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.cancelImplementationRequestButton(sharedData.page));
      await windchillLocators.cancelImplementationRequestButton(sharedData.page).click();

      await sharedData.page.waitForTimeout(5 * 1000);
    });

    // Expected result: user should be able to find the IR in Cancellation request page in SCP Purchasing user.
    await test.step("Login to purchasing view SCP search that IR details in all tab in Cancellation Request, Ir should be Visible.", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToCancellationPage(sharedData.page);
      await sharedData.page.waitForTimeout(2 * 1000);
      let isIrExist = await purchasingHelper.isIrExistInListPage(sharedData.page, IRNumber);
      expect(isIrExist).toBe(true);
    });
  });

  test("Test Case #2:  Validate that cancelled IR with status (Release for Implementation) visible in Cancellation tab for Supplier user and cab be approved and change the state of it in windchill.", async ({ playwright }) => {
    let IRNumber = "";
    let IRIsCancelled = true;
    let rowForNotCancelledIr = 0;
    let row2 = 0;
    while (IRIsCancelled) {
      // Expected result: user should be able to open the IR details page in windchill for the status "Released for Implementation" and IR number should be displayed.
      await test.step("Login to windchill and open the IR details which are in Release for Implementation state", async () => {
        await helperWindchill.performLoginWithSteps(sharedData.page);
        await helperWindchill.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);
        await windchillLocators.stateButtonInAdvancedSearch(sharedData.page).click();
        await windchillLocators.stateButtonInAdvancedSearch(sharedData.page).click();
        let foundReleasedIr = false;

        while (!foundReleasedIr) {
          let state = await windchillLocators
            .tableInAdvancedSearch(sharedData.page)
            .nth(row2 + rowForNotCancelledIr)
            .locator("td")
            .nth(dynamicValues.numberStatusColumnAdvancedSearchTableWindchill)
            .innerText();
          if (state === "Released for Implementation") {
            foundReleasedIr = true;
          } else {
            row2++;
            if (row2 + rowForNotCancelledIr > (await windchillLocators.tableInAdvancedSearch(sharedData.page).count())) {
              throw new Error("No IR found ");
            }
          }
        }

        await windchillLocators
          .tableInAdvancedSearch(sharedData.page)
          .nth(row2 + rowForNotCancelledIr)
          .locator("td")
          .nth(dynamicValues.numberInfoColumnInAdvancedSearchTableWindchill)
          .click();
        let tempIRNumber = await windchillLocators.irColumnInAdvancedSearchResultTable(sharedData.page);
        IRNumber = tempIRNumber.trim();
        expect(IRNumber).not.toBeNull();
        expect(IRNumber).not.toBe("");
      });
      await test.step("Check if the IR is allready cancelled", async () => {
        await helperWindchill.performLoginWithSteps(newPageForPurchasing);
        await windchillLocators.globalSearchBar(newPageForPurchasing).click();
        await newPageForPurchasing.waitForTimeout(0.2 * 1000);
        await windchillLocators.globalSearchBar(newPageForPurchasing).fill(IRNumber);
        await newPageForPurchasing.keyboard.press("Enter");
        await newPageForPurchasing.waitForTimeout(2 * 1000);
        let table = await windchillLocators.tableInGlobalSearch(newPageForPurchasing);
        await table.getByText(IRNumber).first().click();
        await newPageForPurchasing.waitForTimeout(2 * 1000);
        await newPageForPurchasing.locator("#infoPageinfoPanelID__infoPage_myTab_object_changeReviewProcessTab").click();
        //const element = await newPageForPurchasing.locator('.x-grid3-col-ASSIGNMENT_OBJECT').nth(1);
        const element = await newPageForPurchasing.locator(".x-grid3-col-procName ").first();
        //let te= await element.locator("label");
        let irInnerTextForLatestStatus = await element.innerText();
        let trimmedirInnerTextForLatestStatus = await irInnerTextForLatestStatus.trim();
        if (trimmedirInnerTextForLatestStatus == "Design Review Cancellation Workflow") {
          IRIsCancelled = true;
          rowForNotCancelledIr++;
        } else {
          IRIsCancelled = false;
        }
      });
    }
    // Expected result: user should be able to see the action button in the IR details page and click on cancel implementation request option.
    await test.step("Click on action button and click on Cancell Implementation reuquest option.", async () => {
      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.actionButtonInIrPage(sharedData.page));
      await windchillLocators.actionButtonInIrPage(sharedData.page).click();
      if (!dialogHandled) {
        await sharedData.page.on("dialog", async (dialog) => {
          console.log(`Dialog message: ${dialog.message()}`);
          dialogHandled = true;
          // To click "OK"
          await dialog.accept();

          // Or to click "Cancel"
          // await dialog.dismiss();
        });
      }
      await sharedData.page.waitForTimeout(5 * 1000);

      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.cancelImplementationRequestButton(sharedData.page));
      await windchillLocators.cancelImplementationRequestButton(sharedData.page).click();

      await sharedData.page.waitForTimeout(20 * 1000);
    });

    // Expected result: user should be able to find the IR in Cancellation request page in SCP Supplier user.
    await test.step("Login to Supplier view search that IR details in all tab in Cancellation Request, Ir should be Visible.", async () => {
      await helperSupplier.performLoginSupplier(newPageForSupplier);
      await helperSupplier.navigateToCancellationPage(newPageForSupplier);
      await newPageForSupplier.waitForTimeout(2 * 1000);
      let isIrExist = await helperSupplier.isIrExistInListPage(newPageForSupplier, IRNumber);
      expect(isIrExist).toBe(true);
    });

    // Expected result: user should be able to approve the cancellation request in SCP Supplier and success message should be displayed.
    await test.step("Accept Cancellation request in SCP Supplier", async () => {
      await sharedHelper.selectCheckboxForFirstRow(newPageForSupplier);

      await locators.acceptCancellationRequestButtonListPageSupplier(newPageForSupplier).click();

      await newPageForSupplier.waitForTimeout(30 * 1000);
      let successMessage = await locators.messageCancellationRequestAcceptingCancellationReqListPageSupplier(newPageForSupplier).innerText();
      expect(successMessage).toBe(dynamicValues.cancellationAcceptedSuccessMessage);
    });

    // Expected result: user should be able to see the status of the cancelled IR changed in Windchill to (Cancelled) instead of (Released for Implementation).
    await test.step("Check if the state of the cancelled IR is changed to Cancelled in the Windchilll", async () => {
      await helperWindchill.performLoginWithSteps(sharedData.page);
      await helperWindchill.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);

      // seach for the cancelled IR in windchill
      await windchillLocators.searchBarInAdvancedSearchResult(sharedData.page).click();
      await windchillLocators.searchBarInAdvancedSearchResult(sharedData.page).fill(IRNumber);

      await sharedData.page.keyboard.press("Enter");

      // check that the state is changed to cancelled
      let state = await windchillLocators.tableInAdvancedSearch(sharedData.page).nth(0).locator("td").nth(dynamicValues.numberStatusColumnAdvancedSearchTableWindchill).innerText();
      expect(state).toBe("Cancelled");
    });
  });
});

//Tested
// Required: 2 IR with status (Accepted) in Windchill that is not cancelled and can be cancelled through the enviroment user and connected to an article number in the test environment.
test.describe("Validation for IR with status (Accepted) when getting cancelled and ability for the Supplier approval", () => {
  test("Test Case #1: Validate that cancelled IR with status (Accepted) visible in Cancellation tab for purchasing user.", async ({ playwright }) => {
    let IRNumber = "";
    let IRIsCancelled = true;
    let rowForNotCancelledIr = 0;
    let row2 = 0;

    while (IRIsCancelled) {
      //Expected result: user should be able to open the IR details page in windchill for the status "Accepted" and IR number should be displayed.
      await test.step("Login to windchill and open the IR details which are in Accepted state", async () => {
        await helperWindchill.performLoginWithSteps(sharedData.page);

        await helperWindchill.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);
        await windchillLocators.stateButtonInAdvancedSearch(sharedData.page).click();
        let foundReleasedIr = false;

        while (!foundReleasedIr) {
          let state = await windchillLocators
            .tableInAdvancedSearch(sharedData.page)
            .nth(row2 + rowForNotCancelledIr)
            .locator("td")
            .nth(dynamicValues.numberStatusColumnAdvancedSearchTableWindchill)
            .innerText();
          if (state === "Accepted") {
            foundReleasedIr = true;
          } else {
            row2++;
            if (row2 + rowForNotCancelledIr > (await windchillLocators.tableInAdvancedSearch(sharedData.page).count())) {
              throw new Error("No IR found ");
            }
          }
        }

        await windchillLocators
          .tableInAdvancedSearch(sharedData.page)
          .nth(row2 + rowForNotCancelledIr)
          .locator("td")
          .nth(dynamicValues.numberInfoColumnInAdvancedSearchTableWindchill)
          .click();
        let tempIRNumber = await windchillLocators.irColumnInAdvancedSearchResultTable(sharedData.page);
        IRNumber = tempIRNumber.trim();
        expect(IRNumber).not.toBeNull();
        expect(IRNumber).not.toBe("");
      });
      await test.step("Check if the IR is allready cancelled", async () => {
        await helperWindchill.performLoginWithSteps(newPageForPurchasing);
        await windchillLocators.globalSearchBar(newPageForPurchasing).click();
        await newPageForPurchasing.waitForTimeout(0.2 * 1000);
        await windchillLocators.globalSearchBar(newPageForPurchasing).fill(IRNumber);
        await newPageForPurchasing.keyboard.press("Enter");
        await newPageForPurchasing.waitForTimeout(2 * 1000);
        let table = await windchillLocators.tableInGlobalSearch(newPageForPurchasing);
        await table.getByText(IRNumber).first().click();
        await newPageForPurchasing.waitForTimeout(2 * 1000);
        await newPageForPurchasing.locator("#infoPageinfoPanelID__infoPage_myTab_object_changeReviewProcessTab").click();
        //const element = await newPageForPurchasing.locator('.x-grid3-col-ASSIGNMENT_OBJECT').nth(1);
        const element = await newPageForPurchasing.locator(".x-grid3-col-procName ").first();
        //let te= await element.locator("label");
        let irInnerTextForLatestStatus = await element.innerText();
        let trimmedirInnerTextForLatestStatus = await irInnerTextForLatestStatus.trim();
        if (trimmedirInnerTextForLatestStatus == "Design Review Cancellation Workflow") {
          IRIsCancelled = true;
          rowForNotCancelledIr++;
        } else {
          IRIsCancelled = false;
        }
      });
    }
    // Expected result: user should be able to see the action button in the IR details page and click on cancel implementation request option.
    await test.step("Click on action button and click on Cancell Implementation reuquest option.", async () => {
      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.actionButtonInIrPage(sharedData.page));
      await windchillLocators.actionButtonInIrPage(sharedData.page).click();

      if (!dialogHandled) {
        await sharedData.page.on("dialog", async (dialog) => {
          console.log(`Dialog message: ${dialog.message()}`);

          dialogHandled = true;
          // To click "OK"
          await dialog.accept();

          // Or to click "Cancel"
          // await dialog.dismiss();
        });
      }
      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.cancelImplementationRequestButton(sharedData.page));
      await windchillLocators.cancelImplementationRequestButton(sharedData.page).click();

      await sharedData.page.waitForTimeout(120 * 1000);
    });

    // Expected result: user should be able to find the IR in Cancellation request page in SCP Purchasing user.
    await test.step("Login to purchasing view SCP search that IR details in all tab in Cancellation Request, Ir should be Visible.", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToCancellationPage(sharedData.page);
      await sharedData.page.waitForTimeout(2 * 1000);
      let isIrExist = await purchasingHelper.isIrExistInListPage(sharedData.page, IRNumber);
      expect(isIrExist).toBe(true);
    });
  });

  test("Test Case #2: Validate that cancelled IR with status (Accepted) visible in Cancellation tab for Supplier user and cab be approved and change the state of it in windchill.", async ({ playwright }) => {
    let IRNumber = "";
    let IRIsCancelled = true;
    let rowForNotCancelledIr = 0;
    let row2 = 0;

    while (IRIsCancelled) {
      // Expected result: user should be able to open the IR details page in windchill for the status "Accepted" and IR number should be displayed.
      await test.step("Login to windchill and open the IR details which are in Accepted state", async () => {
        await helperWindchill.performLoginWithSteps(sharedData.page);
        await helperWindchill.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);
        await windchillLocators.stateButtonInAdvancedSearch(sharedData.page).click();

        let foundReleasedIr = false;

        while (!foundReleasedIr) {
          let state = await windchillLocators
            .tableInAdvancedSearch(sharedData.page)
            .nth(row2 + rowForNotCancelledIr)
            .locator("td")
            .nth(dynamicValues.numberStatusColumnAdvancedSearchTableWindchill)
            .innerText();
          if (state === "Accepted") {
            foundReleasedIr = true;
          } else {
            row2++;
            if (row2 + rowForNotCancelledIr > (await windchillLocators.tableInAdvancedSearch(sharedData.page).count())) {
              throw new Error("No IR found ");
            }
          }
        }

        await windchillLocators
          .tableInAdvancedSearch(sharedData.page)
          .nth(row2 + rowForNotCancelledIr)
          .locator("td")
          .nth(dynamicValues.numberInfoColumnInAdvancedSearchTableWindchill)
          .click();
        await sharedData.page.waitForTimeout(2 * 1000);
        let tempIRNumber = await windchillLocators.irColumnInAdvancedSearchResultTable(sharedData.page);
        IRNumber = tempIRNumber.trim();
        expect(IRNumber).not.toBeNull();
        expect(IRNumber).not.toBe("");
      });
      await test.step("Check if the IR is allready cancelled", async () => {
        await helperWindchill.performLoginWithSteps(newPageForPurchasing);
        await windchillLocators.globalSearchBar(newPageForPurchasing).click();
        await newPageForPurchasing.waitForTimeout(0.2 * 1000);
        await windchillLocators.globalSearchBar(newPageForPurchasing).fill(IRNumber);
        await newPageForPurchasing.keyboard.press("Enter");
        await newPageForPurchasing.waitForTimeout(2 * 1000);
        let table = await windchillLocators.tableInGlobalSearch(newPageForPurchasing);
        await table.getByText(IRNumber).first().click();
        await newPageForPurchasing.waitForTimeout(2 * 1000);
        await newPageForPurchasing.locator("#infoPageinfoPanelID__infoPage_myTab_object_changeReviewProcessTab").click();
        //const element = await newPageForPurchasing.locator('.x-grid3-col-ASSIGNMENT_OBJECT').nth(1);
        const element = await newPageForPurchasing.locator(".x-grid3-col-procName ").first();
        //let te= await element.locator("label");
        let irInnerTextForLatestStatus = await element.innerText();
        let trimmedirInnerTextForLatestStatus = await irInnerTextForLatestStatus.trim();
        if (trimmedirInnerTextForLatestStatus == "Design Review Cancellation Workflow") {
          IRIsCancelled = true;
          rowForNotCancelledIr++;
        } else {
          IRIsCancelled = false;
        }
      });
    }
    // Expected result: user should be able to see the action button in the IR details page and click on cancel implementation request option.
    await test.step("Click on action button and click on Cancell Implementation reuquest option.", async () => {
      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.actionButtonInIrPage(sharedData.page));
      await windchillLocators.actionButtonInIrPage(sharedData.page).click();
      if (!dialogHandled) {
        await sharedData.page.on("dialog", async (dialog) => {
          console.log(`Dialog message: ${dialog.message()}`);
          dialogHandled = true;
          // To click "OK"
          await dialog.accept();

          // Or to click "Cancel"
          // await dialog.dismiss();
        });
      }
      await sharedHelper.ensureVisible(sharedData.page, windchillLocators.cancelImplementationRequestButton(sharedData.page));
      await windchillLocators.cancelImplementationRequestButton(sharedData.page).click();
      await sharedData.page.waitForTimeout(120 * 1000);
    });

    // Expected result: user should be able to find the IR in Cancellation request page in SCP Supplier user.
    await test.step("Login to Supplier view search that IR details in all tab in Cancellation Request, Ir should be Visible.", async () => {
      await helperSupplier.performLoginSupplier(newPageForSupplier);
      await helperSupplier.navigateToCancellationPage(newPageForSupplier);
      await newPageForSupplier.waitForTimeout(2 * 1000);
      let isIrExist = await helperSupplier.isIrExistInListPage(newPageForSupplier, IRNumber);
      expect(isIrExist).toBe(true);
    });

    // Expected result: user should be able to approve the cancellation request in SCP Supplier and success message should be displayed.
    await test.step("Accept Cancellation request in SCP Supplier", async () => {
      await sharedHelper.selectCheckboxForFirstRow(newPageForSupplier);

      await locators.acceptCancellationRequestButtonListPageSupplier(newPageForSupplier).click();

      await newPageForSupplier.waitForTimeout(30 * 1000);
      let successMessage = await locators.messageCancellationRequestAcceptingCancellationReqListPageSupplier(newPageForSupplier).innerText();
      expect(successMessage).toBe(dynamicValues.cancellationAcceptedSuccessMessage);
    });

    // Expected result: user should be able to see the status of the cancelled IR changed in Windchill to (Cancelled) instead of (Accepted).
    await test.step("Check if the state of the IR is changed to Cancelled in the Windchilll", async () => {
      await helperWindchill.performLoginWithSteps(sharedData.page);
      await helperWindchill.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);
      await windchillLocators.stateButtonInAdvancedSearch(sharedData.page).click();
      // seach for the cancelled IR in windchill
      await windchillLocators.searchBarInAdvancedSearchResult(sharedData.page).click();
      await windchillLocators.searchBarInAdvancedSearchResult(sharedData.page).fill(IRNumber);

      await sharedData.page.keyboard.press("Enter");

      // check that the state is changed to cancelled
      let state = await windchillLocators.tableInAdvancedSearch(sharedData.page).nth(0).locator("td").nth(dynamicValues.numberStatusColumnAdvancedSearchTableWindchill).innerText();
      expect(state).toBe("Cancelled");
    });
  });
});

