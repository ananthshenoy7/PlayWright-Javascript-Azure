const { test, expect, request } = require('@playwright/test');
const fakePayLoadOrders = { data: [], message: "No Orders" };
require('dotenv').config();

//API payloads
const loginPayload = {
  userEmail: process.env.ADMIN_USERNAME, userPassword: process.env.ADMIN_PASSWORD
};
const orderPayload = { orders: [{ country: "Cuba", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
//Variables to store token and order ID
let token;
let orderID;

test.beforeAll(async () =>

//Login API call to get the token and place order API call to get the order ID
{
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login',
        {
            data: loginPayload
        })

    //Check if the login response is successful
    expect(loginResponse.ok()).toBeTruthy();

    //Extract token from login response
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    
    //Place order API call to get the order ID
    const orderResponse = await apiContext.post('https://rahulshettyacademy.com/api/ecom/order/create-order',
        {
            data: orderPayload,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },


        })

    const orderResponseJson = await orderResponse.json();
    orderID = orderResponseJson.orders[0];

});

test('@API Place Order', async ({ page }) =>

//Set the token in local storage to simulate logged-in state 
{
    await page.addInitScript(value => {

        window.localStorage.setItem('token', value);

    }, token);

    await page.goto("https://rahulshettyacademy.com/client/");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            //Intercept the request and fulfill it with a fake payload
            const response = await page.request.fetch(route.request());

            //Convert the fake payload to Json and fulfill the request with it
            let body = JSON.stringify(fakePayLoadOrders);
            route.fulfill(
                {
                    response,
                    body,


                });
        });

    //Click on orders at the top section
    await page.locator("button[routerlink*='myorders']").click();
    //Wait for the response to the intercepted request
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    await expect(page.locator(".mt-4")).toHaveText("You have No Orders to show at this time. Please Visit Back Us");

});