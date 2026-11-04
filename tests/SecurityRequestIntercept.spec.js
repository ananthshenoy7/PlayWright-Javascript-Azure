const {test,expect} = require('@playwright/test');
require('dotenv').config();

test('@API Security test request intercept', async ({page})=>{

await page.goto('https://rahulshettyacademy.com/client/');
await page.locator("#userEmail").fill(process.env.ADMIN_USERNAME);
await page.locator("#userPassword").fill(process.env.ADMIN_PASSWORD);
await page.locator("[value='Login']").click();
await page.waitForLoadState('networkidle');
await page.locator(".card-body b").first().waitFor();

await page.locator("button[routerlink*='myorders']").click();

//Intercept the request and modify the order ID in the URL to simulate unauthorized access
await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",

    //continue the request with a modified URL to simulate unauthorized access
    route => route.continue({url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6'}))

    await page.locator("button:has-text('View')").first().click();

    //Verify that the error message is displayed for unauthorized access
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");

})