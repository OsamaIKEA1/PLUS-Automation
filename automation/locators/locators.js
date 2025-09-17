const dynamicValues = require("../dynamic-values.js");

export const locators = {
  // Labels
  homepageTitleLabel: (page) => page.locator("#root_mashupcontainer-62_flexcontainer-23"),
  homepageDescriptionLabel: (page) => page.locator("#root_mashupcontainer-62_flexcontainer-39"),
  baseProductStructureLabel: (page, text = dynamicValues.baseProductStructureLabelName) => page.locator(`text=${text}`),
  packagingSolutionLabel: (page, text = dynamicValues.packagingSolutionLabelName) => page.locator(`text=${text}`),
  numberOfItemsLabel: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_ptcslabel-25-bounding-box ptcs-label #root #label"),

  // Images
  homepageImage: (page) => page.locator(`div#root[part="image"]`).nth(1),

  //Buttons
  selectModeButtonPurchasing: (page) => page.locator(`#root_ptcsdropdown-91 iron-icon`),
  selectModeButtonSupplier: (page) => page.locator(`#root_ptcsdropdown-85 iron-icon`),

  selectTypeButtonPurchasing: (page) => page.locator(`#root_mashupcontainer-3_ptcsdropdown-95`),
  selectTypeButtonSupplier: (page) => page.locator(`#root_mashupcontainer-3_ptcsdropdown-86`),

  selectIrTypeMenuPurchasing: (page) => page.locator("#root_mashupcontainer-3_ptcsdropdown-101"),
  selectIrTypeMenuSupplier: (page) => page.locator("#root_mashupcontainer-3_ptcsdropdown-87"),

  irButtonPurchasing: (page) => page.locator("#root_mashupcontainer-3_ptcsgrid-233 #grid #chunker ptcs-div.tree-toggle").locator("ptcs-icon").nth(2),
  itemButtonPurchasing: (page) => page.locator(`#root_mashupcontainer-3_ptcsgrid-233 #grid #chunker ptcs-div.tree-toggle`).locator("ptcs-icon").nth(3),
  // partButtonPurchasing: (page, label = dynamicValues.partButtonName) => page.locator(`#root_mashupcontainer-3_ptcsgrid-233 #grid #chunker ptcs-div.tree-toggle`).locator(`text=${label}`),
  // relatedObjectButtonPurchasing: (page, label = dynamicValues.relatedObjectButtonName) => page.locator(`#root_mashupcontainer-3_ptcsgrid-233 #grid #chunker ptcs-div.tree-toggle`).locator(`text=${label}`),
  
  
  itemButtonSupplier: (page) => page.locator("#root_mashupcontainer-3_ptcsgrid-192 #grid #chunker ptcs-div.tree-toggle").locator("ptcs-icon").nth(3),
  // partButtonSupplier: (page, label = dynamicValues.partButtonName) => page.locator(`#root_mashupcontainer-3_ptcsgrid-192 #grid #chunker ptcs-div.tree-toggle`).locator(`text=${label}`),
  // relatedObjectButtonSupplier: (page, label = dynamicValues.relatedObjectButtonName) => page.locator(`#root_mashupcontainer-3_ptcsgrid-192 #grid #chunker ptcs-div.tree-toggle`).locator(`text=${label}`),

  //irButton: (page, label = dynamicValues.irButtonName) => page.locator("#list-container").getByLabel(label, { exact: true }),
  //irButton: (page, label = dynamicValues.irButtonName) => page.locator('ptcs-label[label="IR"][part="cell-label state-value"]').getByLabel(label, { exact: true }),
  irButtonSupplier: (page) => page.locator("#root_mashupcontainer-3_ptcsgrid-192 #grid #chunker ptcs-div.tree-toggle").locator("ptcs-icon").nth(2),

  partButtonSupplier2: (page) => page.locator('#root_mashupcontainer-3_ptcsgrid-192 #grid #chunker').locator('ptcs-div.tree-toggle').filter({ hasText: dynamicValues.partButtonName }).locator('ptcs-icon[part="tree-toggle-icon"]'),
  partButtonPurchasing2: (page) => page.locator('#root_mashupcontainer-3_ptcsgrid-233 #grid #chunker').locator('ptcs-div.tree-toggle').filter({ hasText: dynamicValues.partButtonName }).locator('ptcs-icon[part="tree-toggle-icon"]'),

  relatedObjectButtonSupplier2: (page) => page.locator('#root_mashupcontainer-3_ptcsgrid-192 #grid #chunker').locator('ptcs-div.tree-toggle').filter({ hasText: dynamicValues.relatedObjectButtonName }).locator('ptcs-icon[part="tree-toggle-icon"]'),
  relatedObjectButtonPurchasing2: (page) => page.locator('#root_mashupcontainer-3_ptcsgrid-233 #grid #chunker').locator('ptcs-div.tree-toggle').filter({ hasText: dynamicValues.relatedObjectButtonName }).locator('ptcs-icon[part="tree-toggle-icon"]'),

  releaseButtonDetailsPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsbutton-532"),
  releaseButton: (page, label = dynamicValues.releaseButtonName) => page.getByLabel(label, { exact: true }).first(),

  acceptButtonDetailsPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsbutton-532"),
  acceptButtonListPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_ptcsbutton-21"),
  acceptButtonInsideAcceptWindowDetailsPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_navigationfunction-404-popup_ptcsbutton-19"),
  acceptButtonInsideAcceptWindowListPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-238-popup_ptcsbutton-19"),

  actualImplementationDateDetailsPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsdatepicker-594 #calendarbutton"),

  classificationAttributesButton: (page, text = "Classification") => page.locator(`text="${text}"`),
  generalAttributesButton: (page, text = "General") => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_mashupcontainer-21_ptcstabset-9").locator(`text="${text}"`),

  newIrButton: (page, text = dynamicValues.newIrPageButtonName) => page.locator(`text=${text}`, { exact: true }).nth(0),
  ongoingButton: (page, text = dynamicValues.ongoingPageButtonName) => page.locator(`text=${text}`, { exact: true }).nth(0),
  revisionRequestButton: (page, text = dynamicValues.revisionRequestPageButtonName) => page.locator(`text=${text}`, { exact: true }).nth(0),
  implementedPageButton: (page, text = dynamicValues.implementedPageButtonName) => page.locator(`text=${text}`, { exact: true }).nth(0),
  cancellationRequestPageButton: (page, text = dynamicValues.cancellationRequestPageButtonName) => page.locator(`text=${text}`, { exact: true }).nth(0),

  overDueButtonPurchasing: (page) => page.locator(`#root_mashupcontainer-3_mashupcontainer-62_ptcsbutton-125`),
  fourWeeksLeftButtonPurchasing: (page) => page.locator(`#root_mashupcontainer-3_mashupcontainer-62_ptcsbutton-127-bounding-box`),
  allButtonPurchasing: (page) => page.locator(`#root_mashupcontainer-3_mashupcontainer-62_ptcsbutton-126-bounding-box`),
  allButtonSupplier: (page) => page.locator(`#root_mashupcontainer-3_mashupcontainer-62_ptcsbutton-599-bounding-box`),
  overDueButtonSupplier: (page) => page.locator(`#root_mashupcontainer-3_mashupcontainer-62_ptcsbutton-604-bounding-box`),
  fourWeeksLeftButtonSupplier: (page) => page.locator(`#root_mashupcontainer-3_mashupcontainer-62_ptcsbutton-600-bounding-box`),

  acceptCancellationRequestButtonListPageSupplier: (page, label = dynamicValues.acceptCancellationButtonNameSupplier) => page.getByLabel(label, { exact: true }).first(),

  backButtonDetailsPageSupplier: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsbutton-514"),
  backButtonDetailsPagePurchasing: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsbutton-651-bounding-box"),

  revisionRequestButtonDetailsPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsbutton-533-bounding-box"),
  revisionRequestButtonListPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_ptcsbutton-20"),

  continueButtonActaulDateDetailsPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_navigationfunction-404-popup_ptcsbutton-19"),
  continueButtonActaulDateListPage: (page) => page.getByRole("button", { name: "Continue" }),
  continueButtonImplementationVerficationDetailsPage: (page) => page.getByRole("button", { name: "Confirm" }),

  sendRequestButtonDetailsPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_navigationfunction-101-popup_ptcsbutton-24-bounding-box"),
  sendRequestButtonListPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-76-popup_ptcsbutton-24-bounding-box"),
  revisionRequestButtonPurchasingEnv: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsbutton-533-bounding-box"),
  declineRevReqDetailsPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_navigationfunction-158-popup_ptcsbutton-21-bounding-box"),
  forwardRevReqDetailsPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_navigationfunction-158-popup_ptcsbutton-20-bounding-box"),
  declineRevReqListPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_ptcsbutton-100-bounding-box"),
  popupDeclineRevReqListPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-105-popup_ptcsbutton-21-bounding-box"),
  forwardRevReqListPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_ptcsbutton-101-bounding-box"),
  popupForwardRevReqListPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-105-popup_ptcsbutton-20-bounding-box"),

  // Input fields
  searchBarPurchasing: (page) => page.getByLabel("Search with"),
  searchBarSupplier: (page) => page.getByLabel("Search with"),
  commentFieldRevReqDetailsPagePurchasing: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_navigationfunction-158-popup_flexcontainer-17-bounding-box"),
  commentFieldRevReqListPagePurchasing: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-105-popup_flexcontainer-17-bounding-box"),
  commentFieldRevReqDetailsPageSupplier: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_navigationfunction-101-popup_flexcontainer-46-bounding-box"),
  commentFieldRevReqListPageSupplier: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-76-popup_ptcstextarea-22-bounding-box"),
  commentFieldAcceptListPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-238-popup_ptcstextarea-15-bounding-box #input"),
  dateFieldRevReqDetailsPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_navigationfunction-101-popup_ptcsdatepicker-38-bounding-box"),
  dateFieldRevReqListPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-76-popup_ptcsdatepicker-38-bounding-box"),
  dateFieldActualDateListPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-76-popup_ptcsdatepicker-38-bounding-box"),

  dateFieldActualDateDetailsPageMonth: (page) => page.locator("#currmonth #textbox #input"),
  dateFieldActualDateDetailsPageYear: (page) => page.locator("#curryear #textbox #input"),
  dayActaulDateDetailsPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsdatepicker-594-external-wc #days").getByText("14", { exact: true }),
  dateFieldNewIrListPage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_ptcsgrid-57-external-wc #datetext #textbox #input"),
  dateFieldNewIrListPage2: (page) => page.locator("#datetext #textbox #input"),

  // Notifications
  releaseSuccessMessageRevisionRequestPageSupplier: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-170-popup_ptcslabel-23-bounding-box").locator("#root #label"),
  releaseSuccessMessageOngoingPageListPageSupplier: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-204-popup_ptcslabel-23-bounding-box").locator("#root #label"),
  releaseSuccessMessageOngoingPageDetailsPageSupplier: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-204-popup_ptcslabel-23-bounding-box").locator("#root #label"),
  declinedSuccessMessageRevisionRequestPagePurchasing: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-135-popup_ptcslabel-23-bounding-box").locator("#root #label"),
  releaseinProgressMessage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-157-popup_flexcontainer-21").locator("#root #label"),
  releaseSuccessMessage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-157-popup_flexcontainer-21").locator("#root #label"),
  acceptSuccessMessage: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-195-popup_flexcontainer-21").locator("#root #label"),
  messageNewIrSupplierList: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-195-popup_ptcslabel-23-bounding-box").locator("#root #label"),
  messageOngoingInvalidActualDateListPageSupplier: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-204-popup_ptcslabel-23-bounding-box").locator("#root #label"),
  errorMessageOngoingInvalidActualDateDetailsPageSupplier: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_navigationfunction-325-popup_ptcslabel-23-bounding-box").locator("#root #label"),
  messageOngoingInvalidActualDateDetailsPageSupplier: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-204-popup_flexcontainer-22").locator("#root #label"),
  messageCancellationRequestAcceptingCancellationReqListPageSupplier: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-181-popup_ptcslabel-23-bounding-box").locator("#root #label"),
  messageRevisionRequestListPagePurchasing: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_navigationfunction-135-popup_ptcslabel-23-bounding-box").locator("#root #label"),

  // Tables
  irTable: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_ptcsgrid-57 ptcs-v-scroller2"),
  irRows: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_ptcsgrid-57 ptcs-v-scroller2").locator(`ptcs-div[part="row"]`),
  irColumn: (page, i) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_ptcsgrid-57 ptcs-v-scroller2").locator(`ptcs-div[part="row"]`).nth(i).locator("ptcs-div.cell"),
  irFirstRow: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_ptcsgrid-57 ptcs-v-scroller2").locator(`ptcs-div[part="row"]`).first(),
  irColumnForFirstRow: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_ptcsgrid-57 ptcs-v-scroller2").locator(`ptcs-div[part="row"]`).first().locator("ptcs-div.cell"),

  partStructureTable: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsgrid-6 ptcs-v-scroller2"),
  partStructureRowsPurchasing: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsgrid-6 ptcs-v-scroller2").locator(`ptcs-div[part="row"]`),

  partStructureRowsSupplier: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_ptcsgrid-185 ptcs-v-scroller2").locator(`ptcs-div[part="row"]`),

  connectedItemsTable: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_mashupcontainer-20_ptcsgrid-3 ptcs-core-grid#grid ptcs-v-scroller2#chunker"),
  connectedItemsRows: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_mashupcontainer-20_ptcsgrid-3 ptcs-core-grid#grid ptcs-v-scroller2#chunker").locator(`ptcs-div[part="row"]`),

  classificationAttributesTable: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_mashupcontainer-21_ptcsgrid-14 ptcs-core-grid#grid ptcs-v-scroller2#chunker"),
  classificationAttributesRows: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_mashupcontainer-21_ptcsgrid-14 ptcs-core-grid#grid ptcs-v-scroller2#chunker").locator(`ptcs-div[part="row"]`),

  generalAttributesTable: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_mashupcontainer-21_ptcsgrid-15 ptcs-core-grid#grid ptcs-v-scroller2#chunker"),
  generalAttributesRows: (page) => page.locator("#root_mashupcontainer-3_mashupcontainer-62_mashupcontainer-35_mashupcontainer-21_ptcsgrid-15 ptcs-core-grid#grid ptcs-v-scroller2#chunker").locator(`ptcs-div[part="row"]`),
};
