const helpers = require('./helpers');
const chalk = require('chalk');
const APIInterface = require('./pactAPIInterface');
const inquirer = require('./inquirer');
const fs = require('fs');
const path = require('path');
const envfile = require('envfile');
const moment = require('moment');

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
            //console.log(chalk.green('Authentication successful.'));
        } catch (e) {
            console.log(chalk.red(e));
        }
    };

    getUserData = async () => {
        try {
            if (!this.authToken) {
                throw new Error(
                    'Need to be authenticated first, try calling authenticate()'
                );
            }
            this.userData = await APIInterface.getUserData(this.authToken);
            if (!this.userData) {
                throw new Error('Unable to retrive user data');
            }
            this.orderID = this.userData['start']['order_ids'][0];
        } catch (e) {
            console.log(chalk.red(e));
        }
    };

    changeOrderDate = async (date) => {
        try {
            const requestedDate = helpers.handleDateInput(date);
            const newDispatchDate = await APIInterface.changeDispatchDate(
                this.authToken,
                this.orderID,
                requestedDate
            );
            console.log(
                chalk.green(
                    `Order dispatch date successfully changed to ${newDispatchDate}. 👍`
                )
            );
        } catch (e) {
            console.log(chalk.red(e));
        }
    };

    displayRatedCoffees = async () => {
        //Use cached coffee ratings if possible
        //Need to make sure data not stale when adding a change coffee rating feature
        if (!this.myCoffees) {
            this.myCoffees = await APIInterface.getMyCoffees(this.authToken);
        }
        const myCoffeeRatings = generateRatedCoffees(
            filterNullCoffees(this.myCoffees)
        );

        Object.keys(myCoffeeRatings).forEach((coffeeName) => {
            if (myCoffeeRatings[coffeeName]) {
                console.log(chalk.green(`${coffeeName}: 👍`));
            } else {
                console.log(chalk.red(`${coffeeName}: 👎`));
            }
        });
    };

    displayOrderStatus = async () => {
        try {
            if (!this.userData) {
                throw new Error(
                    'No user data found, try calling getUserData()'
                );
            }
            const coffeeName = this.userData.entities[0]['name'];
            const dispatchDate = this.userData.orders[0]['dispatch_on'];
            console.log(
                chalk.yellow('Your order of'),
                chalk.red(coffeeName),
                chalk.yellow('☕ will be dispatched on'),
                chalk.red(helpers.reverseDate(dispatchDate, '-', '/'))
            );
        } catch (e) {
            console.log(chalk.red(e));
        }
    };

    displayOrderHistory = async () => {
        try {
            if (!this.authToken) {
                throw new Error(
                    'No auth token found, try calling authenticate()'
                );
            }
            const orderHistory = await APIInterface.getOrderHistory(
                this.authToken
            );

            if (orderHistory) {
                let slicedOrderHistory = orderHistory['orders'];
                if (slicedOrderHistory.length > 5) {
                    slicedOrderHistory = orderHistory['orders'].slice(0, 5);
                }

                console.log(
                    chalk.white.bold(
                        `Last ${slicedOrderHistory.length} orders:`
                    )
                );

                for (let order of slicedOrderHistory) {
                    let coffeeItem = orderHistory.items.filter(
                        (item) => item.id === order.item_ids[0]
                    );
                    if (coffeeItem) {
                        coffeeItem = coffeeItem[0];
                        const orderStatus = order['current_state'];

                        console.log(
                            chalk.white.bold(
                                `${moment(
                                    order.dispatch_on,
                                    'YYYY-MM-DD'
                                ).format('Do MMM YYYY')}: `
                            ),
                            chalk.yellow(coffeeItem.product_name),
                            orderStatus === 'shipped'
                                ? chalk.green(
                                      `(Status: ${orderStatus.toUpperCase()} ✅)`
                                  )
                                : chalk.red(
                                      `(Status: ${orderStatus.toUpperCase()} ❌)`
                                  )
                        );
                    }
                }
            }
        } catch (e) {
            console.log(chalk.red(e));
        }
    };

    cleanup = async () => {
        await APIInterface.deauthenticate(this.authToken);
        //console.log(chalk.green('Successfully cleaned up!'));
    };

    // getFullCoffeeData = async () => {
    //     //const coffeeData = await APIInterface.getCoffeeData(tokenBASE64)
    //     //const available = helpers.filterAvailableCoffees(coffeeData)
    // };
}

const filterNullCoffees = (coffees) => {
    return coffees.filter((coffee) => {
        return coffee.rating !== null;
    });
};

const generateRatedCoffees = (coffees) => {
    const coffeeRatings = {};
    coffees.forEach((coffee) => {
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
    fs.writeFile(
        path.join(__dirname, '..', '.env'),
        envfile.stringifySync(parsedFile),
        function (err) {
            if (err) throw err;
            console.log(chalk.green('Credentials saved successfully.'));
        }
    );
};

module.exports = CoffeeMaker;
