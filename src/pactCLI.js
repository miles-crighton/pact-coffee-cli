const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const chalk = require('chalk');

const inquirer = require('./inquirer');
const helpers = require('./helpers');

const CoffeeMaker = require('./CoffeeMaker');

async function main() {
    try {
        helpers.displayHeader();
        const CoffeeMakerInstance = new CoffeeMaker();
        await CoffeeMakerInstance.authenticate();
        helpers.displayHeader();
        await CoffeeMakerInstance.getUserData();
        await CoffeeMakerInstance.displayOrderStatus();

        let answers;
        let running = true;
        while (running) {
            answers = await inquirer.askOptions();
            console.log(answers);
            switch (answers.optionSelection) {
                case 'Change delivery date':
                    await CoffeeMakerInstance.changeOrderDate(answers.date);
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
        console.log(e);
    }
}

main();
