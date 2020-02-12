const inquirer = require('inquirer');

module.exports = {
    askOptions: (coffeeTypes = ['To be added', 'To be added']) => {
        const questions = [
            {
                name: 'optionSelection',
                type: 'list',
                message: 'Select an action:',
                choices: ['Change delivery date', 'Change coffee type']
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
};