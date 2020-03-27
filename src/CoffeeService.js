const helpers = require('./helpers');

class CoffeeService {
    constructor() {
        this.authToken = undefined;
        this.myCoffees = undefined;
        this.userData = undefined;
        this.orderID = undefined;
        this.getAuthToken();
    }

    getAuthToken = async () => {
        const tokenDecimal = await apiComms.authenticate();
        const tokenBASE64 = helpers.toBASE64(tokenDecimal);
        this.authToken = tokenBASE64;
    };

    getUserData = async () => {
        this.userData = await apiComms.getUserData(tokenBASE64);
        this.orderID = this.userData.start.order_ids[0];
    };

    changeOrderDate = async date => {
        const requestedDate = helpers.handleDateInput(date);
        await apiComms.changeDate(tokenBASE64, orderID, requestedDate);
    };

    displayRatedCoffees = async () => {
        this.myCoffees = await apiComms.getMyCoffees(tokenBASE64);
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

    // getFullCoffeeData = async () => {
    //     //const coffeeData = await apiComms.getCoffeeData(tokenBASE64)
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
