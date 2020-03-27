const helpers = require('./helpers');
const chalk = require('chalk');
const APIInterface = require('./pactAPIInterface');

class CoffeeService {
    constructor() {
        this.authToken = undefined;
        this.myCoffees = undefined;
        s;
        this.userData = undefined;
        this.orderID = undefined;
        this.getAuthToken();
    }

    getAuthToken = async () => {
        const tokenDecimal = await APIInterface.authenticate();
        if (!tokenDecimal) {
            throw new Error('No token recieved');
        }
        const tokenBASE64 = helpers.toBASE64(tokenDecimal);
        console.log(chalk.green('Authentication successful.'));
        this.authToken = tokenBASE64;
        this.getUserData();
    };

    getUserData = async () => {
        this.userData = await APIInterface.getUserData(tokenBASE64);
        if (!userData) {
            throw new Error('Unable to retrive user data');
        }
        this.orderID = this.userData.start.order_ids[0];
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

module.exports.CoffeeService = CoffeeService;
