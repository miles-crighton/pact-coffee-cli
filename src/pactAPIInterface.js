const got = require('got');
const apiInterface = exports;

/**
 * @param {Object} credentials: Obj of user credentials
 * @param {String} credentials.username: Username of user
 * @param {String} credentials.password: Password for user
 * @return {Promise<String>} Authorization token in Base64==
 */
apiInterface.getAuthToken = async (credentials) => {
  try {
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
  } catch (e) {
    if (e instanceof got) {
      throw new Error('Error resolving HTTP request');
    }
    throw e;
  }
};

/**
 * @param {String} authToken: Authorization token in Base64==
 */
apiInterface.deauthenticate = async (authToken) => {
  try {
    if (!authToken) {
      throw new Error('No authToken provided');
    }
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
  } catch (e) {
    if (e instanceof got) {
      throw new Error('Error resolving HTTP request');
    }
    throw e;
  }
};

/**
 * @param {String} authToken: Authorization token in Base64==
 */
apiInterface.getUserData = async (authToken) => {
  try {
    if (!authToken) {
      throw new Error('No authToken provided');
    }
    const headers = { Authorization: `Basic ${authToken}` };
    const response = await got('https://api.pactcoffee.com/v1/users/me/start', {
      headers,
    });
    if (response.statusCode === 200) {
      return JSON.parse(response.body);
    } else {
      return new Error('Unable to retrieve user data');
    }
  } catch (e) {
    if (e instanceof got) {
      throw new Error('Error resolving HTTP request');
    }
    throw e;
  }
};

/**
 * @param {String} authToken: Authorization token in base64==
 * @return {Object}: List of Pact products
 */
apiInterface.getProductData = async (authToken) => {
  try {
    if (!authToken) {
      throw new Error('No authToken provided');
    }
    const headers = { Authorization: `Basic ${authToken}` };
    const response = await got('https://api.pactcoffee.com/v2/products/', {
      headers,
    });
    if (response.statusCode === 200) {
      return JSON.parse(response.body);
    } else {
      throw new Error('Unable to retrieve product list');
    }
  } catch (e) {
    if (e instanceof got) {
      throw new Error('Error resolving HTTP request');
    }
    throw e;
  }
};

/**
 * @param {String} authToken: Authorization token in Base64==
 * @param {String} orderID: ID of Pact order to be altered
 * @param {ISO Date} date: New dispatch date
 * @return {ISO Date}: New dispatch date returned
 */
apiInterface.changeDispatchDate = async (authToken, orderID, date) => {
  try {
    if (!authToken || !orderID || !date) {
      throw new Error('An argument is undefined at changeDispatchDate');
    }
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
      throw new Error('Unable to change date');
    }
  } catch (e) {
    if (e instanceof got) {
      throw new Error('Error resolving HTTP request');
    }
    throw e;
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
  try {
    if (!authToken) {
      throw new Error('No authToken provided');
    }
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
  } catch (e) {
    if (e instanceof got) {
      throw new Error('Error resolving HTTP request');
    }
    throw e;
  }
};

/**
 * @param {String} authToken: Authorization token in base64==
 * @return {Array}: Array of coffee objects
 */
apiInterface.getMyCoffees = async (authToken) => {
  try {
    if (!authToken) {
      throw new Error('No authToken provided');
    }
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
      throw new Error("Unable to get user' coffees");
    }
  } catch (e) {
    if (e instanceof got) {
      throw new Error('Error resolving HTTP request');
    }
    throw e;
  }
};

/**
 * @param {String} authToken: Authorization token in base64==
 */
apiInterface.getOrderHistory = async (authToken) => {
  try {
    if (!authToken) {
      throw new Error('No authToken provided');
    }

    const headers = { Authorization: `Basic ${authToken}` };
    const options = { headers, json: true };

    const response = await got.get(
      `https://api.pactcoffee.com/v1/users/me/orders/?states[]=shipped&per_page=25&page=1&sort=dispatch_on&order=desc`,
      options
    );

    if (response.statusCode === 200) {
      return response.body;
    } else {
      throw new Error("Unable to get user' order history");
    }
  } catch (e) {
    if (e instanceof got) {
      throw new Error('Error resolving HTTP request');
    }
    throw e;
  }
};

checkDateFormat = (date) => {
  const regex = /\d{4}-\d{2}-\d{2}/g;
  return regex.test(date);
};

toBASE64 = (str) => {
  return Buffer.from(str).toString('base64') + '==';
};
