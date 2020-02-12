require('dotenv').config()
const got = require('got');
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const CREDS = { "email": process.env.CREDS_EMAIL, "password": process.env.CREDS_PASSWORD };

async function authenticate() {
    const response = await got.post('https://api.pactcoffee.com/v1/tokens/', { json: true, body: CREDS });
    if (response.statusCode === 201) { 
        const tokenID = response.body.token.id;
        console.log(chalk.green('\nAuthentication successful. 👍'));
        return tokenID
    } else {
        throw Error('Authentication unsuccessful')
    }
};

async function deauthenticate(authID) {
    //Id is base64
    const headers = { Authorization: `Basic ${authID}` }
    const response = await got.delete('https://api.pactcoffee.com/v1/tokens/me', { headers })
    if (response.statusCode === 204) {
        console.log(chalk.green('Deauthentication successful. 👍'));
    } else {
        console.log(chalk.red('Unable to deauthenticate. 👎'));
    }
};

async function getData(authID) {
    const headers = { Authorization: `Basic ${authID}` }
    const response = await got('https://api.pactcoffee.com/v1/users/me/start', { headers })
    if (response.statusCode === 200) {
        //console.log('Data retrieved: ', response.body)
        return JSON.parse(response.body)
    } else {
        console.log(chalk.red('Unable to retrieve data'));
    }
};

async function changeDate(authID, orderID, date) {
    const headers = { Authorization: `Basic ${authID}` }
    //TODO: veryify date format
    const options = { headers, json: true, body: { dispatch_on: date } }
    const response = await got.patch(`https://api.pactcoffee.com/v1/users/me/orders/${orderID}/`, options)
    if (response.statusCode === 200) {
        console.log(`Date successfully changed to ${date}`)
    } else {
        console.log('Unable to change date')
    }
};

function toBASE64(str) {
    return Buffer.from(str).toString('base64') + '=='
};

function displayHeader() {
    clear();
    console.log(
        chalk.yellow(
            figlet.textSync('Pact CLI', { horizontalLayout: 'full' })
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

const getNewDate = async () => {
    const date = await inquirer.askOptions();
    console.log(date);
    //console.log(reverseDate(date.Date, '/', '-'))
};

getNewDate()

const CLI = require('clui');
const Spinner = CLI.Spinner;

async function main() {
    try {
        displayHeader()

        const status = new Spinner('Authenticating you, please wait... ☕');

        status.start();
        const tokenDecimal = await authenticate();
        const tokenBASE64 = toBASE64(tokenDecimal);
        status.stop();

        displayHeader()
        console.log(chalk.green('Authentication successful. 👍'));

        //Get info
        const data = await getData(tokenBASE64);
        const orderID = data.start.order_ids[0];
        //console.log(data)
        displayOrderStatus(data)


        // const date = '2020-03-20'
        // await changeDate(tokenBASE64, orderID, date)

        deauthenticate(tokenBASE64);
        //=> '<!doctype html> ...'
    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
};

//main();