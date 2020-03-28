const helpers = require('./helpers');
const chalk = require('chalk');
const APIInterface = require('./pactAPIInterface');
const inquirer = require('./inquirer');

const CLI = require('clui');
const Spinner = CLI.Spinner;

//Classes are ES6, precompile or set prototypes.
class CoffeeMaker {
    constructor() {
        this.authToken = undefined;
        this.myCoffees = undefined;
        this.userData = undefined;
        this.orderID = undefined;
    }

    authenticate = async () => {
        const credentials = await checkCredentials();
        const msg = 'Authenticating you, please wait... ☕';

        const tokenDecimal = await statusWrapper(
            msg,
            APIInterface.getAuthToken,
            credentials
        );
        if (!tokenDecimal) {
            throw new Error('No token recieved');
        }
        const tokenBASE64 = helpers.toBASE64(tokenDecimal);
        console.log(chalk.green('Authentication successful.'));
        this.authToken = tokenBASE64;
    };

    getUserData = async () => {
        try {
            this.userData = await APIInterface.getUserData(this.authToken);
            if (!userData) {
                throw new Error('Unable to retrive user data');
            }
            this.orderID = this.userData.start.order_ids[0];
        } catch (e) {
            console.log(e);
        }
    };

    changeOrderDate = async date => {
        const requestedDate = helpers.handleDateInput(date);
        await APIInterface.changeDate(tokenBASE64, orderID, requestedDate);
    };

    displayRatedCoffees = async () => {
        this.myCoffees = await APIInterface.getMyCoffees(tokenBASE64);
        const myCoffeeRatings = generateRatedCoffees(
            filterNullCoffees(this.myCoffees)
        );

        Object.keys(myCoffeeRatings).forEach(coffeeName => {
            if (myCoffeeRatings[coffeeName]) {
                console.log(chalk.green(`${coffeeName}: 👍`));
            } else {
                console.log(chalk.red(`${coffeeName}: 👎`));
            }
        });
    };

    displayOrderStatus = async () => {
        helpers.displayOrderStatus(userData);
    };

    cleanup = async () => {
        await APIInterface.deauthenticate(this.authToken);
    };

    // getFullCoffeeData = async () => {
    //     //const coffeeData = await APIInterface.getCoffeeData(tokenBASE64)
    //     //const available = helpers.filterAvailableCoffees(coffeeData)
    // };
}

const filterNullCoffees = coffees => {
    return coffees.filter(coffee => {
        return coffee.rating !== null;
    });
};

const generateRatedCoffees = coffees => {
    const coffeeRatings = {};
    coffees.forEach(coffee => {
        coffeeRatings[coffee.name] = coffee.rating;
    });
    return coffeeRatings;
};

checkCredentials = async () => {
    let credentials = {
        email: process.env.CREDS_EMAIL,
        password: process.env.CREDS_PASSWORD,
    };
    if (!credentials.email || !credentials.password) {
        credentials = await inquirer.askPactCredentials();
        writeEnvFile(credentials.email, credentials.password);
    }
    return credentials;
};

statusWrapper = async (msg = 'Loading, please wait...', func, ...args) => {
    const status = new Spinner(msg);
    status.start();
    const response = await func(...args);
    status.stop();
    return response;
};

module.exports = CoffeeMaker;
