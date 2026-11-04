const ExcelJs = require('exceljs');
const { test, expect } = require('@playwright/test');


async function writeExcelTest(searchText, replaceText, change, filepath) {

    const workbook = new ExcelJs.Workbook();
    await workbook.xlsx.readFile(filepath);
    const worksheet = workbook.getWorksheet('Sheet1');
    const output = readExcelTest(worksheet, searchText);

    const cell = worksheet.getCell(output.row, output.column + change.colChange);
    cell.value = replaceText;
    await workbook.xlsx.writeFile(filepath);
}

function readExcelTest(worksheet, searchText) {
    let output = { row: -1, column: -1 };

    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            if (cell.value === searchText) {

                output.row = rowNumber;
                output.column = colNumber;

            }
        });


    });

    return output;
}
//writeExcelTest("Kivi", 350, { rowChange: 0, colChange: 2 }, "/Users/ananthshenoy/Downloads/Book1.xlsx");

test('@Web Upload donwload excel validation', async ({ page }) => {

    const textSearch = 'Mango';
    const updateValue = '350';

    await page.goto('https://rahulshettyacademy.com/upload-download-test/index.html');

    //Wait for the file to download in the local
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download' }).click();
    await downloadPromise;

    const filePath = '/Users/ananthshenoy/downloads/Book1.xlsx';

    await writeExcelTest(textSearch, updateValue, { rowChange: 0, colChange: 2 }, filePath);

    await page.locator("#fileinput").click();

    //Handle window based pop up in Playwright
    await page.locator('#fileinput').setInputFiles(filePath);

    const textlocator = page.getByText(textSearch);

    const desiredRow = await page.getByRole('row').filter({ has: page.getByText(textSearch) });
    await expect(desiredRow.locator('#cell-4-undefined')).toContainText(updateValue);

});