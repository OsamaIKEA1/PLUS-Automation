const { test, expect } = require("@playwright/test");
const { setupHooksWithDatabase, setupHooks, sharedData } = require("../hooks/hooks.js");
const dynamicValues = require("../dynamic-values.js");
import * as supplierHelper from "../helper-functions/helper-supplier.js";
import * as sharedHelper from "../helper-functions/shared-helpers.js";
import { locators } from "../locators/locators.js";
/**
 * 
 * To do To refactor
 * edit where the column names is used
 * Shorten the code
 * add   test.describe.configure({ retries: 1, timeout: 600000 }); in every describe
 * change to * as helper
 * use waitVisible instead of waitFor
 * Fix names of expected and test steps
 */
setupHooksWithDatabase();
let columnsNamesNewIrPage;
let columnsNamesOngoingPage;
let columnsNamesImplementedPage;
test.beforeAll(async ({ browser, playwright }) => {
  columnsNamesNewIrPage = await supplierHelper.saveColumnsNamesNewIrPage(sharedData.page);
  columnsNamesOngoingPage = await supplierHelper.saveColumnsNamesOngoingPage(sharedData.page);
  columnsNamesImplementedPage = await supplierHelper.saveColumnsNamesImplementedPage(sharedData.page);
  //let columnsNamesRevisionRequestPage = await supplierHelper.saveColumnsNamesRevisionRequestPage(sharedData.page);
  //let columnsNamesCancellationRequestPage = await supplierHelper.saveColumnsNamesCancellationPage(sharedData.page);
});

function stripTimeFromDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
// Tested
test.describe("IR Validation for Supplier User - Whether users are able to see the IR assigned for them and details of IR like (BPS, PS, ce5e45b4-46d4-419d-8c0a-7b16228528d7Timeline, connected objects, attributes)", () => {
  test.describe.configure({ retries: 1, timeout: 600000 });
  test("Test Case #1: should display correct IR details for Supplier User including BPS, PS, Timeline, connected objects, attributes", async ({ playwright }) => {
    let productDetails;
    let irDetails;

    // Expected result: user should be able to login to the Supplier View and see the landing page's title SCP
    await test.step("Login to Supplier View by using valid cred, and check if the landing page has a title SCP", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      const scpLogoTitle = await sharedData.page.locator("#root_mashupcontainer-3_ptcslabel-10").locator("#root #label").innerText();
      await expect(scpLogoTitle).toBe(dynamicValues.scpLogoTitle);
    });

    // Expected result: user should be able to select the Type
    await test.step("Check if the button is visible and select type IR", async () => {
      //await sharedHelper.ensureVisible(sharedData.page, locators.selectTypeButtonSupplier(sharedData.page));
      //await locators.selectTypeButtonSupplier(sharedData.page).click();

      await sharedHelper.ensureVisible(sharedData.page, locators.irButtonSupplier(sharedData.page));
      const irButton = await locators.irButtonSupplier(sharedData.page);
      await expect(irButton).toBeTruthy();
      await expect(irButton).toBeVisible();

      await irButton.click();
    });

    // Expected result: user should be able to select the IR Type as "Related Object" "
    await test.step("Select IR Type as Related Object", async () => {
      //await sharedHelper.ensureVisible(sharedData.page, locators.selectIrTypeMenuSupplier(sharedData.page));
      //await locators.selectIrTypeMenuSupplier(sharedData.page).click();

      await sharedHelper.ensureVisible(sharedData.page, locators.relatedObjectButtonSupplier(sharedData.page));
      const relatedObjectButton = await locators.relatedObjectButtonSupplier(sharedData.page);
      await expect(relatedObjectButton).toBeTruthy();
      await expect(relatedObjectButton).toBeVisible();
    });
    // Expected result: user should be able to select the IR Type as "Part"
    await test.step("Select IR Type as Part", async () => {
      await sharedHelper.ensureVisible(sharedData.page, locators.partButtonSupplier2(sharedData.page));
      const PartButton = await locators.partButtonSupplier2(sharedData.page);
      await expect(PartButton).toBeTruthy();
      await expect(PartButton).toBeVisible();
    });
    // Expected result: user should be able to select the IR Type as "Item"
    await test.step("Select IR Type as Item", async () => {
      await sharedHelper.ensureVisible(sharedData.page, locators.itemButtonSupplier(sharedData.page));
      const itemButton = await locators.itemButtonSupplier(sharedData.page);
      await expect(itemButton).toBeTruthy();
      await expect(itemButton).toBeVisible();
      await itemButton.click();
    });

    for (let round = 0; round < dynamicValues.numberIrToTest; round++) {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPage(sharedData.page);

      //get the element of the IR with its values from the db
      productDetails = await sharedData.productStructuresDataArraySupplierEnv[round][1];
      let IRNUMBER = await productDetails[0];
      var REQUESTEDIMPLEMENTATIONDATE = await productDetails[1];
      var BASEPRODUCTOID = await productDetails[2];
      var PACKAGINGPARTOID = await productDetails[3];
      var EFFCONTEXTOID = await productDetails[4];
      var SUPPLIERID = await productDetails[5];

      irDetails = await sharedData.irDetailsDataArraySupplierEnv[round][1];

      let visualizedPartsArray;
      let partsIDs;
      //search for the IR element
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, IRNUMBER);

      // Expected result: IR Details columns should have the same details as from Windchill.
      await test.step("Validate IR Details including (Supplier ID, Impl. request, Item Name, Item Number, Type, Received Date, Req.Impl.Date, Agr. Impl. date, Exception, Message from IKEA)", async () => {
        let columnLocator = locators.irColumnForFirstRow(sharedData.page);
        var supplierIdColumn = await columnLocator.nth(columnsNamesNewIrPage.get(dynamicValues.SupplierID));
        var implementationRequestColumn = await columnLocator.nth(columnsNamesNewIrPage.get(dynamicValues.ImplementationRequest));
        var itemNameColumn = await columnLocator.nth(columnsNamesNewIrPage.get(dynamicValues.ItemName));
        var articleNumberColumn = await columnLocator.nth(columnsNamesNewIrPage.get(dynamicValues.ArticleNumber));
        var itemTypeColumn = await columnLocator.nth(columnsNamesNewIrPage.get(dynamicValues.ItemType));
        var receivedDateColumn = await columnLocator.nth(columnsNamesNewIrPage.get(dynamicValues.ReceivedDate));
        var reqestedImplementationDateColumn = await columnLocator.nth(columnsNamesNewIrPage.get(dynamicValues.ReqestedImplementationDate));
        var agreedImplementationDateColumn = await columnLocator.nth(columnsNamesNewIrPage.get(dynamicValues.AgreedImplementationDate));
        var exceptionColumn = await columnLocator.nth(columnsNamesNewIrPage.get(dynamicValues.Exception));
        var messageFromIkeaColumn = await columnLocator.nth(columnsNamesNewIrPage.get(dynamicValues.MessageFromIkea));

        const columns = [supplierIdColumn, implementationRequestColumn, itemNameColumn, articleNumberColumn, itemTypeColumn, receivedDateColumn, reqestedImplementationDateColumn, agreedImplementationDateColumn, exceptionColumn, messageFromIkeaColumn];

        // iterate over the columns and verify if the values match the expected data
        for (let i = 0; i < columns.length; i++) {
          var column = await columns[i].first();
          if (i == columnsNamesNewIrPage.get(dynamicValues.ReqestedImplementationDate) - 1 || i == columnsNamesNewIrPage.get(dynamicValues.Exception) - 1) {
            var box = await column.locator('div[part="cell-html"]');
          } else {
            var box = await column.locator("#root #label");
          }
          var innerText = await box.innerText();
          if (innerText === "") {
            // If innerText is empty, expect data0[i] to be null or 0
            expect(irDetails[i] === null || irDetails[i] === "0").toBe(true);
          } else {
            // If innerText is not empty, it should match data0[i] exactly
            expect(innerText).toBe(irDetails[i]);
          }
        }
      });

      // Expected result: user should be able click on item name in list page
      await test.step("Click on item name in list page", async () => {});

      // Expected result: Base product structure label should be visible and exists.
      await test.step("Click on item name in list page and validate the BPS label.", async () => {
        //locate the first row => the "Item Name" column => the inner box
        var column = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.ItemName));
        var box = await column.locator("#root #label");
        await box.click();

        await sharedHelper.ensureVisible(sharedData.page, locators.baseProductStructureLabel(sharedData.page));

        await expect(locators.packagingSolutionLabel(sharedData.page)).toBeTruthy();
        await expect(locators.packagingSolutionLabel(sharedData.page)).toBeVisible();
      });

      // Expected result: Packaging solution label should be visible and exists.
      await test.step("Validate the PS label.", async () => {
        await sharedHelper.ensureVisible(sharedData.page, locators.packagingSolutionLabel(sharedData.page));

        await expect(locators.packagingSolutionLabel(sharedData.page)).toBeTruthy();
        await expect(locators.packagingSolutionLabel(sharedData.page)).toBeVisible();
      });

      // Expected result: user should be able to see the same Base Product structure details as Windchill IS
      await test.step("Valiadte Base Product Structure sub components and Packaging Solution sub components in details page with windchill structure.", async () => {
        await locators.packagingSolutionLabel(sharedData.page).click();

        let baseProductStructureLabelLocator = await locators.baseProductStructureLabel(sharedData.page);
        await baseProductStructureLabelLocator.click();

        const { partsIDsArray, visualizedParts, normalizedVisualizedPartsArray, normalizedPartNamefromApi, normalizedcomponentsNameFromApi } = await supplierHelper.getVisualizedAndFetchedItemStructure(sharedData.page, baseProductStructureLabelLocator, REQUESTEDIMPLEMENTATIONDATE, BASEPRODUCTOID, EFFCONTEXTOID, sharedData.apiRequestContext, sharedData.csrfToken);

        partsIDs = await partsIDsArray;
        visualizedPartsArray = await visualizedParts;

        // Step 4: Validate the structure
        expect(normalizedVisualizedPartsArray).toContain(normalizedPartNamefromApi); // Check that the main Part is in the partsArray

        normalizedcomponentsNameFromApi.forEach((componentName) => {
          expect(normalizedVisualizedPartsArray).toContain(componentName); // Check that all component names are in the partsArray
        });
      });

      //Expected result: User should be able to see the same classification attribute details mentioned in windchill object
      await test.step("Validate Classification and General attribute details with Windchill object general attributes", async () => {
        for (let i = 0; i < visualizedPartsArray.length; i++) {
          const { sortedFetchedClassificationAttributesMap, sortedvisualizedClassificationAttributesMap } = await supplierHelper.getVisualizedAndFetchedClassificationAttributes(sharedData.page, sharedData.apiRequestContext, i, partsIDs);
          // Compare if the sorted arrays match
          expect(sortedFetchedClassificationAttributesMap).toEqual(sortedvisualizedClassificationAttributesMap);
        }
      });

      // Expected result: user should be able to see the same connected objects details as Windchill IS
      await test.step("Base Product Structure component's connected objects same as in windchill", async () => {
        const { FetchedConnectedObjectsDetailsMap, visualizedConnectedObjectsDetailsMap } = await supplierHelper.getVisualizedAndFetchedConnectedObjects(sharedData.page, sharedData.apiRequestContext, visualizedPartsArray, partsIDs, EFFCONTEXTOID, REQUESTEDIMPLEMENTATIONDATE, SUPPLIERID);
        // Compare maps
        for (const [key, value1] of FetchedConnectedObjectsDetailsMap.entries()) {
          const value2 = await visualizedConnectedObjectsDetailsMap.get(key);
          expect(value2).toBeDefined(); // Ensure the key exists in map2
          expect(sharedHelper.areArraysEqualUnordered(value1, value2)).toBeTruthy(); // Ensure arrays are equivalent
        }
      });

      // Expected result: user should be able to see the same packagin solution structure details as Windchill IS
      await test.step("Packaging Solution sub components in details page with windchill structure", async () => {
        let packagingSolutionLabelLocator = await locators.packagingSolutionLabel(sharedData.page);

        const { partsIDsArray, visualizedParts, normalizedVisualizedPartsArray, normalizedPartNamefromApi, normalizedcomponentsNameFromApi } = await supplierHelper.getVisualizedAndFetchedItemStructure(sharedData.page, packagingSolutionLabelLocator, REQUESTEDIMPLEMENTATIONDATE, PACKAGINGPARTOID, EFFCONTEXTOID, sharedData.apiRequestContext, sharedData.csrfToken);

        partsIDs = await partsIDsArray;
        visualizedPartsArray = await visualizedParts;
        // Step 4: Validate the structure
        expect(normalizedVisualizedPartsArray).toContain(normalizedPartNamefromApi); // Check that the main Part is in the partsArray

        normalizedcomponentsNameFromApi.forEach((componentName) => {
          expect(normalizedVisualizedPartsArray).toContain(componentName); // Check that all component names are in the partsArray
        });
      });
    }
  });
});

