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
        const headers = { Authorization: `Basic ${authID}` };
        const response = await got.delete('https://api.pactcoffee.com/v1/tokens/me', { headers })
        if (response.statusCode === 204) {
            console.log(chalk.green('Deauthentication successful. 👍'));
        } else {
            console.log(chalk.red('Unable to deauthenticate. 👎'));
        }
    },
    getUserData: async (authID) => {
        return getData(authID, type='user')
    },
    getCoffeeData: async (authID) => {
        return getData(authID, type='coffee')
    },
    changeDate: async (authID, orderID, date) => {
        if (!checkDateFormat(date)) {
            console.log(chalk.red('Date format incorrect, dispatch date unchanged'));
            return
        }
        const headers = { Authorization: `Basic ${authID}` };

        const options = { headers, json: true, body: { order_id: orderID, dispatch_on: date } }
        const response = await got.patch(`https://api.pactcoffee.com/v1/users/me/orders/${orderID}/`, options)
        if (response.statusCode === 200) {
            console.log(chalk.green(`Date successfully changed to ${date}`));
        } else {
            console.log(chalk.red('Unable to change date'));
        }
    },
    changeCoffee: async (authID, orderId, item, coffee) => {
        const headers = { Authorization: `Basic ${authID}` };
        //TODO: get correct data to fill the body
        //Change { sku, extended_sku, product_name }
        const options = { headers, json: true, body: { order_item: null, entities: [{}] } }
        const response = await got.patch(`https://api.pactcoffee.com/v1/users/me/orders/${orderID}/items/${item.id}`, options)
        if (response.statusCode === 200) {
            console.log(chalk.green(`Date successfully changed to ${date}`));
        } else {
            console.log(chalk.red('Unable to change date'));
        }
    }
};

checkDateFormat = (date) => {
    const regex = /\d{4}-\d{2}-\d{2}/g;
    return regex.test(date)
}

getData = async (authID, type) => {
    const headers = { Authorization: `Basic ${authID}` };
    const urls = { 
        user: 'https://api.pactcoffee.com/v1/users/me/start',
        coffee: 'https://api.pactcoffee.com/v2/products/'
    };

    if (!(type in urls)) {
        console.log(chalk.red(`Invalid data request type: ${type}`)); 
        return
    }

    const response = await got(urls[type], { headers })
    if (response.statusCode === 200) {
        //console.log('Data retrieved: ', JSON.parse(response.body))
        return JSON.parse(response.body)
    } else {
        console.log(chalk.red(`Unable to retrieve ${type} data`));
    }
}