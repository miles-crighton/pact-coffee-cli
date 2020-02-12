require('dotenv').config()
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

function toBASE64(str) {
    return Buffer.from(str).toString('base64') + '=='
};

function displayHeader() {
    clear();
    console.log(
        chalk.yellow(
            figlet.textSync('Pact CLI', { horizontalLayout: 'fitted' })
        )
    );
}

function reverseDate(date, oldDelimiter='-', newDelimiter='-') {
    const dateArray = date.split(oldDelimiter);
    return dateArray[2] + newDelimiter + dateArray[1] + newDelimiter + dateArray[0]
}

function displayOrderStatus(orderData) {
    const coffeeName = orderData.entities[0].name;
    const dispatchDate = orderData.orders[0].dispatch_on;
    console.log(chalk.yellow('Your order of'),
        chalk.red(coffeeName),
        chalk.yellow('will be dispatched on'),
        chalk.red(reverseDate(dispatchDate, '-', '/'))
    );
}

const inquirer = require('./inquirer');

// const getNewDate = async () => {
//     const date = await inquirer.askOptions();
//     console.log(date);
//     //console.log(reverseDate(date.Date, '/', '-'))
// };

// getNewDate()

const CLI = require('clui');
const Spinner = CLI.Spinner;

const apiComms = require('./apiComms');

async function main() {
    try {
        displayHeader()

        const status = new Spinner('Authenticating you, please wait... ☕');

        status.start();
        const tokenDecimal = await apiComms.authenticate();
        const tokenBASE64 = toBASE64(tokenDecimal);
        status.stop();

        displayHeader()
        console.log(chalk.green('Authentication successful. 👍'));

        //Get info
        const data = await apiComms.getData(tokenBASE64);
        const orderID = data.start.order_ids[0];
        console.log(data)
        displayOrderStatus(data)

        const answers = await inquirer.askOptions();
        console.log(answers)

        // const date = '2020-03-20'
        if (answers.date) await apiComms.changeDate(tokenBASE64, orderID, reverseDate(answers.date,'/','-'))
        // 

        apiComms.deauthenticate(tokenBASE64);
        //=> '<!doctype html> ...'
    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
};

main();