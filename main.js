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

const deauthenticate = async function(id) {
    //Id is base64
    const response = await got.delete('https://api.pactcoffee.com/v1/tokens/me', { headers: { Authorization: `Basic ${id}`} })
    if (response.statusCode === 204) {
        console.log('Deauthentication successful')
    } else {
        console.log('Unable to deauthenticate')
    }
};

const toBASE64 = function(str) {
    return Buffer.from(str).toString('base64') + '=='
};

(async () => {
    try {
        const tokenDecimal = await authenticate()
        const tokenBASE64 = toBASE64(tokenDecimal)
        console.log(tokenBASE64)

        deauthenticate(tokenBASE64)
        //=> '<!doctype html> ...'
    } catch (error) {
        console.log(error);
        //=> 'Internal server error ...'
    }
})();