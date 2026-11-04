require('dotenv').config(); // <-- Move this to line 1
const base = require('@playwright/test');

const loginPayload={userEmail:process.env.ADMIN_USERNAME, userPassword:process.env.ADMIN_PASSWORD};
const orderPayLoad = {orders:[{country:"Cuba",productOrderedId:"6960eac0c941646b7a8b3e68"}]};
const {APIUtils} = require('../utils/APIUtils');
const {request} = require('@playwright/test');

// Custom test fixture for authenticated page
exports.customtest = base.test.extend(

    {
        // 
        authenticatedPage: async ({ browser }, use) => {

            const context = await browser.newContext();
            const page = await context.newPage();
            await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
            await page.locator("#userEmail").fill(process.env.ADMIN_USERNAME);
            await page.locator("#userPassword").fill(process.env.ADMIN_PASSWORD);
            await page.locator("[value='Login']").click();
            await page.waitForLoadState('networkidle');
            
            await use(page);

            //tear down

            await context.close();

        },

        createOrder : async ({}, use) => 
            {

            const apiContext = await request.newContext();
            const apiUtils = new APIUtils(apiContext,loginPayload);
            const response =  await apiUtils.createOrder(orderPayLoad);
            await use(response);
            await apiContext.dispose();

            },

        // Test data for order
        testDataForOrder: {

            productName: "ZARA COAT 3"
        }


    });