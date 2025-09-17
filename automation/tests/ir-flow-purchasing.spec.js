const { test, expect } = require("@playwright/test");
const { setupHooksWithDatabase, sharedData } = require("../hooks/hooks.js"); // Import hooks and shared data
const dynamicValues = require("../dynamic-values.js");
import * as purchasingHelper from "../helper-functions/helper-purchasing.js";
import { locators } from "../locators/locators.js";
import * as helperSupplier from "../helper-functions/helper-supplier.js";
import * as sharedHelper from "../helper-functions/shared-helpers.js";

setupHooksWithDatabase();
let columnsNamesNewIrPage;
let columnsNamesOngoingPage;
let columnsNamesImplementedPage;
test.beforeAll(async ({ browser, playwright }) => {
  columnsNamesNewIrPage = await purchasingHelper.saveColumnsNamesIrTableNewIrPage(sharedData.page);
  columnsNamesOngoingPage = await purchasingHelper.saveColumnsNamesIrTableOngoingPage(sharedData.page);
  columnsNamesImplementedPage = await purchasingHelper.saveColumnsNamesIrTableImplementedPage(sharedData.page);
  //let columnsNamesRevisionRequestPage = await purchasingHelper.saveColumnsNamesIrTableRevisionRequestPage(sharedData.page);
  //let columnsNamesCancellationRequestPage = await purchasingHelper.saveColumnsNameIrTableCancellationPage(sharedData.page);
});

