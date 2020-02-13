const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');

module.exports = {
    toBASE64: (str) => {
        return Buffer.from(str).toString('base64') + '=='
    },
    displayHeader: () => {
        clear();
        console.log(
            chalk.yellow(
                figlet.textSync('Pact CLI', { horizontalLayout: 'fitted' })
            )
        );
    },
    reverseDate: (date, oldDelimiter = '-', newDelimiter = '-') => {
        const dateArray = date.split(oldDelimiter);
        return dateArray[2] + newDelimiter + dateArray[1] + newDelimiter + dateArray[0]
    },
    displayOrderStatus: (orderData) => {
        const coffeeName = orderData.entities[0].name;
        const dispatchDate = orderData.orders[0].dispatch_on;
        console.log(chalk.yellow('Your order of'),
            chalk.red(coffeeName),
            chalk.yellow('☕ will be dispatched on'),
            chalk.red(module.exports.reverseDate(dispatchDate, '-', '/'))
        );
    },
    filterAvailableCoffees: (coffeeData) => {
        /**
         * @param {array} coffeeData        List of coffee objects
         * @return {array} availableCoffees  List of available coffees
         */
        console.log(coffeeData.length)
        let availableCoffees = coffeeData.filter((value) => {
            return value.can_purchase && value.product_type === 'bag' && value.pioneer_price === '7.95'
        });

        console.log(availableCoffees)
        console.log(availableCoffees.length)
        return availableCoffees
    }
}
