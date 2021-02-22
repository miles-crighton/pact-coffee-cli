const helpers = require('./helpers');
const chalk = require('chalk');
const APIInterface = require('./pactAPIInterface');
const moment = require('moment');
const auth = require('./auth');
const CLI = require('clui');
const Spinner = CLI.Spinner;

// Classes are ES6, precompile or set prototypes.
class CoffeeMaker {
    constructor() {
        this.authToken;
        this.myCoffees;
        this.userData;
        this.orderID;
        this.orderHistory;
    }

    authenticate = async () => {
        try {
            const credentials = await auth.getCredentials();
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
            console.log(
                chalk.red(
                    `We couldn't authenticate you with Pact's servers, try entering your credentials again below`
                )
            );
            await auth.requestCredentials();
            await this.authenticate();
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
            console.log(chalk.red(`Error getting user data: ${e}`));
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
            console.log(chalk.red(`Error changing order date: ${e}`));
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
            const coffeeName = this.userData.items[0]['product_name'];
            const dispatchDate = this.userData.orders[0]['dispatch_on'];
            console.log(
                chalk.yellow('Your order of'),
                chalk.red(coffeeName),
                chalk.yellow('☕ will be dispatched on'),
                chalk.red(helpers.reverseDate(dispatchDate, '-', '/'))
            );
        } catch (e) {
            console.log(chalk.red(`Error displaying order status: ${e}`));
        }
    };

    displayLastDispatched = async () => {
        if (!this.orderHistory) await this.getOrderHistory();

        const orderHistory = this.orderHistory;

        if (orderHistory) {
            let order = orderHistory['orders'][0];

            let coffeeItem = orderHistory.items.filter(
                (item) => item.id === order.item_ids[0]
            );

            if (coffeeItem) {
                coffeeItem = coffeeItem[0];
                const orderStatus = order['current_state'];

                let outputStr = '';

                const daysAgo = moment().diff(
                    moment(order.dispatch_on, 'YYYY-MM-DD'),
                    'days'
                );

                if (orderStatus === 'shipped') {
                    outputStr += chalk.yellow(
                        `Your last ${chalk.green(
                            `dispatched`
                        )} order was ${chalk.red(`${daysAgo} days ago`)}`
                    );

                    outputStr += chalk.white(
                        ` (${moment(order.dispatch_on, 'YYYY-MM-DD').format(
                            'Do MMM YYYY'
                        )} - ${coffeeItem.product_name})`
                    );
                } else {
                    outputStr += chalk.red(`Your last order failed to ship`);

                    outputStr += chalk.white(
                        ` (${moment(order.dispatch_on, 'YYYY-MM-DD').format(
                            'Do MMM YYYY'
                        )} - ${coffeeItem.product_name})`
                    );
                }

                console.log(outputStr);
            }
        }
    };

    getOrderHistory = async () => {
        try {
            if (!this.authToken) {
                throw new Error(
                    'No auth token found, try calling authenticate()'
                );
            }
            this.orderHistory = await APIInterface.getOrderHistory(
                this.authToken
            );
        } catch (e) {
            console.log(chalk.red(`Error getting order history: ${e}`));
        }
    };

    displayOrderHistory = async () => {
        try {
            if (!this.orderHistory) await this.getOrderHistory();

            let orderHistory = this.orderHistory;

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
            console.log(chalk.red(`Error displaying order history: ${e}`));
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

statusWrapper = async (msg = 'Loading, please wait...', func, ...args) => {
    const status = new Spinner(msg);
    status.start();
    const response = await func(...args);
    status.stop();
    return response;
};

module.exports = CoffeeMaker;
