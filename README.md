Most HTTP requests are after an initial OPTIONS request to get endpoint HTTP options

written in Ruby

Send POST request to:
https://api.pactcoffee.com/v1/tokens
w/ payload of {email, password}

{"email":"milessayshi@hotmail.co.uk","password":"9NefyX7#I7zr"}

returns:
{
    "token": {
        "id": "a5cdc2e4-69c9-4c9d-8a20-e793cde7a689"
    }
}

THEN

Uses token based authentication
>> Returns JSON web token on credentials post
>> token has expiration
>> can be deleted manually by website also (HTTP DELETE)

Sends GET to:
https://api.pactcoffee.com/v1/users/me/start
w/ authorization header
Authorization: Basic <tokenID: base64>== 
NB: SENDS TOKEN ENCODED IN BASE64 with == end padding

Returns all the data!


ON LOG OUT
Send DELETE request to 
https://api.pactcoffee.com/v1/tokens/me
w/ Authorization header
when logging out

On SKIP:
Send PATCH request to:
https://api.pactcoffee.com/v1/users/me/orders/<order-id>/skip
w/ empty payload: {}

On change date:
Send PATCH request to:
https://api.pactcoffee.com/v1/users/me/orders/<order-id>/
w/ payload of { dispatch_on: 2019-07-30 } (YYYY-MM-DD)