// Tested
test.describe("IR Validation for Purchasing User - Whether they are able to see the IR assigned for them and details of IR like (BPS, PS, Timeline, connected objects, Visualization and attributes(General, Classification))", () => {
  test.describe.configure({ retries: 0, timeout: 600000 });
  test("Test Case #1: should display correct IR details for Supplier User including BPS, PS, Timeline, connected objects, attributes", async ({ playwright }) => {
    let productDetails;
    let irDetails;

    // Expected result: user should be able to login to the Supplier View and see the landing page's title SCP
    await test.step("Login to Purchasing View by using valid cred, check if the landing page has a title and Picture and a description text", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      const scpLogoTitle = await sharedData.page.locator("#root_mashupcontainer-3_ptcslabel-10").locator("#root #label").innerText();
      await expect(scpLogoTitle).toBe(dynamicValues.scpLogoTitle);
    });

    // Expected result: user should be able to select the Type
    await test.step("Check if the button is visible and select type IR", async () => {
      // click on "select type" button
      //await sharedHelper.ensureVisible(sharedData.page, locators.selectTypeButtonPurchasing(sharedData.page));
      //await locators.selectTypeButtonPurchasing(sharedData.page).click();

      // click on the "IR" button
      await sharedHelper.ensureVisible(sharedData.page, locators.irButtonPurchasing(sharedData.page));
      const irButton = await locators.irButtonPurchasing(sharedData.page);
      await expect(irButton).toBeTruthy();
      await expect(irButton).toBeVisible();
      await irButton.click();
    });

    // Expected result: user should be able to select the IR Type as "Related Object".
    await test.step("Select IR Type as Related Object", async () => {
      // open the "Select IR type" menu
      //await locators.selectIrTypeMenuPurchasing(sharedData.page).click();

      // check the "Related Object" button
      await sharedHelper.ensureVisible(sharedData.page, locators.relatedObjectButtonPurchasing(sharedData.page));
      const relatedObjectButton = await locators.relatedObjectButtonPurchasing(sharedData.page);
      await expect(relatedObjectButton).toBeTruthy();
      await expect(relatedObjectButton).toBeVisible();
    });

    // Expected result: user should be able to select the IR Type as "Part".
    await test.step("Select IR Type as Part", async () => {
      // check  the "Part" button
      await sharedHelper.ensureVisible(sharedData.page, locators.partButtonPurchasing2(sharedData.page));
      const PartButton = await locators.partButtonPurchasing2(sharedData.page);
      await expect(PartButton).toBeTruthy();
      await expect(PartButton).toBeVisible();
    });

    // Expected result: user should be able to select the IR Type as "Item".
    await test.step("Select IR Type as Item", async () => {
      // check and click on the "Item" button
      await sharedHelper.ensureVisible(sharedData.page, locators.itemButtonPurchasing(sharedData.page));
      const itemButton = await locators.itemButtonPurchasing(sharedData.page);
      await expect(itemButton).toBeTruthy();
      await expect(itemButton).toBeVisible();
      await itemButton.click();
    });

    for (let round = 0; round < dynamicValues.numberIrToTest; round++) {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToNewIrPage(sharedData.page);

      //get the element of the IR with its values from the db
      productDetails = await sharedData.productStructuresDataArrayPurchasingEnv[round][1];
      let IRNUMBER = await productDetails[0];
      var REQUESTEDIMPLEMENTATIONDATE = await productDetails[1];
      var BASEPRODUCTOID = await productDetails[2];
      var PACKAGINGPARTOID = await productDetails[3];
      var EFFCONTEXTOID = await productDetails[4];
      var SUPPLIERID = await productDetails[5];

      irDetails = await sharedData.irDetailsDataArrayPurchasingEnv[round][1];

      let visualizedPartsArray;
      let partsIDs;
      //search for the IR element
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, IRNUMBER);

      // Expected result: IR Details columns should have the same details as from Windchill.
      await test.step(" Validate IR Details including (Supplier ID, Impl. request, Item Name, Item Number, Type, Received Date, Req.Impl.Date, Agr. Impl. date, Exception, Message from IKEA)", async () => {
        let columnLocator = await locators.irColumnForFirstRow(sharedData.page);
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

      // Expected result: Base product structure label should be visible and exists.
      await test.step("Click on item name in list page and validate the BPS label.", async () => {
        //locate the first row => the "Item Name" column => the inner box
        var column = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.ItemName));
        var box = await column.locator("#root #label");
        await box.click();

        await sharedHelper.ensureVisible(sharedData.page, locators.baseProductStructureLabel(sharedData.page));

        await expect(locators.baseProductStructureLabel(sharedData.page)).toBeTruthy();
        await expect(locators.baseProductStructureLabel(sharedData.page)).toBeVisible();
      });

      // Expected result: Packaging solution label should be visible and exists.
      await test.step("Validate the PS label.", async () => {
        await sharedHelper.ensureVisible(sharedData.page, locators.packagingSolutionLabel(sharedData.page));

        await expect(locators.packagingSolutionLabel(sharedData.page)).toBeTruthy();
        await expect(locators.packagingSolutionLabel(sharedData.page)).toBeVisible();
      });

      // Expected result: user should be able to see the same Base Product structure details as Windchill IS
      await test.step("Base Product Structure sub components  in details page with windchill structure", async () => {
        let baseProductStructureLabelLocator = await locators.baseProductStructureLabel(sharedData.page);
        await baseProductStructureLabelLocator.click();

        const { partsIDsArray, visualizedParts, normalizedVisualizedPartsArray, normalizedPartNamefromApi, normalizedcomponentsNameFromApi } = await purchasingHelper.getVisualizedAndFetchedItemStructure(sharedData.page, baseProductStructureLabelLocator, REQUESTEDIMPLEMENTATIONDATE, BASEPRODUCTOID, EFFCONTEXTOID, sharedData.apiRequestContext, sharedData.csrfToken);

        partsIDs = await partsIDsArray;
        visualizedPartsArray = await visualizedParts;

        // Step 4: Validate the structure
        expect(normalizedVisualizedPartsArray).toContain(normalizedPartNamefromApi); // Check that the main Part is in the partsArray

        normalizedcomponentsNameFromApi.forEach((componentName) => {
          expect(normalizedVisualizedPartsArray).toContain(componentName); // Check that all component names are in the partsArray
        });
      });

      //Expected result: User should be able to see the same classification attributes details mentioned in windchill object
      await test.step("Validate Classification and General attribute details with Windchill object general attributes", async () => {
        for (let i = 0; i < visualizedPartsArray.length; i++) {
          if(partsIDs[i][1]!= "Article" && partsIDs[i][1] != "Document" && partsIDs[i][1] != "Material" && partsIDs[i][1] != "Appearance") {
          const { sortedFetchedClassificationAttributesMap, sortedvisualizedClassificationAttributesMap } = await purchasingHelper.getVisualizedAndFetchedClassificationAttributes(sharedData.page, sharedData.apiRequestContext, i, partsIDs);
          // Compare if the sorted arrays match
          expect(sortedFetchedClassificationAttributesMap).toEqual(sortedvisualizedClassificationAttributesMap);
          }
          /*
          const { sortedFetchedGeneralAttributesMap, sortedvisualizedGeneralAttributesMap } = await purchasingHelper.getVisualizedAndFetchedClassificationAttributes(sharedData.page, sharedData.apiRequestContext, i, partsIDs);
          // Compare if the sorted arrays match
          expect(sortedFetchedGeneralAttributesMap).toEqual(sortedvisualizedGeneralAttributesMap);
         */
        }
      });

      // Expected result: user should be able to see the same connected objects details as Windchill IS
      await test.step("Base Product Structure component's connected objects same as in windchill", async () => {
        const { FetchedConnectedObjectsDetailsMap, visualizedConnectedObjectsDetailsMap } = await purchasingHelper.getVisualizedAndFetchedConnectedObjects(sharedData.page, sharedData.apiRequestContext, visualizedPartsArray, partsIDs, EFFCONTEXTOID, REQUESTEDIMPLEMENTATIONDATE, SUPPLIERID);
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

        const { partsIDsArray, visualizedParts, normalizedVisualizedPartsArray, normalizedPartNamefromApi, normalizedcomponentsNameFromApi } = await purchasingHelper.getVisualizedAndFetchedItemStructure(sharedData.page, packagingSolutionLabelLocator, REQUESTEDIMPLEMENTATIONDATE, PACKAGINGPARTOID, EFFCONTEXTOID, sharedData.apiRequestContext, sharedData.csrfToken);

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

//Tested
// Required: two IR in New IR page in Purchasing user after creating them in Windchill (Will be removed and moved to new IR in supplier)
test.describe("Releasing IR and validating Relased IR's in Ongoing page for purchasing user", () => {
  test.describe.configure({ retries: 1, timeout: 600000 });
  test("Test Case #1: Releasing IR from List page for purchasing user.", async ({ playwright }) => {
    let innerTextIrNumberOfTheIrToBeReleased;
    let articleNumberToBeReleased = dynamicValues.testEnvArticleNumber;
    let numberOfIrFoundBeforeRelease;

    // Expected result: User should be able to see the success msg. and the selected IR details should be removed from the list page of New IR tab.
    await test.step("Releasing IR from List page", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToNewIrPage(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, articleNumberToBeReleased);
      numberOfIrFoundBeforeRelease = await sharedHelper.getNumberOfItems(sharedData.page);

      await sharedHelper.selectCheckboxForFirstRow(sharedData.page); // click on the checkbox of the first row
      const columnLocator = await locators.irColumnForFirstRow(sharedData.page);

      var irNumberOfTheIrToBeReleased = await columnLocator.nth(columnsNamesNewIrPage.get(dynamicValues.ImplementationRequest)).locator("#root #label");

      innerTextIrNumberOfTheIrToBeReleased = await irNumberOfTheIrToBeReleased.innerText();
      await locators.releaseButton(sharedData.page).click();

      await sharedData.page.waitForTimeout(30 * 1000);

      const successMessage = await locators.releaseinProgressMessage(sharedData.page).innerText();
      await expect(successMessage).toMatch(dynamicValues.releaseOneSuccessMessageListPage);

      var numberOfIrFoundAfterRelease = await sharedHelper.getNumberOfItems(sharedData.page);

      await expect(numberOfIrFoundAfterRelease).toEqual(numberOfIrFoundBeforeRelease - 1);
    });

    // Expected result: The released IR should be removed from the list page of New IR tab.
    await test.step("Validating that IR is removed from New IR page.", async () => {
      await sharedData.page.waitForTimeout(120 * 1000);

      var numberOfIrFoundAfterRelease = await sharedHelper.getNumberOfItems(sharedData.page);

      await expect(numberOfIrFoundAfterRelease).toEqual(numberOfIrFoundBeforeRelease - 1);
    });

    // Expected result: User should be able to see the released IR in ongoing page.
    await test.step("Validating Relased IR's in Ongoing page for purchasing user", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToOngoingPage(sharedData.page);

      let isIrReleasedExist = await purchasingHelper.isIrExistInListPage(sharedData.page, innerTextIrNumberOfTheIrToBeReleased);

      expect(isIrReleasedExist).toBe(true);
    });
  });

  test("Test Case #2: Releasing IR from Details Page and Validating Relased IR's in Ongoing page for purchasing user", async ({ playwright }) => {
    let innerTextIrNumberOfTheIrToBeReleased;
    let IRNumberToBeReleased = dynamicValues.testEnvArticleNumber;
    var numberOfIrFoundBeforeRelease;

    // Expected result: User should be able to see the success msg.
    await test.step("Releasing IR from Details Page.", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToNewIrPage(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, IRNumberToBeReleased);

      numberOfIrFoundBeforeRelease = await sharedHelper.getNumberOfItems(sharedData.page);

      var irNumberOfTheIrToBeReleased = await locators.irColumnForFirstRow(sharedData.page).nth(columnsNamesNewIrPage.get(dynamicValues.ImplementationRequest)).locator("#root #label");
      innerTextIrNumberOfTheIrToBeReleased = await irNumberOfTheIrToBeReleased.innerText();

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
      await sharedHelper.ensureVisible(sharedData.page, locators.releaseButtonDetailsPage(sharedData.page));
      await locators.releaseButtonDetailsPage(sharedData.page).click();

      await sharedData.page.waitForTimeout(30 * 1000);
      const successMessage = await locators.releaseinProgressMessage(sharedData.page).innerText();
      await expect(successMessage).toMatch(dynamicValues.releaseOneSuccessMessageDetailsPage);
    });

    // Expected result: The released IR should be removed from the list page of New IR tab.
    await test.step("Validating that relased IR is removed from NewIR page", async () => {
      await sharedData.page.waitForTimeout(120 * 1000);

      await locators.backButtonDetailsPagePurchasing(sharedData.page).click();

      var numberOfIrFoundAfterRelease = await sharedHelper.getNumberOfItems(sharedData.page);
      await expect(numberOfIrFoundAfterRelease).toEqual(numberOfIrFoundBeforeRelease - 1);
    });

    // Expected result: user should be able to see the released IR in ongoing page.
    await test.step("Validating Relased IR's in Ongoing page for purchasing user", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToOngoingPage(sharedData.page);
      let isIrReleasedExist = await purchasingHelper.isIrExistInListPage(sharedData.page, innerTextIrNumberOfTheIrToBeReleased);
      expect(isIrReleasedExist).toBe(true);
    });
  });
});

//Tested
// Required: 0 or more IR in in ongoing tab in each(All, 4 Weeks left, Overdue) (Will not be removed)
test.describe("Validate purchasing user should able to see the IR in 3 categories based on Agreed Impl Date in ongoing tab(All, 4 Weeks left, Overdue)", () => {
  test.describe.configure({ retries: 1, timeout: 600000 });

  test("Test case #1: Validate that in purchasing, user should able to see the IR in 3 categories based on Agreed Impl Date in Ongoing page(All, 4 Weeks left, Overdue)", async ({ playwright }) => {
    let elemntsToCheckInAllFilter = [];

    // Helper function to strip time from date and return date-only object
    const stripTimeFromDate = (dateString) => {
      const date = new Date(dateString);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    // Expected result: user should be able to see the IR in Overdue category with overdue agreed date.
    await test.step("Validate Overdue IRs (up to three IRs)", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToOngoingPage(sharedData.page);
      await sharedHelper.ensureVisible(sharedData.page, locators.overDueButtonPurchasing(sharedData.page));
      await locators.overDueButtonPurchasing(sharedData.page).click();
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
            var boxAgreedImplementationDate = await agreedImplementationDateColumn.locator("#root #label");
            var innerTextAgreedImplementationDate = await boxAgreedImplementationDate.innerText();

            // Strip time from dates for comparison
            const givenDate = stripTimeFromDate(innerTextAgreedImplementationDate);
            const today = stripTimeFromDate(new Date());
            await expect(givenDate <= today).toBeTruthy();
            await elemntsToCheckInAllFilter.push(innerTextIr);
          }
        }
      }
    });

    // Expected result: user should be able to see the IR 4 Weeks Left category with agreed date between today and 4 weeks.
    await test.step("Validate 4WeeksLeft IRs (up to three IRs)", async () => {
      await locators.fourWeeksLeftButtonPurchasing(sharedData.page).click();

      let numberOfIr = await sharedHelper.getNumberOfItems(sharedData.page);

      if (numberOfIr != 0) {
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
            var boxAgreedImplementationDate = await agreedImplementationDateColumn.locator("#root #label");
            var innerTextAgreedImplementationDate = await boxAgreedImplementationDate.innerText();

            // Strip time from dates for comparison
            const givenDate = stripTimeFromDate(innerTextAgreedImplementationDate);
            const today = stripTimeFromDate(new Date());

            // Calculate 30 days from today (without time)
            const thirtyDaysLater = new Date(today);
            thirtyDaysLater.setDate(today.getDate() + 30);

            // Validate that the given date is within the next 30 days
            await expect(givenDate >= today && givenDate <= thirtyDaysLater).toBeTruthy();

            await elemntsToCheckInAllFilter.push(innerTextIr);
          }
        }
      }
    });

    // Expected result: user should be able to see the IR in All category with overdue and 4 weeks left agreed date.
    await test.step("Validate All IRs (all checked IRs in Overdue and 4 Weeks Left tabs)", async () => {
      await locators.allButtonPurchasing(sharedData.page).click();
      await sharedData.page.waitForLoadState("load");

      let numberOfIr = await sharedHelper.getNumberOfItems(sharedData.page);

      if (numberOfIr != 0) {
        for (let i = 0; i < elemntsToCheckInAllFilter.length; i++) {
          let IRNUMBER = elemntsToCheckInAllFilter[i]; // Get the current IR number

          let isIrExist = await purchasingHelper.isIrExistInListPage(sharedData.page, IRNUMBER);
          // Validate that at least one row is found
          await expect(isIrExist).toBe(true);
        }
      }
    });
  });
});

