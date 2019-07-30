const CREDS = require('./creds')

async function main() {
    try {
        const puppeteer = require('puppeteer');
        
        const browser = await puppeteer.launch({ headless: false });

        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 720 })
        await page.goto('https://www.pactcoffee.com/login', { waitUntil: 'networkidle0' }); // wait until page load
        await page.type('#forminput1', CREDS.username);
        await page.type('#forminput2', CREDS.password);
        page.keyboard.press('Enter');

        //Wait for navigation to new route
        await page.waitForSelector('[name="asap"]')
        const asapSpan = await page.$('[name="asap"]');
        //Get span's parent
        const asapButton = (await asapSpan.$x('..'))[0];
        //Order asap
        asapButton.click()
    } catch (err) {
        console.error(err);
    }
    //await page.waitForNavigation();
}

main();