const {test,expect} = require('@playwright/test');

test('@Web Handle Table', async ({ page }) => {

    await page.goto('https://testautomationpractice.blogspot.com');

    const table = page.locator('table[id="productTable"]');

    const columns = await table.locator('thead tr th');

    console.log('Number of columns:', await columns.count());

    const rows = await table.locator('tbody tr');

    console.log('Number of rows:', await rows.count());

const pages = await page.locator('#pagination li a');

for(let p= 0; p < await pages.count(); p++) {

    if(p>0){

        await pages.nth(p).click();
    }

    for(let i = 0; i < await rows.count(); i++) {

        const column=rows.nth(i).locator('td');

        for(let j = 0; j < await column.count(); j++) {

        console.log(await column.nth(j).textContent());

        }}
    }






});