// Tested
// Required: 4 IR in New IR page in Supplier user after releasing them from New IR page in purchasing user (will be removed and moved to ongoing supplier/purchasing)
test.describe("Accept the single or multiple IR by selecting IR details from list page or Details page - Without Providing Agreed Impl Date", () => {
  test.describe.configure({ retries: 1, timeout: 600000 });
  // Required: 1 IR in New IR page in Supplier user after releasing them from New IR page in purchasing user
  test("Test Case #1: user should be able to successfully accept the single IR by accepting IR from details page- Without Providing Agreed Impl Date", async ({ playwright }) => {
    let innerTextIRNumberToAccept;

    // expected result: user should be able to see the success msg.
    await test.step("Accept a singel IR in details page and validate the success message", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPage(sharedData.page);

      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);

      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      innerTextIRNumberToAccept = await boxIR.innerText();

      var columnItemName = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.ItemName));
      var box = await columnItemName.locator("#root #label");
      await box.click();

      await sharedData.page.evaluate(() => {
        const btn = document.querySelector("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsbutton-532-bounding-box"); // <- Replace with your actual CSS selector
        if (btn) {
          btn.style.display = "block";
          btn.style.visibility = "visible";
          btn.style.opacity = "1";
        }
      });

      await sharedHelper.ensureVisible(sharedData.page, locators.acceptButtonDetailsPage(sharedData.page));
      await locators.acceptButtonDetailsPage(sharedData.page).click();

      await sharedHelper.ensureVisible(sharedData.page, locators.acceptButtonInsideAcceptWindowDetailsPage(sharedData.page));
      await locators.acceptButtonInsideAcceptWindowDetailsPage(sharedData.page).click();

      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.acceptSuccessMessage(sharedData.page).innerText();
      await expect(successMessage).toMatch(dynamicValues.acceptOneSuccessMessage);
    });
    // Expected result: user should not be able to see the accepted IR in New IR page.
    await test.step("Navigate to list page of New IR page and search for the accepted IR and validate that the IR item is removed", async () => {
      await sharedData.page.waitForTimeout(120 * 1000);
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPage(sharedData.page);
      //await locators.backButtonInDetailsPageSupplierEnv(sharedData.page).click();
      //await sharedHelper.ensureVisible(sharedData.page, locators.newIrButton(sharedData.page));

      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, innerTextIRNumberToAccept);
      await expect(isIrExist).toBe(false);
    });

    // Expected result: user should be able to see the accepted IR is moved to Ongoing page.
    await test.step("Navigate to Ongoing page, search for the accepted IR and validate that the IR item is moved to Ongoing page", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);
      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, innerTextIRNumberToAccept);
      await expect(isIrExist).toBe(true);
    });

    // Expected result: user should be able to see the Agreed date same as request date.
    await test.step("Validate in the Ongoing page that the accepted IR item's agreed date same as request date", async () => {
      let columnLocator = locators.irColumnForFirstRow(sharedData.page);

      var reqestedImplementationDateColumn = await columnLocator.nth(columnsNamesOngoingPage.get(dynamicValues.ReqestedImplementationDate));
      var innerTextReqestedImplementationDate = await reqestedImplementationDateColumn.innerText();

      var agreedImplementationDateColumn = await columnLocator.nth(columnsNamesOngoingPage.get(dynamicValues.AgreedImplementationDate));
      var innerTextAgreedImplementationDate = await agreedImplementationDateColumn.innerText();

      expect(innerTextReqestedImplementationDate).toBe(innerTextAgreedImplementationDate);
    });
  });
  // Required: two IR in New IR page in Supplier user after releasing them from New IR page in purchasing user
  test("Test Case #2: user should be able to successfully accept multiple IRs by accepting IRs from list page- Without Providing Agreed Impl Date", async ({ playwright }) => {
    let IRsToAccept = [];

    // Expected result: accept button should be enabled.
    await test.step("Navigate to New IR page list page and select first two IRs and validate that the Accept button is enabled", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPage(sharedData.page);

      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);

      await sharedHelper.selectCheckboxForFirstRow(sharedData.page);
      var columnIRFirstRow = await locators.irColumn(sharedData.page, 0).nth(columnsNamesNewIrPage.get(dynamicValues.ImplementationRequest));
      var boxIRFirstRow = await columnIRFirstRow.locator("#root #label");
      let innerTextIRNumberToAcceptFirstRow = await boxIRFirstRow.innerText();
      IRsToAccept.push(innerTextIRNumberToAcceptFirstRow);

      await sharedHelper.clickCheckboxForRow(sharedData.page, 1);
      var columnIRSecondRow = await locators.irColumn(sharedData.page, 1).nth(columnsNamesNewIrPage.get(dynamicValues.ImplementationRequest));
      var boxIRSecondRow = await columnIRSecondRow.locator("#root #label");
      let innerTextIRNumberToAcceptSecondRow = await boxIRSecondRow.innerText();
      IRsToAccept.push(innerTextIRNumberToAcceptSecondRow);

      await sharedHelper.ensureVisible(sharedData.page, locators.acceptButtonListPage(sharedData.page));
      const isEnabled = await locators.acceptButtonListPage(sharedData.page).isEnabled();
      await expect(isEnabled).toBe(true);
    });

    // Expected result: user should be able to see the success msg.
    await test.step("Accept the selected IRs and validate the success message", async () => {
      await locators.acceptButtonListPage(sharedData.page).click();
      await sharedHelper.ensureVisible(sharedData.page, locators.acceptButtonInsideAcceptWindowListPage(sharedData.page));
      await locators.acceptButtonInsideAcceptWindowListPage(sharedData.page).click();

      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.acceptSuccessMessage(sharedData.page).innerText();
      await expect(successMessage).toMatch(dynamicValues.acceptTwoSuccessMessage);
    });

    // Expected result: user should not be able to see the accepted IRs in New IR page.
    await test.step("Validate that the IRs item is removed from the list of New IRs", async () => {
      await sharedData.page.waitForTimeout(60 * 1000);
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPage(sharedData.page);
      for (let i = 0; i < IRsToAccept.length; i++) {
        let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, IRsToAccept[i]);
        await expect(isIrExist).toBe(false);
      }
    });

    for (let i = 0; i < IRsToAccept.length; i++) {
      await supplierHelper.performLoginSupplier(sharedData.page);

      await supplierHelper.navigateToOngoingPage(sharedData.page);

      // Expected result: user should be able to see the accepted IRs is moved to Ongoing page.
      await test.step("Validate that the IR item is moved to Ongoing page", async () => {
        let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, IRsToAccept[i]);
        await expect(isIrExist).toBe(true);
      });

      // Expected result: user should be able to see the Agreed date same as request date for the accepted IRs.
      await test.step("Validate that the IR item's agreed date same as request date", async () => {
        let columnLocator = locators.irColumnForFirstRow(sharedData.page);

        var reqestedImplementationDateColumn = await columnLocator.nth(columnsNamesOngoingPage.get(dynamicValues.ReqestedImplementationDate));
        var innerTextReqestedImplementationDate = await reqestedImplementationDateColumn.innerText();

        var agreedImplementationDateColumn = await columnLocator.nth(columnsNamesOngoingPage.get(dynamicValues.AgreedImplementationDate));
        var innerTextAgreedImplementationDate = await agreedImplementationDateColumn.innerText();

        expect(innerTextReqestedImplementationDate).toBe(innerTextAgreedImplementationDate);
      });
    }
  });
  // Required: 1 IR in New IR page in Supplier user after releasing them from New IR page in purchasing user
  test("Test Case #3: user should be able to successfully accept single IR by accepting IRs from list page- Without Providing Agreed Impl Date", async ({ playwright }) => {
    let innerTextIRNumberToAccept;
    // Expected result: accept button should be enabled.
    await test.step("Navigate to New IR page list page and select first IR and validate that the Accept button is enabled", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPage(sharedData.page);

      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);
      await sharedHelper.selectCheckboxForFirstRow(sharedData.page);
      var columnIRFirstRow = await locators.irColumn(sharedData.page, 0).nth(columnsNamesNewIrPage.get(dynamicValues.ImplementationRequest));
      var boxIRFirstRow = await columnIRFirstRow.locator("#root #label");
      innerTextIRNumberToAccept = await boxIRFirstRow.innerText();

      await locators.acceptButtonListPage(sharedData.page).waitFor({ state: "visible" });
      const isEnabled = await locators.acceptButtonListPage(sharedData.page).isEnabled();
      await expect(isEnabled).toBe(true);
    });

    // Expected result: user should be able to see the success msg.
    await test.step("Accept single IRs in list page and validate the success message", async () => {
      await locators.acceptButtonListPage(sharedData.page).click();

      await sharedHelper.ensureVisible(sharedData.page, locators.acceptButtonInsideAcceptWindowListPage(sharedData.page));
      await locators.acceptButtonInsideAcceptWindowListPage(sharedData.page).click();

      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.acceptSuccessMessage(sharedData.page).innerText();
      await expect(successMessage).toMatch(dynamicValues.acceptOneSuccessMessage);
    });

    // Expected result: user should not be able to see the accepted IR in New IR page.
    await test.step("Validate that the IRs item is removed from the list of New IRs", async () => {
      await sharedData.page.waitForTimeout(60 * 1000);
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPage(sharedData.page);
      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, innerTextIRNumberToAccept);
      await expect(isIrExist).toBe(false);
    });

    // Expected result: user should be able to see the accepted IR is moved to Ongoing page.
    await test.step("Validate that the IR item is moved to Ongoing page", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);
      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, innerTextIRNumberToAccept);
      await expect(isIrExist).toBe(true);
    });

    // Expected result: user should be able to see the Agreed date same as request date for the accepted IR.
    await test.step("Validate that the IR item's agreed date same as request date", async () => {
      let columnLocator = locators.irColumnForFirstRow(sharedData.page);

      var reqestedImplementationDateColumn = await columnLocator.nth(columnsNamesOngoingPage.get(dynamicValues.ReqestedImplementationDate));
      var innerTextReqestedImplementationDate = await reqestedImplementationDateColumn.innerText();

      var agreedImplementationDateColumn = await columnLocator.nth(columnsNamesOngoingPage.get(dynamicValues.AgreedImplementationDate));
      var innerTextAgreedImplementationDate = await agreedImplementationDateColumn.innerText();

      expect(innerTextReqestedImplementationDate).toBe(innerTextAgreedImplementationDate);
    });
  });
});