//Tested
// Required: one and the same IR in in ongoing tab supplier and purchasing user (will not be removed)
test.describe("Validate IR's agreed date for both supplier user and purchasing user", () => {
  test.describe.configure({ retries: 1, timeout: 600000 });

  test("Test Case #1: validate that the agreed date for the accepted Ir is same in both supplier user and purchasing user in Ongoing tab", async ({ playwright }) => {
    let accepetedIrFromOngoingSupplier;
    let accepetedIrAgreedDateFromOngoingSupplier;

    // Expected result: user should be able to see an agreed date for the accepted IR supplier user that is not null.
    await test.step("Navigate to ongoing page in supplier user and save the accepted IR with it's agreed date ", async () => {
      const browser = sharedData.page.context().browser();
      const newContext = await browser.newContext();
      const newPage = await newContext.newPage();

      await helperSupplier.performLoginSupplier(newPage);
      await helperSupplier.navigateToOngoingPage(newPage);

      await helperSupplier.searchForIrWithArticleNumber(newPage, dynamicValues.testEnvArticleNumber);
      var columnIR = await locators.irColumnForFirstRow(newPage).nth(columnsNamesOngoingPage.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      let innerTextIRNumberToAccept = await boxIR.innerText();
      accepetedIrFromOngoingSupplier = await innerTextIRNumberToAccept;

      let columnLocator = locators.irColumnForFirstRow(newPage);
      var agreedImplementationDateColumn = await columnLocator.nth(columnsNamesOngoingPage.get(dynamicValues.AgreedImplementationDate));

      accepetedIrAgreedDateFromOngoingSupplier = await agreedImplementationDateColumn.innerText();

      expect(accepetedIrAgreedDateFromOngoingSupplier).not.toBeNull();
      await newPage.close();
    });

    // Expected result: user should be able to see the same agreed date for the accepted IR in purchasing user as the one saved from supplier user.
    await test.step("Navigate to the ongoing page in the purchasing user and validate that the accepted IR exists with the correct agreed date.", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToOngoingPage(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, accepetedIrFromOngoingSupplier);

      let columnLocator = locators.irColumnForFirstRow(sharedData.page);
      var agreedImplementationDateColumn = await columnLocator.nth(columnsNamesOngoingPage.get(dynamicValues.AgreedImplementationDate));
      var boxAgreedImplementationDate = await agreedImplementationDateColumn.locator("#root #label");
      var innerTextAgreedImplementationDate = await boxAgreedImplementationDate.innerText();

      expect(innerTextAgreedImplementationDate).toBe(accepetedIrAgreedDateFromOngoingSupplier);
    });
  });
});


