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
        try {
            const credentials = await checkCredentials();
            const msg = 'Authenticating you, please wait... ☕';

            const authToken = await statusWrapper(
                msg,
                APIInterface.getAuthToken,
                credentials
            );
            if (!authToken) {
                throw new Error('No token recieved');
            }
            this.authToken = authToken;
            console.log(chalk.green('Authentication successful.'));
        } catch (e) {
            console.log(e);
        }
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

writeEnvFile = (email, password) => {
    parsedFile = { CREDS_EMAIL: email, CREDS_PASSWORD: password };
    fs.writeFile('__dirname/.env', envfile.stringifySync(parsedFile), function(
        err
    ) {
        if (err) throw err;
        console.log(chalk.green('Credentials saved successfully.'));
    });
};

module.exports = CoffeeMaker;