// Tested
// Required: 1 IR in New IR page in Supplier user after releasing them from New IR page in purchasing user (will be removed and moved to ongoing supplier/purchasing)
test.describe("Validate user is able to provide Agreed Impl Date between Received Date and Req. Impl Date ", () => {
  test.describe.configure({ retries: 1, timeout: 600000 });

  // Required: 1 IR in New IR page in Supplier user after releasing them from New IR page in purchasing user
  test("Test Case #1: Validate error message when choosing Agreed implemented date prior to Received Date.", async ({ playwright }) => {
    // Expected: user should be able to see the error message when choosing Agreed implemented date prior to Received Date.
    await test.step("Navigate to New IR page and validate the error message after filling the Agreed date for the first found IR with a date prior to Received Date", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPage(sharedData.page);

      var columnReceivedDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.ReceivedDate));
      var boxReceivedDate = await columnReceivedDate.locator("#root #label");
      let innerTextReceivedDate = await boxReceivedDate.innerText();

      // Convert received date to Date object and subtract one day
      let receivedDate = new Date(innerTextReceivedDate);
      receivedDate.setDate(receivedDate.getDate() - 1);
      let priorDate = receivedDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

      var columnAgreedDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.AgreedImplementationDate));
      const calendarButton = await columnAgreedDate.locator("ptcs-icon");
      await calendarButton.locator("img").click();

      //await sharedHelper.ensureVisible(sharedData.page, locators.dateFieldNewIrListPage(sharedData.page));
      await locators.dateFieldNewIrListPage(sharedData.page).fill(priorDate);
      await locators.dateFieldNewIrListPage(sharedData.page).press("Enter");

      await sharedData.page.waitForTimeout(5 * 1000);
      const errorMessage = await locators.messageNewIrSupplierList(sharedData.page).innerText();
      await expect(errorMessage).toMatch(dynamicValues.errorMessage);
    });
  });
  // Required: 1 IR in New IR page in Supplier user after releasing them from New IR page in purchasing user
  test("Test Case #2: Validate error message when choosing Agreed implemented date after Requested Date.", async ({ playwright }) => {
    // Expected: user should be able to see the error message when choosing Agreed implemented date after Requested Date.
    await test.step("Navigate to New IR page Validate the error message after filling the Agreed date for the first found IR with a date after Requested Date", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPage(sharedData.page);

      var columnRequestedDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.ReqestedImplementationDate));
      let innerTextRequestedDate = await columnRequestedDate.innerText();

      // Convert received date to Date object and subtract one day
      let requestedDate = new Date(innerTextRequestedDate);
      requestedDate.setDate(requestedDate.getDate() + 1);
      let priorDate = requestedDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

      var columnAgreedDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.AgreedImplementationDate));
      const calendarButton = await columnAgreedDate.locator("ptcs-icon");
      await calendarButton.locator("img").click();

      //await sharedHelper.ensureVisible(sharedData.page, locators.dateFieldNewIrListPage(sharedData.page));
      await locators.dateFieldNewIrListPage(sharedData.page).fill(priorDate);
      await locators.dateFieldNewIrListPage(sharedData.page).press("Enter");

      await sharedData.page.waitForTimeout(5 * 1000);
      const errorMessage = await locators.messageNewIrSupplierList(sharedData.page).innerText();
      await expect(errorMessage).toMatch(dynamicValues.errorMessage);
    });
  });

  // Important!! The test case should be excuted when all the IRs in the list have requested date after the received date
  // Required: 1 IR in New IR page in Supplier user after releasing them from New IR page in purchasing user
  test("Test Case #3:Accept IR and validate success message when choosing Agreed implemented between Requested Date and Recived Date.", async ({ playwright }) => {
    let innerTextIRNumberToAccept;

    // Expected: user should be able to see the success message when choosing Agreed implemented date between Requested Date and Recived Date.
    await test.step("Navigate to New IR page and validate the success message after filling the Agreed date for the first found IR with a date between Requested Date and Recived Date.", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPage(sharedData.page);

      var columnIRFirstRow = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.ImplementationRequest));
      var boxIRFirstRow = await columnIRFirstRow.locator("#root #label");
      innerTextIRNumberToAccept = await boxIRFirstRow.innerText();

      var columnReceivedDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.ReceivedDate));
      var boxReceivedDate = await columnReceivedDate.locator("#root #label");
      let innerTextReceivedDate = await boxReceivedDate.innerText();

      // Convert received date to Date object and subtract one day
      let receivedDate = await new Date(innerTextReceivedDate);

      var columnRequestedDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.ReqestedImplementationDate));
      let innerTextRequestedDate = await columnRequestedDate.innerText();

      // Convert received date to Date object and subtract one day
      let requestedDate = await new Date(innerTextRequestedDate);

      // Calculate a date between requested date and received date
      let agreedDate = await new Date((requestedDate.getTime() + receivedDate.getTime()) / 2);
      let agreedDateString = await agreedDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

      var columnAgreedDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.AgreedImplementationDate));
      const calendarButton = await columnAgreedDate.locator("ptcs-icon");
      await calendarButton.locator("img").click();

      //await sharedHelper.ensureVisible(sharedData.page, locators.dateFieldNewIrListPage(sharedData.page));
      await locators.dateFieldNewIrListPage(sharedData.page).fill(agreedDateString);
      await locators.dateFieldNewIrListPage(sharedData.page).press("Enter");

      await sharedHelper.ensureVisible(sharedData.page, locators.commentFieldAcceptListPage(sharedData.page));

      // Write a comment
      await locators.commentFieldAcceptListPage(sharedData.page).fill("Test comment");

      await sharedHelper.ensureVisible(sharedData.page, locators.acceptButtonInsideAcceptWindowListPage(sharedData.page));
      await locators.acceptButtonInsideAcceptWindowListPage(sharedData.page).click();

      await sharedHelper.ensureVisible(sharedData.page, locators.messageNewIrSupplierList(sharedData.page));
      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.messageNewIrSupplierList(sharedData.page).innerText();
      await expect(successMessage).toMatch(dynamicValues.irAcceptedSuccessMessage);
    });

    // Expected result: user should not be able to see the accepted IR in New IR page.
    await test.step("Validate that the Ir is removed from the NewIR list", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToNewIrPage(sharedData.page);
      let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, innerTextIRNumberToAccept);
      expect(isIrExist).toBe(false);
    });
  });
});