//Tested
// Required: one and the same IR in in Implemented tab supplier and purchasing user (Will not be removed)
test.describe("Validate IR's actual date for both supplier user and purchasing user", () => {
  test.describe.configure({ retries: 1, timeout: 600000 });

  test("Test Case #1: validate that the actual date for the implemented Ir is same in both supplier user and purchasing user in Implemented tab", async ({ playwright }) => {
    let implementedIrFromOngoingSupplier;
    let implementedIrActualDateFromOngoingSupplier;

    // Expected result: user should be able to see an actual date for the implemented IR supplier user that is not null.
    await test.step("Navigate to Implemented page in supplier user and save the implemented IR with it's actual date ", async () => {
      const browser = sharedData.page.context().browser();

      const newContext = await browser.newContext();
      const newPage = await newContext.newPage();

      await helperSupplier.performLoginSupplier(newPage);
      await helperSupplier.navigateToImplementedPage(newPage);

      await helperSupplier.searchForIrWithArticleNumber(newPage, dynamicValues.testEnvArticleNumber);
      var columnIR = await locators.irColumnForFirstRow(newPage).nth(columnsNamesImplementedPage.get(dynamicValues.ImplementationRequest));
      var boxIR = await columnIR.locator("#root #label");
      let innerTextIRNumberImplemented = await boxIR.innerText();
      implementedIrFromOngoingSupplier = await innerTextIRNumberImplemented;

      let columnLocator = locators.irColumnForFirstRow(newPage);
      var actualDateColumn = await columnLocator.nth(columnsNamesImplementedPage.get(dynamicValues.ActualImplementationDate));
      var boxActualDate = await actualDateColumn.locator("#root #label");
      implementedIrActualDateFromOngoingSupplier = await boxActualDate.innerText();

      expect(implementedIrActualDateFromOngoingSupplier).not.toBeNull();
      await newPage.close();
    });

    // Expected result: user should be able to see the same actual date for the implemented IR in purchasing user as the one saved from supplier user.
    await test.step("Navigate to the Implemented page in the Purchasing portal and validate that the implemented IR exists with the correct actaul date.", async () => {
      await purchasingHelper.performLoginPurchasing(sharedData.page);
      await purchasingHelper.navigateToImplementedPage(sharedData.page);
      await purchasingHelper.searchForIrWithArticleNumber(sharedData.page, implementedIrFromOngoingSupplier);

      let columnLocator = locators.irColumnForFirstRow(sharedData.page);
      var actualDateColumn = await columnLocator.nth(columnsNamesImplementedPage.get(dynamicValues.ActualImplementationDate));
      var boxActualDate = await actualDateColumn.locator("#root #label");
      var innerTextActualDate = await boxActualDate.innerText();

      expect(innerTextActualDate).toBe(implementedIrActualDateFromOngoingSupplier);
    });
  });
});
