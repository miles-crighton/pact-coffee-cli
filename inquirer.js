const inquirer = require('inquirer');

module.exports = {
    askOptions: () => {
        const questions = [
            {
                name: 'optionSelection',
                type: 'list',
                message: 'Select an action:',
                choices: ['Change delivery date', 'Change coffee type']
            },
            {
                name: 'Date',
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
        ];
        return inquirer.prompt(questions)
    },
};