//Tested
// Required: 0 or more IR in in ongoing tab in each(All, 4 Weeks left, Overdue) (Will nor be removed)
test.describe("Validate in Supplier that user should able to see the IR in 3 categories based on Agreed Impl Date in ongoing tab(All, 4 Weeks left, Overdue)", () => {
  test.describe.configure({ retries: 1, timeout: 600000 });
  // Required: 0 or more IR in in ongoing tab in each(All, 4 Weeks left, Overdue)
  test("Test case #1: Validate that in Supplier, user should able to see the IR in 3 categories based on Agreed Impl Date in Ongoing page(All, 4 Weeks left, Overdue)", async ({ playwright }) => {
    let elemntsToCheckInAllFilter = [];

    // Expected result: user should be able to see the IR in Overdue category with overdue agreed date.
    await test.step("Validate Overdue IRs (up to three IRs)", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);
      await sharedHelper.ensureVisible(sharedData.page, locators.overDueButtonSupplier(sharedData.page));
      await locators.overDueButtonSupplier(sharedData.page).click();
      let numberOfIr = await sharedHelper.getNumberOfItems(sharedData.page);

      if (numberOfIr != 0) {
        //await sharedHelper.ensureVisible(sharedData.page, locators.irRows(sharedData.page));
        let numberOfRows = await locators.irRows(sharedData.page).count();
        let numberOfIteration;
        if (numberOfRows != 0) {
          if (numberOfRows == 1 || numberOfRows == 2) {
            numberOfIteration = numberOfRows;
          } else {
            numberOfIteration = 3;
          }

          for (let i = 0; i < numberOfIteration; i++) {
            let columnLocator = await locators.irColumn(sharedData.page, i);
            var Ir = await columnLocator.nth(columnsNamesOngoingPage.get(dynamicValues.ImplementationRequest));
            var boxIR = await Ir.locator("#root #label");
            var innerTextIr = await boxIR.innerText();

            var agreedImplementationDateColumn = await columnLocator.nth(columnsNamesOngoingPage.get(dynamicValues.AgreedImplementationDate));
            var innerTextAgreedImplementationDate = await agreedImplementationDateColumn.innerText();

            const givenDate = await new Date(innerTextAgreedImplementationDate);
            const today = new Date();
            await expect(givenDate < today).toBeTruthy();
            await elemntsToCheckInAllFilter.push(innerTextIr);
          }
        }
      }
    });

    // Expected result: user should be able to see the IR 4 Weeks Left category with agreed date between today and 4 weeks.
    await test.step("Validate 4 Weeks Left IRs (up to three IRs)", async () => {
      await sharedHelper.ensureVisible(sharedData.page, locators.fourWeeksLeftButtonSupplier(sharedData.page));
      await locators.fourWeeksLeftButtonSupplier(sharedData.page).click();
      let numberOfIr = await sharedHelper.getNumberOfItems(sharedData.page);

      if (numberOfIr != 0) {
        //await sharedHelper.ensureVisible(sharedData.page, locators.irRows(sharedData.page));
        let numberOfRows = await locators.irRows(sharedData.page).count();
        let numberOfIteration;
        if (numberOfRows != 0) {
          if (numberOfRows == 1 || numberOfRows == 2) {
            numberOfIteration = numberOfRows;
          } else {
            numberOfIteration = 3;
          }

          for (let i = 0; i < numberOfIteration; i++) {
            let columnLocator = await locators.irColumn(sharedData.page, i);

            var Ir = await columnLocator.nth(columnsNamesOngoingPage.get(dynamicValues.ImplementationRequest));
            var boxIR = await Ir.locator("#root #label");
            var innerTextIr = await boxIR.innerText();

            var agreedImplementationDateColumn = await columnLocator.nth(columnsNamesOngoingPage.get(dynamicValues.AgreedImplementationDate));
            //var boxAgreedImplementationDate = await agreedImplementationDateColumn.locator("#root #label");
            var innerTextAgreedImplementationDate = await agreedImplementationDateColumn.innerText();

            const givenDate = stripTimeFromDate(new Date(innerTextAgreedImplementationDate));
            const today = stripTimeFromDate(new Date());

            // Calculate 28 (4 weeks) days from today
            const thirtyDaysLater = new Date();
            thirtyDaysLater.setDate(today.getDate() + 28);

            // Validate that the given date is within the next 28 days

            await expect(givenDate >= today && givenDate <= thirtyDaysLater).toBeTruthy();

            await elemntsToCheckInAllFilter.push(innerTextIr);
          }
        }
      }
    });

    // Expected result: user should be able to see the IR in All category with overdue and 4 weeks left agreed date.
    await test.step("Validate All IRs (all checked IRs in Overdue and 4 Weeks Left tabs)", async () => {
      await sharedHelper.ensureVisible(sharedData.page, locators.allButtonSupplier(sharedData.page));
      await locators.allButtonSupplier(sharedData.page).click();
      await sharedData.page.waitForLoadState("load");

      let numberOfIr = await sharedHelper.getNumberOfItems(sharedData.page);

      if (numberOfIr != 0) {
        for (let i = 0; i < elemntsToCheckInAllFilter.length; i++) {
          let IRNUMBER = elemntsToCheckInAllFilter[i]; // Get the current IR number
          let isIrExist = await supplierHelper.isIrExistInListPage(sharedData.page, IRNUMBER);
          await expect(isIrExist).toBe(true);
        }
      }
    });
  });
});

