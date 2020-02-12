const got = require('got');
const chalk = require('chalk');
const CREDS = { "email": process.env.CREDS_EMAIL, "password": process.env.CREDS_PASSWORD };

module.exports = {
    authenticate: async () => {
        const response = await got.post('https://api.pactcoffee.com/v1/tokens/', { json: true, body: CREDS });
        if (response.statusCode === 201) {
            const tokenID = response.body.token.id;
            console.log(chalk.green('\nAuthentication successful. 👍'));
            return tokenID
        } else {
            throw Error('Authentication unsuccessful')
        }
    },
    deauthenticate: async (authID) => {
        //Id is base64
        const headers = { Authorization: `Basic ${authID}` }
        const response = await got.delete('https://api.pactcoffee.com/v1/tokens/me', { headers })
        if (response.statusCode === 204) {
            console.log(chalk.green('Deauthentication successful. 👍'));
        } else {
            console.log(chalk.red('Unable to deauthenticate. 👎'));
        }
    },
    getData: async (authID) => {
        const headers = { Authorization: `Basic ${authID}` }
        const response = await got('https://api.pactcoffee.com/v1/users/me/start', { headers })
        if (response.statusCode === 200) {
            //console.log('Data retrieved: ', response.body)
            return JSON.parse(response.body)
        } else {
            console.log(chalk.red('Unable to retrieve data'));
        }
    },
    changeDate: async (authID, orderID, date) => {
        const headers = { Authorization: `Basic ${authID}` }
        //TODO: veryify date format
        const options = { headers, json: true, body: { dispatch_on: date } }
        const response = await got.patch(`https://api.pactcoffee.com/v1/users/me/orders/${orderID}/`, options)
        if (response.statusCode === 200) {
            console.log(`Date successfully changed to ${date}`)
        } else {
            console.log('Unable to change date')
        }
    }
};