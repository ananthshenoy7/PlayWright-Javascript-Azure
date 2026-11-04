const {expect} = require('@playwright/test');
// Import the custom test fixture
const {customtest}=require("../utils/fixtures.js");


// Use the custom test fixture for authenticated page and test data
customtest("@Web Fixtures demo", async({authenticatedPage, createOrder, testDataForOrder}) => {

    await authenticatedPage.goto("https://rahulshettyacademy.com/client/");
    await authenticatedPage.locator("button[routerlink*='myorders']").click();
    await authenticatedPage.locator("tbody").waitFor();
    await expect(authenticatedPage.getByText(createOrder.orderId)).toBeVisible();
    console.log(testDataForOrder.productName);

});