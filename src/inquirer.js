const inquirer = require('inquirer');

module.exports = {
    askOptions: (coffeeTypes = []) => {
        const questions = [
            {
                name: 'optionSelection',
                type: 'list',
                message: 'Select an action:',
                choices: ['Change delivery date', 'Cancel action']
            },
            {
                name: 'date',
                type: 'input',
                message: 'Enter a new delivery date:',
                when: function(answers) {
                    return answers.optionSelection === 'Change delivery date'
                },
                validate: function (value) {
                    if (validateNewDate(value)) {
                        return true;
                    } else {
                        return 'Unable to read date format, please try again:';
                    }
                }
            },
            {
                name: 'coffeeType',
                type: 'list',
                message: 'Select a new coffee:',
                choices: coffeeTypes,
                when: function(answers) {
                    return answers.optionSelected === 'Change coffee type'
                } 
            }
        ];
        return inquirer.prompt(questions)
    },
    askPactCredentials: () => {
        const questions = [
            {
                name: 'email',
                type: 'input',
                message: 'Please enter your Pact email:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a valid email:'
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                messsage: 'Please enter your Pact password',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a valid password:'
                    }
                }
            }
        ]
        return inquirer.prompt(questions)
    }
};



const validateNewDate = (date) => {
    const regexDate = /^\d{2}\/\d{2}\/\d{4}$/g;
    const regexShorthand = /^\d{1,2}[dw]$/g;
    Date.prototype.isValid = function () {
        // An invalid date object returns NaN for getTime() and NaN is the only
        // object not strictly equal to itself.
        return this.getTime() === this.getTime();
    };  

    if (regexDate.test(date)) {
        let dateSplit = date.split('/');
        d = new Date(dateSplit[1] + '/' + dateSplit[0] + '/' + dateSplit[2]);
        return d.isValid()
    }
    return regexShorthand.test(date)
};