const clear = require('clear');
const chalk = require('chalk');

module.exports = {
    toBASE64: (str) => {
        return Buffer.from(str).toString('base64') + '==';
    },
    handleDateInput: (dateInput) => {
        const regexDate = /^\d{2}\/\d{2}\/\d{4}$/g;
        const regexShorthand = /^\d{1,2}[dw]$/g;
        let dispatchDateObj;

        if (regexDate.test(dateInput)) {
            dispatchDateObj = module.exports.convertFullDate(dateInput);
        } else if (regexShorthand.test(dateInput)) {
            dispatchDateObj = module.exports.convertShorthandDate(dateInput);
        } else {
            throw Error('Unexpected date format');
        }

        dispatchDateObj = module.exports.handleWeekend(dispatchDateObj);

        return module.exports.formatDateObj(dispatchDateObj);
    },
    convertFullDate: (dateInput) => {
        const dateSplit = dateInput.split('/');
        const dateObj = new Date(
            dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2]
        );
        return dateObj;
    },
    convertShorthandDate: (dateInput) => {
        let quantity = parseInt(dateInput.match(/\d+/g)[0]);
        const increment = dateInput.match(/[dw]/g)[0];
        const dispatchDateObj = new Date();

        //Requested increment is in weeks
        if (increment === 'w') {
            quantity *= 7;
        }
        dispatchDateObj.setDate(dispatchDateObj.getDate() + quantity);

        return dispatchDateObj;
    },
    formatDateObj: (dateObj) => {
        const dd = ('0' + dateObj.getDate()).slice(-2);
        const mm = ('0' + (dateObj.getMonth() + 1)).slice(-2);
        const y = dateObj.getFullYear();

        return (formattedDate = y + '-' + mm + '-' + dd);
    },
    handleWeekend: (dateObj) => {
        let quantity = 0;
        const copiedDateObj = new Date(dateObj.getTime());
        //getDay returns day of the week 0-6 (sat-sun)
        switch (copiedDateObj.getDay()) {
            case 0:
                quantity++;
                break;
            case 6:
                quantity--;
                break;
        }
        if (quantity !== 0) {
            console.log(
                chalk.red(
                    'Requested date was a weekend, adjusting dispatch date.'
                )
            );
        }
        copiedDateObj.setDate(copiedDateObj.getDate() + quantity);
        return copiedDateObj;
    },
    reverseDate: (date, oldDelimiter = '-', newDelimiter = '-') => {
        const dateArray = date.split(oldDelimiter);
        return (
            dateArray[2] +
            newDelimiter +
            dateArray[1] +
            newDelimiter +
            dateArray[0]
        );
    },
    displayOrderStatus: (orderData) => {
        const coffeeName = orderData.entities[0].name;
        const dispatchDate = orderData.orders[0].dispatch_on;
        console.log(
            chalk.yellow('Your order of'),
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
        console.log(coffeeData.length);
        let availableCoffees = coffeeData.filter((value) => {
            return (
                value.can_purchase &&
                value.product_type === 'bag' &&
                value.pioneer_price === '7.95'
            );
        });

        console.log(availableCoffees);
        console.log(availableCoffees.length);
        return availableCoffees;
    },
};
