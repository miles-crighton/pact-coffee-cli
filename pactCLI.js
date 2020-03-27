const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const chalk = require('chalk');

const inquirer = require('./inquirer');
const apiComms = require('./apiComms');
const helpers = require('./helpers');

async function main() {
    try {
        helpers.displayHeader();

        const tokenDecimal = await apiComms.authenticate();
        const tokenBASE64 = helpers.toBASE64(tokenDecimal);

        helpers.displayHeader();
        console.log(chalk.green('Authentication successful.'));

        const userData = await apiComms.getUserData(tokenBASE64);
        const orderID = userData.start.order_ids[0];
        //const coffeeData = await apiComms.getCoffeeData(tokenBASE64)
        //const available = helpers.filterAvailableCoffees(coffeeData)
        helpers.displayOrderStatus(userData);

        const answers = await inquirer.askOptions();
        if (answers.date) {
            const requestedDate = helpers.handleDateInput(answers.date);
            await apiComms.changeDate(tokenBASE64, orderID, requestedDate);
        }
        //if (answers.coffee) await apiComms.changeCoffee(tokenBASE64, orderID, item, answers.coffee)

        apiComms.deauthenticate(tokenBASE64);
    } catch (error) {
        console.log(error);
    }
}

main();
