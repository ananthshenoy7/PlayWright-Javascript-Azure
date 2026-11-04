const base = require('@playwright/test');
require('dotenv').config();

exports.customtest = base.test.extend(
    {
        testDataForOrder: {
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
            productName: "ZARA COAT 3"
        }


    }
)