const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const chalk = require('chalk');

const inquirer = require('./inquirer');
const apiComms = require('./pactAPIInterface');
const helpers = require('./helpers');

// const CoffeeMaker = require('./CoffeeMaker');

async function main() {
    try {
        //@todo: Let this main function be a infinite loop for inquirer until exited
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

// async function mainTest() {
//     try {
//         helpers.displayHeader();
//         const CoffeeMakerInstance = new CoffeeMaker();
//         await CoffeeMakerInstance.authenticate();
//         helpers.displayHeader();
//         await CoffeeMakerInstance.getUserData();
//         console.log(CoffeeMakerInstance);
//         // while (true) {
//         //     helpers.displayHeader();
//         //     await CoffeeServiceInstance.displayOrderStatus();
//         //     await CoffeeServiceInstance.shutdown();
//         //     break;
//         // }
//     } catch (e) {
//         console.log(e);
//     }
// }

main();
