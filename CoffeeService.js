const helpers = require('./helpers');

class CoffeeService {
    constructor() {
        this.authToken = undefined;
        this.myCoffees = undefined;
        this.getAuthToken();
    }

    getAuthToken = async () => {
        const tokenDecimal = await apiComms.authenticate();
        const tokenBASE64 = helpers.toBASE64(tokenDecimal);
        this.authToken = tokenBASE64;
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
        const userData = await apiComms.getUserData(tokenBASE64);
        const orderID = userData.start.order_ids[0];
        helpers.displayOrderStatus(userData);
    };
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
