require('dotenv').config()
const chalk = require('chalk');
const CLI = require('clui');
const inquirer = require('./inquirer');
const apiComms = require('./apiComms');
const helpers = require('./helpers')

const Spinner = CLI.Spinner;

async function main() {
    try {
        helpers.displayHeader()

        const status = new Spinner('Authenticating you, please wait... ☕');

        status.start();
        const tokenDecimal = await apiComms.authenticate();
        const tokenBASE64 = helpers.toBASE64(tokenDecimal);
        status.stop();

        helpers.displayHeader()
        console.log(tokenDecimal)
        console.log(tokenBASE64)
        console.log(chalk.green('Authentication successful. 👍'));

        const userData = await apiComms.getUserData(tokenBASE64);
        const orderID = userData.start.order_ids[0];
        //const coffeeData = await apiComms.getCoffeeData(tokenBASE64)
        //const available = helpers.filterAvailableCoffees(coffeeData)
        helpers.displayOrderStatus(userData)

        const answers = await inquirer.askOptions();
        if (answers.date) await apiComms.changeDate(tokenBASE64, orderID, helpers.reverseDate(answers.date,'/','-'));
        //if (answers.coffee) await apiComms.changeCoffee(tokenBASE64, orderID, item, answers.coffee)

        apiComms.deauthenticate(tokenBASE64);
    } catch (error) {
        console.log(error);
    }
};

main();

