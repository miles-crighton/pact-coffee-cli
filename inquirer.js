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
                    if (value.length) {
                        return true;
                    } else {
                        return 'Enter a new delivery date:';
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