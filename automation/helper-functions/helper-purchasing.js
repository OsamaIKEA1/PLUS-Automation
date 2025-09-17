const credentialsJson = require("../credentials.json");
const { test, expect } = require("@playwright/test");
const dynamicValues = require("../dynamic-values.js");
import { locators } from "../locators/locators.js";
const links = require("../links.json");
import * as sharedHelper from "../helper-functions/shared-helpers.js";

/**
 * @description Function to perform login steps for the purchasing environment
 * @param {*} page
 */
export async function performLoginPurchasing(page) {
  // Navigate to the Purchasing login page
  await navigateToPurchasingLoginPage(page);

  // Fill the login form if necessary
  await fillPurchasingLoginFormIfNeeded(page);
}
/**
 * @description Function to navigate to the Purchasing login page
 * @param {*} page
 * */
async function navigateToPurchasingLoginPage(page) {
  await page.goto(links.purchasingPPE10EnviromentLink);
  // Wait for the page to fully load
  await page.waitForLoadState("networkidle"); // Wait for network to be idle (all resources loaded)
}
/**
 * @description Function to fill the login form if needed
 * @param {*} page
 * */
async function fillPurchasingLoginFormIfNeeded(page) {
  // Check if the login form is visible (i.e., if the user is not logged in)
  const isLoginFormVisible = await page.isVisible("#username");

  if (isLoginFormVisible) {
    // Load credentials
    const env = "purchasingPPE10Enviroment";
    const { username, password } = credentialsJson[env];

    // Fill and submit the login form
    await page.fill("#username", username);
    await page.fill("#password", password);
    await page.click("#signOnButtonSpan");
    await page.waitForLoadState("networkidle");
  } else {
    console.log("User is already logged in. Skipping login step.");
  }
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in New IR page
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableNewIrPage(page) {
  await performLoginPurchasing(page);
  await navigateToNewIrPage(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsNewIRPage);
  return columnsNames;
}
/**
 * @description Function to save the column names and their corresponding indexes in a Map in Ongoing page
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableOngoingPage(page) {
  await performLoginPurchasing(page);
  await navigateToOngoingPage(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsOngoingPage);
  return columnsNames;
}
/**
 * @description Function to save the column names and their corresponding indexes in a Map in Implemented Page
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableImplementedPage(page) {
  await performLoginPurchasing(page);
  await navigateToImplementedPage(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsImplementedPage);
  return columnsNames;
}
/**
 * @description Function to save the column names and their corresponding indexes in a Map in RevisionRequest page
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableRevisionRequestPage(page) {
  await performLoginPurchasing(page);
  await navigateToRevisionRequestPage(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsRevisionRequestPage);
  return columnsNames;
}
/**
 * @description Function to save the column names and their corresponding indexes in a Map in Cancellation page
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNameIrTableCancellationPage(page) {
  await performLoginPurchasing(page);
  await navigateToCancellationPage(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsCancellationRequestPage);
  return columnsNames;
}

/**
 * @description Function to navigate to the New IR page in the supplier environment
 * @param {*} page
 * @returns
 * */
export async function navigateToNewIrPage(page) {
  await chooseIrItemPurchasing(page);
  await sharedHelper.navigateToPage(page, locators.newIrButton(page));
}
/**
 * @description Function to navigate to the Ongoing page in the supplier environment
 * @param {*} page
 * @returns
 * */
export async function navigateToOngoingPage(page) {
  await chooseIrItemPurchasing(page);
  await sharedHelper.navigateToPage(page, locators.ongoingButton(page));
}
/**
 * @description Function to navigate to the Implemented page in the supplier environment
 * @param {*} page
 * @returns
 * */
export async function navigateToImplementedPage(page) {
  await chooseIrItemPurchasing(page);
  await sharedHelper.navigateToPage(page, locators.implementedPageButton(page));
}
/**
 * @description Function to navigate to the Revision Request page in the supplier environment
 * @param {*} page
 * @returns
 * */
export async function navigateToRevisionRequestPage(page) {
  await chooseIrItemPurchasing(page);
  await sharedHelper.navigateToPage(page, locators.revisionRequestButton(page));
}
/**
 * @description Function to navigate to the Cancellation page in the supplier environment
 * @param {*} page
 * @returns
 * */
export async function navigateToCancellationPage(page) {
  await chooseIrItemPurchasing(page);
  await sharedHelper.navigateToPage(page, locators.cancellationRequestPageButton(page));
}
/**
 * @description Function to choose the IR item option in the purchasing
 * @param {*} page
 */
async function chooseIrItemPurchasing(page) {
  // click on "select type" button
  //await locators.selectTypeButtonPurchasing(page).waitFor({ state: "visible" });
  //await locators.selectTypeButtonPurchasing(page).click();
  // click on the "IR" button
  await locators.irButtonPurchasing(page).waitFor({ state: "visible" });
  await locators.irButtonPurchasing(page).hover();
  await locators.irButtonPurchasing(page).click();

  // open the "Select IR type" menu
  //await locators.selectIrTypeMenuPurchasing(page).waitFor({ state: "visible" });
  //await locators.selectIrTypeMenuPurchasing(page).click();
  // click on the "Item" button
  await locators.itemButtonPurchasing(page).waitFor({ state: "visible" });
  await locators.itemButtonPurchasing(page).click();
}

/**
 * @description Function to search for an IR with a specific article number in the purchasing environment
 * @param {*} page
 * @param {*} articleNumber
 */
export async function searchForIrWithArticleNumber(page, articleNumber) {
  await sharedHelper.searchForIrWithArticleNumber(page, locators.searchBarPurchasing(page), articleNumber);
}
/**
 * @description Function to check if an IR exists in the list page SCP
 * @param {*} page
 * @param {*} IrNumber
 * @returns
 */
export async function isIrExistInListPage(page, IrNumber) {
  await searchForIrWithArticleNumber(page, IrNumber);
  return await sharedHelper.isIrExist(page);
}

/**
 * @description Function to save the visualized product parts in an array
 * @param {*} rownumbers
 * @param {*} page
 * @returns  {Object} An object containing the following properties:
 * * * - visualizedParts: An array of visualized part names from the UI
 * * * - normalizedVisualizedPartsArray: An array of normalized visualized part names from the UI
 */
async function saveVisualizedProductPartsInArray(rownumbers, page) {
  var visualizedPartsArray = [];
  var normalizedVisualizedPartsArray = [];
  for (let i = 0; i < rownumbers - 1; i++) {
    //-1 is for excluding the first row in the menu which is the BPS name
    var row = await locators.partStructureRowsPurchasing(page).nth(i);
    var c = await row.locator('ptcs-div[part="body-cell"]').nth(0);
    var box = await c.locator("span");
    visualizedPartsArray[i] = await box.innerText();
    // Normalize part name and partsArray values by trimming and reducing multiple spaces
    normalizedVisualizedPartsArray[i] = await visualizedPartsArray[i].replace(/\s+/g, " ").trim();
  }
  return {
    visualizedParts: visualizedPartsArray,
    normalizedVisualizedPartsArray: normalizedVisualizedPartsArray,
  };
}
/**
 * @description Function to get the visualized and fetched item part structure in the purchasing environment
 * @param {*} page
 * @param {*} labelLocator
 * @param {*} REQUESTEDIMPLEMENTATIONDATE
 * @param {*} PRODUCTOID
 * @param {*} EFFCONTEXTOID
 * @param {*} apiRequestContext
 * @param {*} csrfToken
 * @returns {Object} An object containing the following properties:
 * * - partsIDsArray: An array of part IDs fetched from the API
 * * - visualizedParts: An array of visualized part names from the UI
 * * - normalizedVisualizedPartsArray: An array of normalized visualized part names from the UI
 * * - normalizedPartNamefromApi: An array of normalized part names fetched from the API
 * * - normalizedcomponentsNameFromApi: An array of normalized component names fetched from the API
 */
export async function getVisualizedAndFetchedItemStructure(page, labelLocator, REQUESTEDIMPLEMENTATIONDATE, PRODUCTOID, EFFCONTEXTOID, apiRequestContext, csrfToken) {
  const effectiveDate = `${REQUESTEDIMPLEMENTATIONDATE}T00:00:00Z`;
  // define the request for the base product structure with the CSRF token and dynamic parts
  let productStructureUrl = `/PLUS/servlet/odata/v5/ProdMgmt/Parts('${PRODUCTOID}')/PTC.ProdMgmt.GetPartStructure?` + `$expand=Part,PartUse,Alternates($expand=Alternate),Substitutes($expand=Substitute),Components(` + `$expand=Part($select=TypeIcon,ID,Name,Number,ObjectType,Version),Alternates($expand=Alternate($select=TypeIcon,ObjectType,Name,Number))` + `,Substitutes($expand=Substitute($select=TypeIcon,ObjectType,Name,Number)),PartUse;$levels=2;$select=PVTreeId,PVParentTreeId)`;

  await labelLocator.click();
  await sharedHelper.basicWaitForAllLoaded(page);
  await page.waitForTimeout(5 * 1000);
  await sharedHelper.ensureVisible(page, locators.partStructureRowsPurchasing(page).first());
  //await locators.partStructureRowsPurchasingEnv(page).waitFor({ state: "visible" });
  // save the visualized products parts in an array
  var rownumbers = await locators.partStructureRowsPurchasing(page).count();

  const { visualizedParts, normalizedVisualizedPartsArray } = await saveVisualizedProductPartsInArray(rownumbers, page);
  // Step 3: Fetch base product structure
  const { partsIDs, normalizedPartNamefromApi, normalizedcomponentsNameFromApi } = await sharedHelper.FetchProductStructureFromApi(productStructureUrl, apiRequestContext, csrfToken, effectiveDate, EFFCONTEXTOID);
  return {
    partsIDsArray: partsIDs,
    visualizedParts: visualizedParts,
    normalizedVisualizedPartsArray: normalizedVisualizedPartsArray,
    normalizedPartNamefromApi: normalizedPartNamefromApi,
    normalizedcomponentsNameFromApi: normalizedcomponentsNameFromApi,
  };
}
/**
 * @description Function to get the visualized and fetched connected objects in the purchasing environment
 * @param {*} page
 * @param {*} apiRequestContext
 * @param {*} visualizedPartsArray
 * @param {*} partsIDs
 * @param {*} EFFCONTEXTOID
 * @param {*} REQUESTEDIMPLEMENTATIONDATE
 * @param {*} SUPPLIERID
 * @returns  {Object} An object containing the following properties:
 * * - FetchedConnectedObjectsDetailsMap: A Map containing the fetched connected objects details
 * * - visualizedConnectedObjectsDetailsMap: A Map containing the visualized connected objects details
 *
 */
export async function getVisualizedAndFetchedConnectedObjects(page, apiRequestContext, visualizedPartsArray, partsIDs, EFFCONTEXTOID, REQUESTEDIMPLEMENTATIONDATE, SUPPLIERID) {
  let FetchedConnectedObjectsDetailsMap = new Map();
  let visualizedConnectedObjectsDetailsMap = new Map();

  for (let i = 0; i < visualizedPartsArray.length; i++) {
    let childObjectsArray;

    await locators.partStructureRowsPurchasing(page).nth(i).locator('ptcs-div[part="body-cell"]').nth(0).locator("span").click();
    await page.waitForLoadState("networkidle");
    // Save the connected items in an array
    const subMenuRowNumbers = await locators.connectedItemsRows(page).count();
    if (subMenuRowNumbers == 0) {
      if (!visualizedConnectedObjectsDetailsMap.has(visualizedPartsArray[i])) {
        // Key doesn't exist, initialize with an array containing the value
        await visualizedConnectedObjectsDetailsMap.set(visualizedPartsArray[i], []);
      } else {
        // Key exists, push the value to the existing array
        //await documentsArray.get(partsArray[i]).push([]);
      }
    }
    for (let j = 0; j < subMenuRowNumbers; j++) {
      let item = [];
      for (let k = 1; k < dynamicValues.numberConnectedItemsDetailsColumns; k++) {
        // Exclude the first row in the submenu
        var row = await locators.connectedItemsRows(page).nth(j);
        var c = await row.locator('ptcs-div[part="body-cell"]').nth(k);
        var box = await c.locator("#root #label");
        item.push(await box.innerText()); // Add the value directly to the array
      }
      if (!visualizedConnectedObjectsDetailsMap.has(visualizedPartsArray[i])) {
        // Key doesn't exist, initialize with an array containing the value
        await visualizedConnectedObjectsDetailsMap.set(visualizedPartsArray[i], [item]);
      } else {
        // Key exists, push the value to the existing array
        await visualizedConnectedObjectsDetailsMap.get(visualizedPartsArray[i]).push(item);
      }
    }

    let connectedObjectsUrl = `/PLUS/servlet/odata/v5/ProdMgmt/Parts(ID='${partsIDs[i][0]}')/PTC.ProdMgmt.GetConnectedObjects(EffectivityContextOID='${EFFCONTEXTOID}',ImplDate='${REQUESTEDIMPLEMENTATIONDATE}',SupNo='${SUPPLIERID}')`;

    const connectedObjectsResponse = await apiRequestContext.get(connectedObjectsUrl);
    expect(connectedObjectsResponse.status()).toBe(200);
    // Parse the response body to JSON
    let responseBody = await connectedObjectsResponse.json();
    let connectedObjects = responseBody.value;
    // Save the values in the map
    childObjectsArray = connectedObjects.map((obj) => [
      obj.ChildObjectType,
      obj.ChildObjectName.replace(/\s+/g, " ").trim(),
      obj.ChildObjectVersion,
      obj.ChildSpecificationID || obj.ChildObjectNumber, // Use ID if available, otherwise use Number
    ]);

    if (!FetchedConnectedObjectsDetailsMap.has(visualizedPartsArray[i])) {
      // Initialize with an empty array
      await FetchedConnectedObjectsDetailsMap.set(visualizedPartsArray[i], []);
    }

    // Push each child object array to the array for the current key
    childObjectsArray.forEach((childArray) => {
      FetchedConnectedObjectsDetailsMap.get(visualizedPartsArray[i]).push(childArray);
    });
  }

  return {
    FetchedConnectedObjectsDetailsMap: FetchedConnectedObjectsDetailsMap,
    visualizedConnectedObjectsDetailsMap: visualizedConnectedObjectsDetailsMap,
  };
}
/**
 * @description Function to get the visualized and fetched classification attributes in the purchasing environment
 * @param {*} page
 * @param {*} apiRequestContext
 * @param {*} i
 * @param {*} partsIDs
 * @returns  {Object} An object containing the following properties:
 * * - sortedFetchedClassificationAttributesMap: An array of key-value pairs of fetched classification attributes sorted by keys
 * * - sortedvisualizedClassificationAttributesMap: An array of key-value pairs of visualized classification attributes sorted by keys
 */
export async function getVisualizedAndFetchedClassificationAttributes(page, apiRequestContext, i, partsIDs) {
  let fetchedClassificationAttributesMap = new Map();
  let visualizedClassificationAttributesMap = new Map();

  await locators.partStructureRowsPurchasing(page).nth(i).locator('ptcs-div[part="body-cell"]').nth(0).locator("span").click();
  await page.waitForLoadState("networkidle");
  await locators.classificationAttributesButton(page).nth(1).click();
  await page.waitForLoadState("networkidle");
/*
  let numberOfAttributes = await locators.classificationAttributesRows(page).count();

  for (let i = 0; i < numberOfAttributes; i++) {
    const attributeName = await locators.classificationAttributesRows(page).nth(i).locator("ptcs-div").nth(0).locator("#root #label").innerText();
    const attributeValue = await locators.classificationAttributesRows(page).nth(i).locator("ptcs-div").nth(1).locator("#root #label").innerText();
    if (attributeValue != "") {
      visualizedClassificationAttributesMap.set(attributeName, attributeValue);
    }
  }*/
// 1. Locate the scrollable area inside ptcs-grid
const gridScroller = await page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_mashupcontainer-21_ptcsgrid-14 ptcs-core-grid#grid ptcs-v-scroller2#chunker")



// 3. Get the bounding box of the scroller to move the mouse over it
const box = await gridScroller.boundingBox();
if (box) {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
} else {
  throw new Error("Failed to get bounding box of ptcs-v-scroller2");
}

// 4. Scroll and collect data
let previousRowCount = 0;
let stableScrolls = 0;

while (stableScrolls < 3) {
  await page.waitForTimeout(300);

  const visibleRows = await locators.classificationAttributesRows(page);
  const count = await visibleRows.count();

  for (let i = 0; i < count; i++) {
    const row = visibleRows.nth(i);
    const attributeName = await row.locator("ptcs-div").nth(0).locator("#root #label").innerText();
    const attributeValue = await row.locator("ptcs-div").nth(1).locator("#root #label").innerText();

    if (attributeValue !== "") {
      visualizedClassificationAttributesMap.set(attributeName, attributeValue);
    }
  }

  if (count === previousRowCount) {
    stableScrolls++;
  } else {
    stableScrolls = 0;
  }

  previousRowCount = count;

  // 5. Scroll the container via the mouse
  await gridScroller.focus();
  await gridScroller.hover();
  await page.mouse.wheel(0, 300);
}


/**
 * 
 * 
 */
  let classificationAttributesUrl = `/PLUS/servlet/odata/v5/ProdMgmt/Parts(ID='${partsIDs[i][0]}')/PTC.ProdMgmt.GetClassificationAttributes()`;
  const classificationAttributesResponse = await apiRequestContext.get(classificationAttributesUrl);
  expect(classificationAttributesResponse.status()).toBe(200);
  // Parse the response body to JSON
  let responseBody = await classificationAttributesResponse.json();
  let classificationAttributes = responseBody.value;
  // List of attributes to exclude
  const excludedAttributes = ["**Communicative Name", "Communicative ID", "English Name", "Swedish Name", "Description"];

  // Convert the classification attributes to a Map (instead of an object)
  classificationAttributes
    .filter((attr) => attr.AttributeValue && !excludedAttributes.includes(attr.AttributeName))
    .forEach((attr) => {
      // Remove leading ** from AttributeName if present
      const sanitizedAttributeName = attr.AttributeName.startsWith("**") ? attr.AttributeName.replace(/^\*\*/, "") : attr.AttributeName;

      fetchedClassificationAttributesMap.set(sanitizedAttributeName, attr.AttributeValue);
    });
  await page.waitForTimeout(1 * 1000);
  // Convert maps to arrays of key-value pairs and sort by keys
  const sortedFetchedClassificationAttributesMap = Array.from(fetchedClassificationAttributesMap).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  const sortedvisualizedClassificationAttributesMap = Array.from(visualizedClassificationAttributesMap).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  return {
    sortedFetchedClassificationAttributesMap: sortedFetchedClassificationAttributesMap,
    sortedvisualizedClassificationAttributesMap: sortedvisualizedClassificationAttributesMap,
  };
}



/* TO FIX After knowing the attributes that should be shown 
export async function getVisualizedAndFetchedGeneralAttributes(page, apiRequestContext, i, partsIDs) {
  const fetchedGeneralAttributesMap = new Map();
  const visualizedGeneralAttributesMap = new Map();

  // Define the attributes needed for each ObjectType
  const requiredAttributesByType = {
    "Requirement": ["Name", "Number", "Version", "RevisionComment"],
    "Specification": ["Name", "Number", "Version", "RevisionComment", "ApprovedDate", "AlternateNumber"],
    "IKEA Part": ["Name", "Number", "Version", "RevisionComment", "State", "AssemblyMode"],
    "Material": ["Name", "Number", "Version"],
    "Appearance": ["Name", "Number", "Version"],
    "Label": ["Name", "Number", "Version", "Type"],
  };

  // Open general attributes UI
  await locators.partStructureRowsPurchasingEnv(page).nth(i).locator('ptcs-div[part="body-cell"]').nth(0).locator("span").click();
  await page.waitForTimeout(3 * 1000);
  await locators.generalAttributesButton(page).click();

  const numberOfAttributes = await locators.generalAttributesRows(page).count();

  for (let j = 0; j < numberOfAttributes; j++) {
    const attributeName = await locators.generalAttributesRows(page).nth(j).locator("ptcs-div").nth(0).locator("#root #label").innerText();
    const attributeValue = await locators.generalAttributesRows(page).nth(j).locator("ptcs-div").nth(1).locator("span").innerText();
    if (attributeValue) {
      visualizedGeneralAttributesMap.set(attributeName, attributeValue);
    }
  }

  const generalAttributesUrl = `/PLUS/servlet/odata/v5/ProdMgmt/Parts('${partsIDs[i][0]}')?$expand=Representations`;
  const generalAttributesResponse = await apiRequestContext.get(generalAttributesUrl);

  expect(generalAttributesResponse.status()).toBe(200);

  const responseBody = await generalAttributesResponse.json();

  const objectType = responseBody.ObjectType || "Unknown";
  const requiredAttributes = requiredAttributesByType[objectType] || [];

  // Extract only the required attributes from the API response
  for (const attribute of requiredAttributes) {
    if (responseBody[attribute] !== undefined) {
      fetchedGeneralAttributesMap.set(attribute, responseBody[attribute]);
    }
  }

  // Convert maps to arrays of key-value pairs and sort by keys
  const sortedFetchedGeneralAttributesMap = Array.from(fetchedGeneralAttributesMap).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  const sortedVisualizedGeneralAttributesMap = Array.from(visualizedGeneralAttributesMap).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  return {
    sortedFetchedGeneralAttributesMap,
    sortedVisualizedGeneralAttributesMap,
  };
}
*/



/****************** 
 * HELPER FUNCTIONS
 * FOR "PART"
 ******************/

/**
 * @description Function to choose the IR Part option in the purchasing environment
 * @param {*} page 
 */
async function chooseIrPart(page) {
  // click on the "IR" button
  await locators.irButtonPurchasing(page).waitFor({ state: "visible" });
  await locators.irButtonPurchasing(page).hover();
  await locators.irButtonPurchasing(page).click();

  // click on the "Part" button
  await locators.partButtonPurchasing2(page).waitFor({ state: "visible" });
  await locators.partButtonPurchasing2(page).click();
}

/**
 * @description Function to navigate to the New IR page with "Part" option in the purchasing environment
 * @param {*} page
 * */
export async function navigateToNewIrPagePart(page) {
  await chooseIrPart(page);
  await sharedHelper.navigateToPage(page, locators.newIrButton(page));
}

/**
 * @description Function to navigate to the Ongoing page with "Part" option in the purchasing environment
 * @param {*} page
 * */
export async function navigateToOngoingPagePart(page) {
  await chooseIrPart(page);
  await sharedHelper.navigateToPage(page, locators.ongoingButton(page));
}

/**
 * @description Function to navigate to the Implemented page with "Part" option in the purchasing environment
 * @param {*} page
 * */
export async function navigateToImplementedPagePart(page) {
  await chooseIrPart(page);
  await sharedHelper.navigateToPage(page, locators.implementedPageButton(page));
}

/**
 * @description Function to navigate to the Revision Request page with "Part" option in the purchasing environment
 * @param {*} page
 * */
export async function navigateToRevisionRequestPagePart(page) {
  await chooseIrPart(page);
  await sharedHelper.navigateToPage(page, locators.revisionRequestButton(page));
}

/**
 * @description Function to navigate to the Cancellation page with "Part" option in the purchasing environment
 * @param {*} page
 * */
export async function navigateToCancellationPagePart(page) {
  await chooseIrPart(page);
  await sharedHelper.navigateToPage(page, locators.cancellationRequestPageButton(page));
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in New IR page with "Part" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableNewIrPagePart(page) {
  await performLoginPurchasing(page);
  await navigateToNewIrPagePart(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsNewIrPagePartPurchasing);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Ongoing page with "Part" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableOngoingPagePart(page) {
  await performLoginPurchasing(page);
  await navigateToOngoingPagePart(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsOngoingPagePartPurchasing);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Implemented page with "Part" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableImplementedPagePart(page) {
  await performLoginPurchasing(page);
  await navigateToImplementedPagePart(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsImplementedPagePartPurchasing);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Revision Request page with "Part" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableRevisionRequestPagePart(page) {
  await performLoginPurchasing(page);
  await navigateToRevisionRequestPagePart(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsRevisionRequestPagePartPurchasing);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Cancellation page with "Part" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNameIrTableCancellationPagePart(page) {
  await performLoginPurchasing(page);
  await navigateToCancellationPagePart(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsCancellationRequestPagePartPurchasing);
  return columnsNames;
}



/****************** 
 * HELPER FUNCTIONS
 * FOR "RELATED OBJECT"
 ******************/

/**
 * @description Function to choose the IR Related Object option in the purchasing environment
 * @param {*} page
 */
async function chooseIrRelatedObject(page) {
  // click on the "IR" button
  await locators.irButtonPurchasing(page).waitFor({ state: "visible" });
  await locators.irButtonPurchasing(page).hover();
  await locators.irButtonPurchasing(page).click();

  // click on the "Related Object" button
  await locators.relatedObjectButtonPurchasing2(page).waitFor({ state: "visible" });
  await locators.relatedObjectButtonPurchasing2(page).click();
}

/**
 * @description Function to navigate to the New IR page with "Related Object" option in the purchasing environment
 * @param {*} page
 * */
export async function navigateToNewIrPageRelatedObject(page) {
  await chooseIrRelatedObject(page);
  await sharedHelper.navigateToPage(page, locators.newIrButton(page));
}

/**
 * @description Function to navigate to the Ongoing page with "Related Object" option in the purchasing environment
 * @param {*} page
 * */
export async function navigateToOngoingPageRelatedObject(page) {
  await chooseIrRelatedObject(page);
  await sharedHelper.navigateToPage(page, locators.ongoingButton(page));
}

/**
 * @description Function to navigate to the Implemented page with "Related Object" option in the purchasing environment
 * @param {*} page
 * */
export async function navigateToImplementedPageRelatedObject(page) {
  await chooseIrRelatedObject(page);
  await sharedHelper.navigateToPage(page, locators.implementedPageButton(page));
}

/**
 * @description Function to navigate to the Revision Request page with "Related Object" option in the purchasing environment
 * @param {*} page
 * */
export async function navigateToRevisionRequestPageRelatedObject(page) {
  await chooseIrRelatedObject(page);
  await sharedHelper.navigateToPage(page, locators.revisionRequestButton(page));
}

/**
 * @description Function to navigate to the Cancellation page with "Related Object" option in the purchasing environment
 * @param {*} page
 * */
export async function navigateToCancellationPageRelatedObject(page) {
  await chooseIrRelatedObject(page);
  await sharedHelper.navigateToPage(page, locators.cancellationRequestPageButton(page));
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in New IR page with "Related Object" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableNewIrPageRelatedObject(page) {
  await performLoginPurchasing(page);
  await navigateToNewIrPageRelatedObject(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsNewIrPageRelatedObjectPurchasing);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Ongoing page with "Related Object" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableOngoingPageRelatedObject(page) {
  await performLoginPurchasing(page);
  await navigateToOngoingPageRelatedObject(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsOngoingPageRelatedObjectPurchasing);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Implemented page with "Related Object" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableImplementedPageRelatedObject(page) {
  await performLoginPurchasing(page);
  await navigateToImplementedPageRelatedObject(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsImplementedPageRelatedObjectPurchasing);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Revision Request page with "Related Object" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesIrTableRevisionRequestPageRelatedObject(page) {
  await performLoginPurchasing(page);
  await navigateToRevisionRequestPageRelatedObject(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsRevisionRequestPageRelatedObjectPurchasing);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Cancellation page with "Related Object" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNameIrTableCancellationPageRelatedObject(page) {
  await performLoginPurchasing(page);
  await navigateToCancellationPageRelatedObject(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsCancellationRequestPageRelatedObjectPurchasing);
  return columnsNames;
}