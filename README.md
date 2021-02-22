# Pact Coffee CLI

![CLI screenshot](https://user-images.githubusercontent.com/39874506/108716213-bc5d6d80-7513-11eb-9fc5-0cf8b269961c.png)

Communicate with [Pact's](https://www.pactcoffee.com/) servers via the comfort of your own terminal. ☕

**Featuring**

- Shorthand dispatch date requests with weekend handling 📦
- Saved & encrypted credentials in local .env for quick authentication 🔐
- Dispatch history to check in on last dispatched coffee ✔️
- View liked/disliked coffees 👍

## Install

**NPM ⚙️**

`npm i -g pact-coffee-cli`

**Yarn 🐈**

`yarn global add pact-coffee-cli`

Then use the command `pact`, you'll be prompted for your Pact email/password

Alternatively, try it out first with:

`npx pact-coffee-cli`

## Usage

Running `pact` without arguments will open the interactive CLI.

### Arguments

Use command arguments to quickly access features (eg `pact -d 3d`, dispatch coffee 3 days from now)

- `--date or -d "DATE-STRING"` : Change the dispatch date of your next order

  - Can use full date (DD-MM-YYY) or shorthand (4d/1w) representing days and weeks from the present date.

- `--next or -n` : Displays when coffee is next due to be dispatched

## Uninstall

**NPM ⚙️**

`npm uninstall -g pact-coffee-cli`

**Yarn 🐈**

`yarn global remove pact-coffee-cli`

## Privacy & Security Notice

Once you've entered your Pact credentials they'll be encrypted using info from your system.

The encrypted credentials will then be stored in an local .env file for future authentications.

These credentials are the only data that persists through interaction with the CLI.

To check out what's going on see [`auth.js`](https://github.com/miles-crighton/pact-coffee-cli/blob/master/src/auth.js) and [`crypto.js`](https://github.com/miles-crighton/pact-coffee-cli/blob/master/src/crypto.js).

**None of your information is sent anywhere other than Pact's API server and the Node CLI.**

## Disclaimer

This project is not officially affiliated with Pact Coffee ®
