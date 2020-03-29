const got = require('got');
const apiInterface = exports;

/**
 * @param {Object} credentials: Obj of user credentials
 * @param {String} credentials.username: Username of user
 * @param {String} credentials.password: Password for user
 * @return {String} Authorization token in decimal
 */
apiInterface.getAuthToken = async credentials => {
    const options = { json: true, body: credentials };
    const res = await got.post(
        'https://api.pactcoffee.com/v1/tokens/',
        options
    );
    if (res.statusCode === 201) {
        const tokenID = toBASE64(res.body.token.id);
        return tokenID;
    } else {
        return new Error('Unable to retrieve a token');
    }
};

/**
 * @param {String} authToken: Authorization token in Base64==
 */
apiInterface.deauthenticate = async authToken => {
    const headers = { Authorization: `Basic ${authToken}` };
    const response = await got.delete(
        'https://api.pactcoffee.com/v1/tokens/me',
        { headers }
    );
    if (response.statusCode === 204) {
        return;
    } else {
        throw new Error('Unable to deauthenticate');
    }
};

/**
 * @param {String} authToken: Authorization token in Base64==
 */
apiInterface.getUserData = async authToken => {
    const headers = { Authorization: `Basic ${authToken}` };
    const response = await got('https://api.pactcoffee.com/v1/users/me/start', {
        headers,
    });
    if (response.statusCode === 200) {
        return JSON.parse(response.body);
    } else {
        return new Error('Unable to retrieve user data');
    }
};

/**
 * @param {String} authToken: Authorization token in base64==
 * @return {Object}         List of Pact products
 */
apiInterface.getProductData = async authToken => {
    const headers = { Authorization: `Basic ${authToken}` };
    const response = await got('https://api.pactcoffee.com/v2/products/', {
        headers,
    });
    if (response.statusCode === 200) {
        return JSON.parse(response.body);
    } else {
        return new Error('Unable to retrieve product list');
    }
};

/**
 * @param {String} authToken: Authorization token in Base64==
 * @param {String} orderID: ID of Pact order to be altered
 * @param {ISO Date} date: New dispatch date
 * @return {ISO Date} New dispatch date returned
 */
apiInterface.changeDispatchDate = async (authToken, orderID, date) => {
    if (!checkDateFormat(date)) {
        return new Error('Incorrect date format, ISO YYYY-MM-DD required');
    }
    const headers = { Authorization: `Basic ${authToken}` };
    const options = {
        headers,
        json: true,
        body: { order_id: orderID, dispatch_on: date },
    };
    const response = await got.patch(
        `https://api.pactcoffee.com/v1/users/me/orders/${orderID}/`,
        options
    );
    if (response.statusCode === 200) {
        return date;
    } else {
        return new Error('Unable to change date');
    }
};

/**
 * @param {String} authToken: Authorization token in Base64==
 * @param {String} orderID: ID of Pact order to be altered
 * @param {} item: TBA
 * @param {} coffee: TBA
 * @return {} TBA
 */
apiInterface.changeCoffee = async (authToken, orderId, item, coffee) => {
    const headers = { Authorization: `Basic ${authToken}` };
    //TODO: get correct data to fill the body
    //Change { sku, extended_sku, product_name }
    const options = {
        headers,
        json: true,
        body: { order_item: null, entities: [{}] },
    };
    const response = await got.patch(
        `https://api.pactcoffee.com/v1/users/me/orders/${orderID}/items/${item.id}`,
        options
    );
    if (response.statusCode === 200) {
        return;
    } else {
        return new Error('Unable to change coffee');
    }
};

/**
 * @param {String} authToken: Authorization token in base64==
 * @return {Array} Array of coffee objects
 */
apiInterface.getMyCoffees = async authToken => {
    const headers = { Authorization: `Basic ${authToken}` };
    const options = { headers, json: true };

    /** @Return { coffees: [ { sku: string, name: string, origin: string, rating: boolean }, ... ]} */
    const response = await got.get(
        `https://api.pactcoffee.com/v1/users/me/coffees`,
        options
    );

    if (response.statusCode === 200) {
        return response.body['coffees'];
    } else {
        return new Error("Unable to get user' coffees");
    }
};

checkDateFormat = date => {
    const regex = /\d{4}-\d{2}-\d{2}/g;
    return regex.test(date);
};

toBASE64 = str => {
    return Buffer.from(str).toString('base64') + '==';
};
