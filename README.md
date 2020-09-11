# Pact Coffee CLI

![CLI screenshot](https://user-images.githubusercontent.com/39874506/92900128-52468580-f417-11ea-803c-958e123a921b.png?sanitize=true)

Communicate with [Pact's](https://www.pactcoffee.com/) servers via the comfort of your own terminal. ☕

## Usage

Running `pact` without arguments will open the interactive CLI.

### Arguments

Use command arguments to quickly access features (eg `pact -d 3d`, dispatch coffee 3 days from now)

-   `--date or -d "DATE-STRING"` : Change the dispatch date of your next order

    -   Can use full date (DD-MM-YYY) or shorthand (4d/1w) representing days and weeks from the present date.

-   `--next or -n` : Displays when coffee is next due to be dispatched

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

`echo "alias pact='"$PWD"/src/cli.js'" >> ~/.bashrc`

You should now be able to run the program simply using `pact`.

## Disclaimer

This project is not officially affiliated with Pact Coffee ®
