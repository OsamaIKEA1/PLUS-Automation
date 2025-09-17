const dynamicValues = require("../dynamic-values.js");

export const locators = {
  // Buttons
  sideSearchButton: (page) => page.locator("#object_search_navigation_nav"),
  advancedSearchButton: (page) => page.locator("#ext-gen63"),
  allTypeCheckBox: (page) => page.locator("#allTypesDiv").locator("input[type='checkbox']"),
  implementationRequestCheckBox: (page) => page.locator('input[type="checkbox"][name="WCTYPE|wt.change2.WTChangeReview|wt.change2.DesignReview|com.ikea.IKEADesignReview"]'),
  nameEqualBox: (page) => page.locator('select[name="operator"]').nth(0),
  numberEqualBox: (page) => page.locator('select[name="operator"]').nth(1),
  addAttributesButton: (page) => page.locator('img[alt="Add Attributes"]'),
  connectedItemsCheckBox: (page) => page.locator("div.x-grid3-row").nth(6).locator("table.x-grid3-row-table tbody tr").locator("td").nth(0),
  searchButtonInAdvancedSearch: (page) => page.locator("#extSearchButtonDiv button.x-btn-text"),
  stateButtonInAdvancedSearch: (page) => page.locator("#wt\\.fc\\.Persistable\\.defaultSearchView .x-panel-body.x-panel-body-noheader.x-panel-body-noborder .x-grid3-hd-inner.x-grid3-hd-state"),
  actionButtonInIrPage: (page) => page.locator("#infoPagedetailsPageActionsMenu"),
  cancelImplementationRequestButton: (page) => page.locator("text=Cancel Implementation Request"),
  homepageButton: (page) => page.locator("#homePageIconID"),
  firstRowInMyTasksButton: (page) => page.locator('[id="projectmanagement.overview.assignments.list"] .x-grid3-row.x-grid3-row-first').locator("td").nth(3),
  acceptRoutingOptionButton: (page) => page.locator("#routingChoice_Accept"),
  completeTaskButton: (page) => page.locator('button[name="complete"]'),

  // Input fields
  nameField: (page) => page.locator(".ng-pristine.ng-untouched.ng-valid.ng-empty").nth(0),
  numberField: (page) => page.locator(".ng-pristine.ng-untouched.ng-valid.ng-empty").nth(0),
  connectedItemField: (page) => page.locator(".ng-pristine.ng-untouched.ng-valid.ng-empty").nth(0),
  searchBarInAdvancedSearchResult: (page) => page.locator('[id="wt.fc.Persistable.defaultSearchView.searchInListTextBox"]'),
  globalSearchBar: (page) => page.locator('[id="gloabalSearchField"]'),
  taskCompletionComment: (page) => page.locator("#workitem_comment"),
  dateField: (page) => page.locator("#CustActVarRequestedNewImplDateCustActVar"),

  // Tables
  tableInAdvancedSearch: (page) => page.locator(".x-grid3-scroller .x-grid3-body .x-grid3-row"),
   tableInGlobalSearch:(page) => page.locator(".x-grid3-scroller .x-grid3-body .x-grid3-row .x-grid3-row-table tr"),

  irColumnInAdvancedSearchResultTable: (page) => page.locator('td.attributePanel-value[attrid="number"]').textContent(),
  irNumberMyTasks: (page) => page.locator('td.attributePanel-value[attrid="name"]').textContent(),

  taskRowByName: (page, taskName) => page.locator('[id="projectmanagement.overview.assignments.list"]').locator('.x-grid3-row').filter({ has: page.locator('.x-grid3-col-ASSIGNMENT_NAME', { hasText: taskName }) }).first(),
};
