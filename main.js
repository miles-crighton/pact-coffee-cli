require('dotenv').config()
const got = require('got');

const CREDS = { "email": process.env.CREDS_EMAIL, "password": process.env.CREDS_PASSWORD };

async function authenticate() {
    const response = await got.post('https://api.pactcoffee.com/v1/tokens/', { json: true, body: CREDS });
    if (response.statusCode === 201) { 
        const tokenID = response.body.token.id
        console.log('Authentication successful.')
        return tokenID
    } else {
        throw Error('Authentication unsuccessful')
    }
};

async function deauthenticate(authID) {
    //Id is base64
    const headers = { Authorization: `Basic ${authID}` }
    const response = await got.delete('https://api.pactcoffee.com/v1/tokens/me', { headers })
    if (response.statusCode === 204) {
        console.log('Deauthentication successful')
    } else {
        console.log('Unable to deauthenticate')
    }
};

async function getData(authID) {
    const headers = { Authorization: `Basic ${authID}` }
    const response = await got('https://api.pactcoffee.com/v1/users/me/start', { headers })
    if (response.statusCode === 200) {
        console.log('Data retrieved: ', response.body)
        return JSON.parse(response.body)
    } else {
        console.log('Unable to retrieve data')
    }
};

async function changeDate(authID, orderID, date) {
    const headers = { Authorization: `Basic ${authID}` }
    //TODO: veryify date format
    const options = { headers, json: true, body: { dispatch_on: date } }
    const response = await got.patch(`https://api.pactcoffee.com/v1/users/me/orders/${orderID}/`, options)
    if (response.statusCode === 200) {
        console.log(`Date successfully changed to ${date}`)
    } else {
        console.log('Unable to change date')
    }
};

function toBASE64(str) {
    return Buffer.from(str).toString('base64') + '=='
};

async function main() {
    try {
        const tokenDecimal = await authenticate()
        const tokenBASE64 = toBASE64(tokenDecimal)

        //Get info
        const data = await getData(tokenBASE64)
        const order = data.start.order_ids[0]
        console.log(order)

        const date = '2019-08-20'
        await changeDate(tokenBASE64, order, date)

        deauthenticate(tokenBASE64)
        //=> '<!doctype html> ...'
    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
};

main();