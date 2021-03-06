## API Investigation

Most HTTP requests are after an initial OPTIONS request to get endpoint HTTP options

Backend written in Ruby

### Authentication

Send POST request to:
https://api.pactcoffee.com/v1/tokens
w/ payload of {email, password}

returns:
{
"token": {
"id": "a5cdc2e4-69c9-4c9d-8a20-e793cde7a689"
}
}

THEN
Uses token based authentication

> > Returns JSON web token on credentials post
> > token has expiration
> > can be deleted manually by website also (HTTP DELETE)

Sends GET to:
https://api.pactcoffee.com/v1/users/me/start
w/ authorization header
Authorization: Basic <tokenID: base64>==
NB: SENDS TOKEN ENCODED IN BASE64 with == end padding

Returns all the data!

### Logging out

Send DELETE request to
https://api.pactcoffee.com/v1/tokens/me
w/ Authorization header
when logging out

### Skipping order

On SKIP:
Send PATCH request to:
https://api.pactcoffee.com/v1/users/me/orders/<order-id>/skip
w/ empty payload: {}

### Changing order date

On change date:
Send PATCH request to:
https://api.pactcoffee.com/v1/users/me/orders/<order-id>/
w/ payload of { dispatch_on: 2019-07-30 } (YYYY-MM-DD ISO)

### Get list of products

Send GET to:
https://api.pactcoffee.com/v2/products
w/ Authorization header

### Get list of plans

Send GET to:
https://api.pactcoffee.com/v2/plans
w/ Authorization header

### Like/dislike coffee

Send POST to:
https://api.pactcoffee.com/v1/users/me/coffee-ratings
Payload:
{"coffee_rating":{"sku":"BA00000089","like":false}}
