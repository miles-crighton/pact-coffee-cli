const got = require('got');
const chalk = require('chalk');
const apiInterface = exports;

/**
 * @param {Object} credentials: Obj of user credentials
 * @param {String} credentials.username: Username of user
 * @param {String} credentials.password: Password for user
 * @return {String} Authorization token in decimal
 */
apiInterface.getAuthToken = async credentials => {
    console.log('Getting auth token...');
    try {
        const options = { json: true, body: credentials };
        const res = await got.post(
            'https://api.pactcoffee.com/v1/tokens/',
            options
        );
        if (res.statusCode === 201) {
            const tokenID = toBase64(res.body.token.id);
            return tokenID;
        } else {
            throw new Error('Unable to retrieve a token');
        }
    } catch (e) {
        console.log(e);
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

apiInterface.getUserData = async authID => {
    return getData(authID, (type = 'user'));
};

apiInterface.getCoffeeData = async authID => {
    return getData(authID, (type = 'coffee'));
};

apiInterface.changeDate = async (authID, orderID, date) => {
    if (!checkDateFormat(date)) {
        console.log(
            chalk.red('Date format incorrect, dispatch date unchanged')
        );
        return;
    }
    const headers = { Authorization: `Basic ${authID}` };

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
        console.log(
            chalk.green(
                `Order dispatch date successfully changed to ${date}. 👍`
            )
        );
    } else {
        console.log(chalk.red('Unable to change date'));
    }
};

apiInterface.changeCoffee = async (authID, orderId, item, coffee) => {
    const headers = { Authorization: `Basic ${authID}` };
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
        console.log(chalk.green(`Date successfully changed to ${date}`));
    } else {
        console.log(chalk.red('Unable to change date'));
    }
};
apiInterface.getMyCoffees = async authID => {
    const headers = { Authorization: `Basic ${authID}` };
    const options = { headers, json: true };

    try {
        /** @Return { coffees: [ { sku: string, name: string, origin: string, rating: boolean }, ... ]} */
        const response = await got.get(
            `https://api.pactcoffee.com/v1/users/me/coffees`,
            options
        );

        if (response.statusCode === 200) {
            return response.body['coffees'];
        }
    } catch (e) {
        console.log(chalk.red(`Error occured: ${e}`));
    }
};

checkDateFormat = date => {
    const regex = /\d{4}-\d{2}-\d{2}/g;
    return regex.test(date);
};

toBASE64 = str => {
    return Buffer.from(str).toString('base64') + '==';
};

getData = async (authID, type) => {
    const headers = { Authorization: `Basic ${authID}` };
    const urls = {
        user: 'https://api.pactcoffee.com/v1/users/me/start',
        coffee: 'https://api.pactcoffee.com/v2/products/',
    };

    if (!(type in urls)) {
        console.log(chalk.red(`Invalid data request type: ${type}`));
        return;
    }

    const response = await got(urls[type], { headers });
    if (response.statusCode === 200) {
        //console.log('Data retrieved: ', JSON.parse(response.body))
        return JSON.parse(response.body);
    } else {
        console.log(chalk.red(`Unable to retrieve ${type} data`));
    }
};