//Tested
// Required: 2 IR in in ongoing tab in Supplier user (will be removed and moved to implemented supplier/purchasing)
test.describe("Implement the IR by providing Actual Impl.Date for single or multiple IRs in Ongoing page by selecting IR details from list or details page and validate Implemented IR details in Implemented Tab", () => {
  test.describe.configure({ retries: 1, timeout: 600000 });

  // Required: 1  IR in in ongoing tab 
  test("Test Case #1: Implement a singel IR in details page by providing Actual Impl.Date prior to received date", async ({ playwright }) => {
    let innerTextIRNumberToImplement;

    // Expected result: user should be able to see the error message when choosing Actual Impl.Date prior to Received Date.
    await test.step("User should not be able Implement a singel IR in details page by providing Actual Impl.Date prior to received date ", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);

      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPage.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      innerTextIRNumberToImplement = await boxIR.innerText();

      var columnReceivedDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPage.get(dynamicValues.ReceivedDate));
      var boxReceivedDate = await columnReceivedDate.locator("#root #label");
      let innerTextReceivedDate = await boxReceivedDate.innerText();

      // Convert received date to Date object and subtract one day
      let receivedDate = new Date(innerTextReceivedDate);

      // Get the year and month of the received date
      let year = receivedDate.getFullYear();
      let month = receivedDate.getMonth(); // Month is zero-indexed (0 = January, 1 = February, ...)

      // Set the received date to the same month but in the previous year
      receivedDate.setFullYear(year - 1); // Subtract 1 from the year to get the previous year

      // Format the prior date as 'YYYY-MM-DD'
      let priorDate = receivedDate.toISOString().split("T")[0];

      // Extract the year and month from the priorDate
      let priorYear = priorDate.split("-")[0]; // Extracts the year part
      let priorMonthNumber = parseInt(priorDate.split("-")[1]); // Extracts the month part as a number

      // Array of month names with capitalized first letter
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      // Get the month name by index (monthNumber - 1 to adjust for zero-based index)
      let priorMonth = monthNames[priorMonthNumber - 1]; // Adjust for the month being 1-indexed

      var columnItemName = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.ItemName));
      var box = await columnItemName.locator("#root #label");
      await box.click();

      //await sharedHelper.ensureVisible(sharedData.page, locators.actualImplementationDateDetailsPage(sharedData.page));
      await locators.actualImplementationDateDetailsPage(sharedData.page).click();
      await locators.dateFieldActualDateDetailsPageMonth(sharedData.page).click();
      await locators.dateFieldActualDateDetailsPageMonth(sharedData.page).type(priorMonth);
      await locators.dateFieldActualDateDetailsPageYear(sharedData.page).click();
      await locators.dateFieldActualDateDetailsPageYear(sharedData.page).type(priorYear);
      await locators.dayActaulDateDetailsPage(sharedData.page).hover();
      await locators.dayActaulDateDetailsPage(sharedData.page).click();
      await sharedData.page.keyboard.press("Enter");

      await sharedData.page.waitForTimeout(5 * 1000);
      const errorMessage = await locators.errorMessageOngoingInvalidActualDateDetailsPageSupplier(sharedData.page).innerText();
      await expect(errorMessage).toMatch(dynamicValues.errorMessage);
    });
  });
  // Required: 1  IR in in ongoing tab
  test("Test Case #2: Implement a single IR in details page by providing Actual Impl.Date beyond current date ", async ({ playwright }) => {
    let innerTextIRNumberToImplement;

    //Expected result: user should be able to see the error message when choosing Actual Impl.Date beyond current date.
    await test.step("User should not be able to implement a single IR in details page by providing Actual Impl.Date beyond current date ", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);

      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPage.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      innerTextIRNumberToImplement = await boxIR.innerText();

      // Get the current date and set a future date (beyond current date)
      let currentDate = new Date();
      currentDate.setFullYear(currentDate.getFullYear() + 1); // Set the future date (tomorrow)

      // Format the future date as 'YYYY-MM-DD'
      let futureDate = currentDate.toISOString().split("T")[0];

      // Extract the year and month from the future date
      let futureYear = futureDate.split("-")[0]; // Extracts the year part
      let futureMonthNumber = parseInt(futureDate.split("-")[1]); // Extracts the month part as a number

      // Array of month names with capitalized first letter
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      // Get the month name by index (monthNumber - 1 to adjust for zero-based index)
      let futureMonth = monthNames[futureMonthNumber - 1]; // Adjust for the month being 1-indexed

      // Start testing with the future date
      var columnItemName = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPage.get(dynamicValues.ItemName));
      var box = await columnItemName.locator("#root #label");
      await box.click();

      await sharedHelper.ensureVisible(sharedData.page, locators.actualImplementationDateDetailsPage(sharedData.page));
      await locators.actualImplementationDateDetailsPage(sharedData.page).click();
      await locators.dateFieldActualDateDetailsPageMonth(sharedData.page).click();
      await locators.dateFieldActualDateDetailsPageMonth(sharedData.page).type(futureMonth);
      await locators.dateFieldActualDateDetailsPageYear(sharedData.page).click();
      await locators.dateFieldActualDateDetailsPageYear(sharedData.page).type(futureYear);
      await locators.dayActaulDateDetailsPage(sharedData.page).hover();
      await locators.dayActaulDateDetailsPage(sharedData.page).click();
      await sharedData.page.keyboard.press("Enter");
      await sharedData.page.waitForTimeout(5 * 1000);

      // Validate the error message for selecting a future date
      const errorMessage = await locators.errorMessageOngoingInvalidActualDateDetailsPageSupplier(sharedData.page).innerText();
      await expect(errorMessage).toMatch(dynamicValues.errorMessage); // Assert that the error message is shown
    });
  });
  // Required: 1  IR in in ongoing tab
  test("Test Case #3: Implement a single IR in details page by providing Actual Impl.Date between the Received and current date and validate the Actual date in Implemented page for the implemented IR.", async ({ playwright }) => {
    let innerTextIRNumberToImplement;
    let actualDate; // Declare the actualDate variable to store the final date entered

    // Expected result: user should be able see the success message.
    await test.step("Implement a single IR in details page by providing Actual Impl.Date between the Received and current date.", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);

      var columnIR = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPage.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      innerTextIRNumberToImplement = await boxIR.innerText();

      var columnReceivedDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPage.get(dynamicValues.ReceivedDate));
      var boxReceivedDate = await columnReceivedDate.locator("#root #label");
      let innerTextReceivedDate = await boxReceivedDate.innerText();

      // Convert received date to Date object
      let receivedDate = new Date(innerTextReceivedDate);

      // Get the current date
      let currentDate = new Date();

      // Ensure the received date is earlier than the current date, if not swap the dates.
      if (receivedDate > currentDate) {
        [receivedDate, currentDate] = [currentDate, receivedDate]; // Swap if receivedDate is after currentDate
      }

      // Generate a random date between the received date and current date
      let randomDate = new Date(receivedDate.getTime() + Math.random() * (currentDate.getTime() - receivedDate.getTime()));

      // Format the random date as 'YYYY-MM-DD'
      let randomDateString = randomDate.toISOString().split("T")[0];

      // Store the formatted random date as actualDate
      actualDate = randomDateString;

      // Extract the year, month, and day from the random date
      let randomYear = randomDateString.split("-")[0]; // Extracts the year part
      let randomMonthNumber = parseInt(randomDateString.split("-")[1]); // Extracts the month part as a number
      let randomDay = randomDateString.split("-")[2]; // Extracts the day part

      // Array of month names with capitalized first letter
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      // Get the month name by index (monthNumber - 1 to adjust for zero-based index)
      let randomMonth = monthNames[randomMonthNumber - 1]; // Adjust for the month being 1-indexed

      // Start testing with the random date between the received date and current date
      var columnItemName = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPage.get(dynamicValues.ItemName));
      var box = await columnItemName.locator("#root #label");
      await box.click();

      await sharedHelper.ensureVisible(sharedData.page, locators.actualImplementationDateDetailsPage(sharedData.page));
      await locators.actualImplementationDateDetailsPage(sharedData.page).click();

      // Select the month, year, and day from the random date
      await locators.dateFieldActualDateDetailsPageMonth(sharedData.page).click();
      await locators.dateFieldActualDateDetailsPageMonth(sharedData.page).type(randomMonth);
      await locators.dateFieldActualDateDetailsPageYear(sharedData.page).click();
      await locators.dateFieldActualDateDetailsPageYear(sharedData.page).type(randomYear);
      randomDay= randomDay.startsWith("0") ? randomDay.substring(1) : randomDay;

      await sharedData.page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsdatepicker-594-external-wc #days").getByText(randomDay, { exact: true }).hover();
      await sharedData.page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsdatepicker-594-external-wc #days").getByText(randomDay, { exact: true }).click();
      await sharedData.page.keyboard.press("Enter");
      await locators.continueButtonActaulDateDetailsPage(sharedData.page).click();
      await locators.continueButtonImplementationVerficationDetailsPage(sharedData.page).click();
      await sharedData.page.waitForTimeout(30 * 1000);

      // Validate the success message or proceed with further steps
      const successMessage = await locators.messageOngoingInvalidActualDateDetailsPageSupplier(sharedData.page).innerText();
      await expect(successMessage).toMatch(dynamicValues.implementedSuccessMessage);
    });

    // Expected result: Visualized Actual date on implemented page should be the same as the Actual date the IR is implemented with at the previous step.
    await test.step("Navigate to Implemented page and validate the Actual date", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToImplementedPage(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, innerTextIRNumberToImplement);

      let columnLocator = await locators.irColumnForFirstRow(sharedData.page);
      var columnActualDate = await columnLocator.nth(columnsNamesImplementedPage.get(dynamicValues.ActualImplementationDate));
      var boxActualDate = await columnActualDate.locator("#root #label");
      let visualizedInnerTextActualDate = await boxActualDate.innerText();
      await expect(visualizedInnerTextActualDate).toBe(actualDate);
    });
  });

  // Required: 1 IR in in ongoing tab
  test("Test Case #4: Implement single IR From IRs list by providing Actual Impl.Date prior to received date", async ({ playwright }) => {
    let innerTextIRNumberToAccept;

    // Expected result: user should be able to see the error message when choosing Actual Impl.Date prior to Received Date.
    await test.step("User should not be able Implement IR in List page by providing Actual Impl.Date prior to received date ", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);

      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);

      await sharedHelper.selectCheckboxForFirstRow(sharedData.page);

      var columnIRFirstRow = await locators.irColumn(sharedData.page, 0).nth(columnsNamesOngoingPage.get(dynamicValues.ImplementationRequest));
      var boxIRFirstRow = await columnIRFirstRow.locator("#root #label");
      innerTextIRNumberToAccept = await boxIRFirstRow.innerText();

      var columnReceivedDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPage.get(dynamicValues.ReceivedDate));
      var boxReceivedDate = await columnReceivedDate.locator("#root #label");
      let innerTextReceivedDate = await boxReceivedDate.innerText();

      // Convert received date to Date object and subtract one day
      let receivedDate = new Date(innerTextReceivedDate);
      receivedDate.setDate(receivedDate.getDate() - 1);
      let priorDate = receivedDate.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

      var columnActualDate = await locators.irColumnForFirstRow(sharedData.page).nth(9);
      const calendarButton = await columnActualDate.locator("ptcs-icon");
      await calendarButton.locator("img").click();

      //await sharedHelper.ensureVisible(sharedData.page, locators.dateFieldNewIrListPage(sharedData.page));
      await locators.dateFieldNewIrListPage2(sharedData.page).fill(priorDate);
      await locators.dateFieldNewIrListPage2(sharedData.page).press("Enter");

      await sharedData.page.waitForTimeout(5 * 1000);
      const errorMessage = await locators.messageOngoingInvalidActualDateListPageSupplier(sharedData.page).innerText();
      await expect(errorMessage).toMatch(dynamicValues.errorMessage);
    });
  });

  // Required: 1 IR in in ongoing tab
  test("Test Case #5: Implement single IR From IRs list by providing Actual Impl.Date beyond the current date", async ({ playwright }) => {
    let innerTextIRNumberToAccept;

    //Expected result: user should be able to see the error message when choosing Actual Impl.Date beyond current date.
    await test.step("User should not be able to implement IR in List page by providing Actual Impl.Date beyond current date ", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);

      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);

      await sharedHelper.selectCheckboxForFirstRow(sharedData.page);

      var columnIRFirstRow = await locators.irColumn(sharedData.page, 0).nth(columnsNamesOngoingPage.get(dynamicValues.ImplementationRequest));
      var boxIRFirstRow = await columnIRFirstRow.locator("#root #label");
      innerTextIRNumberToAccept = await boxIRFirstRow.innerText();

      // Convert received date to Date object and add one day (for beyond current date)
      let date = new Date();
      date.setDate(date.getDate() + 1); // Add one day to the received date
      let futureDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

      var columnActualDate = await locators.irColumnForFirstRow(sharedData.page).nth(9);
      const calendarButton = await columnActualDate.locator("ptcs-icon");
      await calendarButton.locator("img").click();

      //await sharedHelper.ensureVisible(sharedData.page, locators.dateFieldNewIrListPage(sharedData.page));
      await locators.dateFieldNewIrListPage2(sharedData.page).fill(futureDate); // Enter the future date
      await locators.dateFieldNewIrListPage2(sharedData.page).press("Enter");

      await sharedData.page.waitForTimeout(5 * 1000);
      const errorMessage = await locators.messageOngoingInvalidActualDateListPageSupplier(sharedData.page).innerText();
      await expect(errorMessage).toMatch(dynamicValues.errorMessage);
    });
  });

  // Required: 1 IR in in ongoing tab
  test("Test Case #6: Implement single IR From IRs list by providing Actual Impl.Date between the Received and current date and validate the Actual date in Implemented page for the implemented IR.", async ({ playwright }) => {
    let innerTextIRNumberToImplement;
    let actualDate;

    // Expected result: user should be able see the success message.
    await test.step("Implement a single IR in List page by providing Actual Impl.Date between the Received and current date", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToOngoingPage(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, dynamicValues.testEnvArticleNumber);

      await sharedHelper.selectCheckboxForFirstRow(sharedData.page);

      var columnIRFirstRow = await locators.irColumn(sharedData.page, 0).nth(columnsNamesOngoingPage.get(dynamicValues.ImplementationRequest));
      var boxIRFirstRow = await columnIRFirstRow.locator("#root #label");
      innerTextIRNumberToImplement = await boxIRFirstRow.innerText();

      var columnReceivedDate = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesOngoingPage.get(dynamicValues.ReceivedDate));
      var boxReceivedDate = await columnReceivedDate.locator("#root #label");
      let innerTextReceivedDate = await boxReceivedDate.innerText();

      // Convert received date to Date object
      let receivedDate = new Date(innerTextReceivedDate);

      // Get the current date
      let currentDate = new Date();

      // Calculate a date between the received date and current date (midpoint approach)
      let midpointDate = new Date(receivedDate.getTime() + (currentDate.getTime() - receivedDate.getTime()) / 2);

      // Format the midpoint date as YYYY-MM-DD
      let midDate = midpointDate.toISOString().split("T")[0];

      // Store the midpoint date in actualDate
      actualDate = midDate;

      var columnActualDate = await locators.irColumnForFirstRow(sharedData.page).nth(9);
      const calendarButton = await columnActualDate.locator("ptcs-icon");
      await calendarButton.locator("img").click();

      //await sharedHelper.ensureVisible(sharedData.page, locators.dateFieldNewIrListPage(sharedData.page));
      await locators.dateFieldNewIrListPage2(sharedData.page).fill(midDate); // Enter the calculated midpoint date
      await locators.dateFieldNewIrListPage2(sharedData.page).press("Enter");

      await locators.continueButtonActaulDateListPage(sharedData.page).click();
      await locators.continueButtonImplementationVerficationDetailsPage(sharedData.page).click();
      await sharedData.page.waitForTimeout(30 * 1000);

      const successMessage = await locators.messageOngoingInvalidActualDateListPageSupplier(sharedData.page).innerText();
      await expect(successMessage).toMatch(dynamicValues.implementedSuccessMessage);
    });

    // Expected result: Visualized Actual date on implemented page should be the same as the Actual date the IR is implemented with at the previous step.
    await test.step("Navigate to Implemented page and validate the Actual date", async () => {
      await supplierHelper.performLoginSupplier(sharedData.page);
      await supplierHelper.navigateToImplementedPage(sharedData.page);
      await supplierHelper.searchForIrWithArticleNumber(sharedData.page, innerTextIRNumberToImplement);

      let columnLocator = await locators.irColumnForFirstRow(sharedData.page);
      var columnActualDate = await columnLocator.nth(columnsNamesImplementedPage.get(dynamicValues.ActualImplementationDate));
      var boxActualDate = await columnActualDate.locator("#root #label");
      let visualizedInnerTextActualDate = await boxActualDate.innerText();
      await expect(visualizedInnerTextActualDate).toBe(actualDate);
    });
  });
});

