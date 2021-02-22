var crypto = require('./crypto');
var inquirer = require('./inquirer');
var fs = require('fs');
var path = require('path');
var envfile = require('envfile');
var chalk = require('chalk');

// Utilities for storing/retrieving/requesting auth credentials
module.exports = {
    // If credentials exist locally in .env and password successfully decrypted return them,
    // else begin request question flow
    getCredentials: async function () {
        let credentials = {
            email: process.env.CREDS_EMAIL,
            password: process.env.CREDS_PASSWORD,
        };

        if (!credentials.email || !credentials.password) {
            return await this.requestCredentials();
        }

        try {
            credentials.password = await crypto.decrypt(credentials.password);
        } catch (e) {
            console.log(
                chalk.red(
                    `Error: Unable to retrieve your local credentials, please re-enter them below`
                )
            );
            return await this.requestCredentials();
        }

        return credentials;
    },
    // Begin a inquirer flow to request credentials via cli input
    requestCredentials: async function () {
        credentials = await inquirer.askPactCredentials();
        this.writeEnvFile(
            credentials.email,
            await crypto.encrypt(credentials.password)
        );
        return credentials;
    },
    // Store a .env with email & password fields
    writeEnvFile: function (email, password) {
        parsedFile = { CREDS_EMAIL: email, CREDS_PASSWORD: password };
        fs.writeFile(
            path.join(__dirname, '..', '.env'),
            envfile.stringifySync(parsedFile),
            function (err) {
                if (err) throw err;
                console.log(chalk.green('Credentials saved successfully.'));
            }
        );
    },
};
