const credentialsJson = require("../credentials.json");
const { test, expect } = require("@playwright/test");
const dynamicValues = require("../dynamic-values.js");
import { locators } from "../locators/locators.js";
const links = require("../links.json");
import * as sharedHelper from "../helper-functions/shared-helpers.js";

/**
 * @description Function to perform login steps for the supplier environment
 * @param {*} page
 */
export async function performLoginSupplier(page) {
  // Navigate to the supplier login page
  await navigateToSupplierLoginPage(page);

  // Fill the login form if necessary
  await fillSupplierLoginFormIfNeeded(page);
}
/**
 * @description Function to navigate to the supplier login page
 * @param {*} page
 */
async function navigateToSupplierLoginPage(page) {
  await page.goto(links.supplierPPE10EnviromentLink);
  // Wait for the page to fully load
  await page.waitForLoadState("networkidle"); // Wait for network to be idle (all resources loaded)
}
/**
 * @description Function to fill the login form if it is visible
 * @param {*} page
 */
async function fillSupplierLoginFormIfNeeded(page) {
  // Check if the login form is visible (i.e., if the user is not logged in)
  const isLoginFormVisible = await page.isVisible("#username");

  if (isLoginFormVisible) {
    // Load credentials
    const env = "supplierPPE10Enviroment";
    const { username, password } = credentialsJson[env];

    // Fill and submit the login form
    await page.fill("#username", username);
    await page.fill("#password", password);
    await page.click("#signOnButtonSpan");
  } else {
    console.log("User is already logged in. Skipping login step.");
  }
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in New IR page
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesNewIrPage(page) {
  await performLoginSupplier(page);
  await navigateToNewIrPage(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsNewIRPage);
  return columnsNames;
}
/**
 * @description Function to save the column names and their corresponding indexes in a Map in Ongoing page
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesOngoingPage(page) {
  await performLoginSupplier(page);
  await navigateToOngoingPage(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsOngoingPage);
  return columnsNames;
}
/**
 * @description Function to save the column names and their corresponding indexes in a Map in Implemented page
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesImplementedPage(page) {
  await performLoginSupplier(page);
  await navigateToImplementedPage(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsImplementedPage);
  return columnsNames;
}
/**
 * @description Function to save the column names and their corresponding indexes in a Map in Revision request page
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesRevisionRequestPage(page) {
  await performLoginSupplier(page);
  await navigateToRevisionRequestPage(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsRevisionRequestPage);
  return columnsNames;
}
/**
 * @description Function to save the column names and their corresponding indexes in a Map in Cancellation request page
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesCancellationPage(page) {
  await performLoginSupplier(page);
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
  await chooseIrItemSupplier(page);
  await sharedHelper.navigateToPage(page, locators.newIrButton(page));
}
/**
 * @description Function to navigate to the Ongoing page in the supplier environment
 * @param {*} page
 * @returns
 * */
export async function navigateToOngoingPage(page) {
  await chooseIrItemSupplier(page);
  await sharedHelper.navigateToPage(page, locators.ongoingButton(page));
}
/**
 * @description Function to navigate to the Implemented page in the supplier environment
 * @param {*} page
 * @returns
 * */
export async function navigateToImplementedPage(page) {
  await chooseIrItemSupplier(page);
  await sharedHelper.navigateToPage(page, locators.implementedPageButton(page));
}
/**
 * @description Function to navigate to the Revision Request page in the supplier environment
 * @param {*} page
 * @returns
 * */
export async function navigateToRevisionRequestPage(page) {
  await chooseIrItemSupplier(page);
  await sharedHelper.navigateToPage(page, locators.revisionRequestButton(page));
}
/**
 * @description Function to navigate to the Cancellation page in the supplier environment
 * @param {*} page
 * @returns
 * */
export async function navigateToCancellationPage(page) {
  await chooseIrItemSupplier(page);
  await sharedHelper.navigateToPage(page, locators.cancellationRequestPageButton(page));
}

/**
 * @description Function to choose the IR item option in the supplier
 * @param {*} page
 */
async function chooseIrItemSupplier(page) {
  // click on "select type" button
  //await locators.selectTypeButtonSupplier(page).waitFor({ state: "visible" });
  //await locators.selectTypeButtonSupplier(page).click();

  // click on the "IR" button
  await locators.irButtonSupplier(page).waitFor({ state: "visible" });
  await locators.irButtonSupplier(page).hover();
  await locators.irButtonSupplier(page).click();

  // open the "Select IR type" menu
  //await locators.selectIrTypeMenuSupplier(page).waitFor({ state: "visible" });
  //await locators.selectIrTypeMenuSupplier(page).click();

  // click on the "Item" button
  await locators.itemButtonSupplier(page).waitFor({ state: "visible" });
  await locators.itemButtonSupplier(page).click();
  //await page.waitForTimeout(2000); // Wait for the menu to close
}

/**
 * @description Function to search for an IR with the given article number in the supplier environment
 * @param {*} page
 * @param {*} articleNumber
 */
export async function searchForIrWithArticleNumber(page, articleNumber) {
  await sharedHelper.searchForIrWithArticleNumber(page, locators.searchBarSupplier(page), articleNumber);
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

export async function provideSuggestedDateListPage(page, date) {
  await locators.dateFieldRevReqListPage(page).waitFor({ state: "visible" });
  await locators.dateFieldRevReqListPage(page).click();
  await page.waitForTimeout(1000);

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  await locators.dateFieldRevReqListPage(page).type(year);
  await page.keyboard.press("Backspace");
  await locators.dateFieldRevReqListPage(page).type(month);

  if (month === "01") {
    await page.keyboard.press("ArrowRight");
  }
  await locators.dateFieldRevReqListPage(page).type(day);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(1000);
}
export async function provideSuggestedDateDetailsPage(page, date) {
  await locators.dateFieldRevReqDetailsPage(page).waitFor({ state: "visible" });
  await locators.dateFieldRevReqDetailsPage(page).click();
  await page.waitForTimeout(1000);

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  await locators.dateFieldRevReqDetailsPage(page).type(year);
  await page.keyboard.press("Backspace");
  await locators.dateFieldRevReqDetailsPage(page).type(month);

  if (month === "01") {
    await page.keyboard.press("ArrowRight");
  }
  await locators.dateFieldRevReqDetailsPage(page).type(day);
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(1000);
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
    var row = await locators.partStructureRowsSupplier(page).nth(i);
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
 * @description Function to get the visualized and fetched item part structure in the Supplier environment
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

  // Declare variables outside of the conditional blocks
  let visualizedParts;
  let normalizedVisualizedPartsArray;
  await page.waitForTimeout(5 * 1000);

  // Save the visualized products parts in an array
  //await sharedHelper.ensureVisible(page, locators.partStructureRowsSupplierEnv(page));

  const rownumbers = await locators.partStructureRowsSupplier(page).count();
  ({ visualizedParts, normalizedVisualizedPartsArray } = await saveVisualizedProductPartsInArray(rownumbers, page));

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
 * @description Function to get the visualized and fetched connected objects in the Supplier environment
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

    await locators.partStructureRowsSupplier(page).nth(i).locator('ptcs-div[part="body-cell"]').nth(0).locator("span").click();
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
 * @description Function to get the visualized and fetched classification attributes in the Supplier environment
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

  await locators.partStructureRowsSupplier(page).nth(i).locator('ptcs-div[part="body-cell"]').nth(0).locator("span").click();
  await page.waitForLoadState("networkidle");
  //await sharedHelper.ensureVisible(page, locators.classificationAttributesButton(page));
  await locators.classificationAttributesButton(page).nth(1).click();
  await page.waitForLoadState("networkidle");

  let numberOfAttributes = await locators.classificationAttributesRows(page).count();

  for (let i = 0; i < numberOfAttributes; i++) {
    const attributeName = await locators.classificationAttributesRows(page).nth(i).locator("ptcs-div").nth(0).locator("#root #label").innerText();
    const attributeValue = await locators.classificationAttributesRows(page).nth(i).locator("ptcs-div").nth(1).locator("#root #label").innerText();
    if (attributeValue != "") {
      visualizedClassificationAttributesMap.set(attributeName, attributeValue);
    }
  }

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
  await locators.partStructureRows(page).nth(i).locator('ptcs-div[part="body-cell"]').nth(0).locator("span").click();
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
 * @description Function to choose the IR and Part options in the supplier environment
 * @param {*} page
 */
async function chooseIrPart(page) {
  // click on the "IR" button
  await locators.irButtonSupplier(page).waitFor({ state: "visible" });
  await locators.irButtonSupplier(page).hover();
  await locators.irButtonSupplier(page).click();

  // click on the "Part" button
  await locators.partButtonSupplier2(page).waitFor({ state: "visible" });
  await locators.partButtonSupplier2(page).click();
}

/**
 * @description Function to navigate to the New IR page with "Part" option in the supplier environment
 * @param {*} page 
 */
export async function navigateToNewIrPagePart(page) {
  await chooseIrPart(page);
  await sharedHelper.navigateToPage(page, locators.newIrButton(page));
}

/**
 * @description Function to navigate to the Ongoing page with "Part" option in the supplier environment
 * @param {*} page 
 */
export async function navigateToOngoingPagePart(page) {
  await chooseIrPart(page);
  await sharedHelper.navigateToPage(page, locators.ongoingButton(page));
}

/**
 * @description Function to navigate to the Implemented page with "Part" option in the supplier environment
 * @param {*} page 
 */
export async function navigateToImplementedPagePart(page) {
  await chooseIrPart(page);
  await sharedHelper.navigateToPage(page, locators.implementedPageButton(page));
}

/**
 * @description Function to navigate to the Revision Request page with "Part" option in the supplier environment
 * @param {*} page 
 */
export async function navigateToRevisionRequestPagePart(page) {
  await chooseIrPart(page);
  await sharedHelper.navigateToPage(page, locators.revisionRequestButton(page));
}

/**
 * @description Function to navigate to the Cancellation Request page with "Part" option in the supplier environment
 * @param {*} page 
 */
export async function navigateToCancellationPagePart(page) {
  await chooseIrPart(page);
  await sharedHelper.navigateToPage(page, locators.cancellationRequestPageButton(page));
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in New IR page with "Part" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesNewIrPagePart(page) {
  await performLoginSupplier(page);
  await navigateToNewIrPagePart(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsNewIRPagePart);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Ongoing page with "Part" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesOngoingPagePart(page) {
  await performLoginSupplier(page);
  await navigateToOngoingPagePart(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsOngoingPagePart);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Implemented page with "Part" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesImplementedPagePart(page) {
  await performLoginSupplier(page);
  await navigateToImplementedPagePart(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsImplementedPagePart);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Revision Request page with "Part" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesRevisionRequestPagePart(page) {
  await performLoginSupplier(page);
  await navigateToRevisionRequestPagePart(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsRevisionRequestPagePart);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Cancellation Request page with "Part" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesCancellationRequestPagePart(page) {
  await performLoginSupplier(page);
  await navigateToCancellationPagePart(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsCancellationRequestPagePart);
  return columnsNames;
}




/****************** 
 * HELPER FUNCTIONS
 * FOR "RELATED OBJECT"
 ******************/

/**
 * @description Function to choose the IR and Related Object options in the supplier environment
 * @param {*} page
 */
async function chooseIrRelatedObject(page) {
  // click on the "IR" button
  await locators.irButtonSupplier(page).waitFor({ state: "visible" });
  await locators.irButtonSupplier(page).hover();
  await locators.irButtonSupplier(page).click();

  // click on the "Related Object" button
  await locators.relatedObjectButtonSupplier2(page).waitFor({ state: "visible" });
  await locators.relatedObjectButtonSupplier2(page).click();
}

/**
 * @description Function to navigate to the New IR page with "Related Object" option in the supplier environment
 * @param {*} page 
 */
export async function navigateToNewIrPageRelatedObject(page) {
  await chooseIrRelatedObject(page);
  await sharedHelper.navigateToPage(page, locators.newIrButton(page));
}

/**
 * @description Function to navigate to the Ongoing page with "Related Object" option in the supplier environment
 * @param {*} page 
 */
export async function navigateToOngoingPageRelatedObject(page) {
  await chooseIrRelatedObject(page);
  await sharedHelper.navigateToPage(page, locators.ongoingButton(page));
}

/**
 * @description Function to navigate to the Implemented page with "Related Object" option in the supplier environment
 * @param {*} page 
 */
export async function navigateToImplementedPageRelatedObject(page) {
  await chooseIrRelatedObject(page);
  await sharedHelper.navigateToPage(page, locators.implementedPageButton(page));
}

/**
 * @description Function to navigate to the Revision Request page with "Related Object" option in the supplier environment
 * @param {*} page 
 */
export async function navigateToRevisionRequestPageRelatedObject(page) {
  await chooseIrRelatedObject(page);
  await sharedHelper.navigateToPage(page, locators.revisionRequestButton(page));
}

/**
 * @description Function to navigate to the Cancellation Request page with "Related Object" option in the supplier environment
 * @param {*} page 
 */
export async function navigateToCancellationPageRelatedObject(page) {
  await chooseIrRelatedObject(page);
  await sharedHelper.navigateToPage(page, locators.cancellationRequestPageButton(page));
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in New IR page with "Related Object" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesNewIrPageRelatedObject(page) {
  await performLoginSupplier(page);
  await navigateToNewIrPageRelatedObject(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsNewIRPageRelatedObject);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Ongoing page with "Related Object" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesOngoingPageRelatedObject(page) {
  await performLoginSupplier(page);
  await navigateToOngoingPageRelatedObject(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsOngoingPageRelatedObject);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Implemented page with "Related Object" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesImplementedPageRelatedObject(page) {
  await performLoginSupplier(page);
  await navigateToImplementedPageRelatedObject(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsImplementedPageRelatedObject);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Revision Request page with "Related Object" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesRevisionRequestPageRelatedObject(page) {
  await performLoginSupplier(page);
  await navigateToRevisionRequestPageRelatedObject(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsRevisionRequestPageRelatedObject);
  return columnsNames;
}

/**
 * @description Function to save the column names and their corresponding indexes in a Map in Cancellation Request page with "Related Object" option
 * @param {*} page
 * @returns {Map} columnsNames - A Map containing column names as keys and their indexes as values
 */
export async function saveColumnsNamesCancellationRequestPageRelatedObject(page) {
  await performLoginSupplier(page);
  await navigateToCancellationPageRelatedObject(page);
  const columnsNames = await sharedHelper.saveColumnsNamesIrTableScp(page, dynamicValues.numberIrTableColumnsCancellationRequestPageRelatedObject);
  return columnsNames;
}

export async function isDateStrict(columnElement) {
  const cellText = await columnElement.innerText();
  return cellText.includes("(Strict)");
}