require('dotenv').config()
const got = require('got');

const CREDS = { "email": process.env.CREDS_EMAIL, "password": process.env.CREDS_PASSWORD };

const authenticate = async function () {
    const response = await got.post('https://api.pactcoffee.com/v1/tokens/', { json: true, body: CREDS });
    if (response.statusCode === 201) { 
        const tokenID = response.body.token.id
        console.log('Authentication successful.')
        return tokenID
    } else {
        throw Error('Authentication unsuccessful')
    }
};

const deauthenticate = async function(authID) {
    //Id is base64
    const headers = { Authorization: `Basic ${authID}` }
    const response = await got.delete('https://api.pactcoffee.com/v1/tokens/me', { headers })
    if (response.statusCode === 204) {
        console.log('Deauthentication successful')
    } else {
        console.log('Unable to deauthenticate')
    }
};

const getData = async function(authID) {
    const headers = { Authorization: `Basic ${authID}` }
    const response = await got('https://api.pactcoffee.com/v1/tokens/me', { headers })
    if (response.statusCode === 201) {
        console.log('Data retrieved: ', response.body)
        return response.body
    } else {
        console.log('Unable to deauthenticate')
    }
}

const changeDate = async function(authID, orderID, date) {
    const headers = { Authorization: `Basic ${authID}` }
    //TODO: veryify date format
    const options = { headers, json: true, body: date }
    const response = await got.patch(`https://api.pactcoffee.com/v1/users/me/orders/${orderID}/`, options)
}

const toBASE64 = function(str) {
    return Buffer.from(str).toString('base64') + '=='
};

(async () => {
    try {
        const tokenDecimal = await authenticate()
        const tokenBASE64 = toBASE64(tokenDecimal)

        //Get info
        const data = await getData(tokenBASE64)

        // const date = '2019-07-31'
        // await changeDate(tokenBASE64, )

        deauthenticate(tokenBASE64)
        //=> '<!doctype html> ...'
    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
})();