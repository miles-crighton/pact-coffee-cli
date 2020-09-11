const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const chalk = require('chalk');

const inquirer = require('./inquirer');

const CoffeeMaker = require('./CoffeeMaker');

exports.changeDate = async function (date) {
    const CoffeeMakerInstance = new CoffeeMaker();
    await CoffeeMakerInstance.authenticate();
    await CoffeeMakerInstance.getUserData();
    await CoffeeMakerInstance.changeOrderDate(date);
    await CoffeeMakerInstance.cleanup();
};

exports.dispatchWhen = async function () {
    const CoffeeMakerInstance = new CoffeeMaker();
    await CoffeeMakerInstance.authenticate();
    await CoffeeMakerInstance.getUserData();
    await CoffeeMakerInstance.displayOrderStatus();
    await CoffeeMakerInstance.cleanup();
};

exports.main = async function main() {
    try {
        const CoffeeMakerInstance = new CoffeeMaker();
        await CoffeeMakerInstance.authenticate();
        await CoffeeMakerInstance.getUserData();
        await CoffeeMakerInstance.displayOrderStatus();

        let answers;
        let running = true;
        while (running) {
            answers = await inquirer.askOptions();
            switch (answers.optionSelection) {
                case 'Change delivery date':
                    await CoffeeMakerInstance.changeOrderDate(answers.date);
                    break;
                case 'View order history':
                    await CoffeeMakerInstance.displayOrderHistory();
                    break;
                case 'Display rated coffees':
                    await CoffeeMakerInstance.displayRatedCoffees();
                    break;
                case 'Exit':
                    await CoffeeMakerInstance.cleanup();
                default:
                    running = false;
                    break;
            }
        }
    } catch (e) {
        console.log(chalk.red(e));
    }
};
