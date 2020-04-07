# Pact Coffee CLI

![Screenshot of software](/screenshot.png?raw=true 'Main CLI')

A fan-made project offering command-line interactions with Pact's servers.

Running the cli without arguments will open the interactive application.

## CLI args

To gain quick access to app functionality use:

-   -d "DATE-STRING" : Change the dispatch date of your next order
    -   Can use full date (DD-MM-YYY) or shorthand (4d/1w) representing days and weeks from the present date.
-   -w : Displays when coffee is next due to be dispatched

## Install via npm

`npm i -g pact-coffee-cli` then use the command `pact`

or try it out first with:

`npx pact-coffee-cli`

## Install manually

Clone the repository into a local directory:

`git clone https://github.com/miles-crighton/pact-coffee-cli`

Install required npm packages:

`npm install`

Run the script with:

`./src/cli.js`

### Optional: create bash alias (OSX/Unix Bash Users)

Run this command from the project directory:

`echo "alias pact='"$PWD"/src/cli.js'" >> ~/.bash_profile`

You should now be able to run the program simply using:

`pact`

## Todo

-   [ ] Add description of API interface as standalone lib
-   [x] Deauthenticate on error
-   [x] Prevent dispatch date being a weekend (causes error)
-   [ ] Create API for additional actions (ASAP dispatch, Select coffee)
-   [x] Add ability to short-hand input date (ie. 2w, 5d)
-   [x] Need to read .env file from absolute dir not relative on alias call
-   [x] Use yargs to handle quick cmd flags

## Disclaimer

This project is not officially affiliated with Pact Coffee ®
