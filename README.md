# Pact Coffee CLI

![Screenshot of software](/screenshot.png?raw=true "Main CLI")

A fan-made project to allow command-line communications with Pact's servers.

Current functionality:
* view the status of an order
* change the dispatch date of that order.

## To run locally

Clone the repository into a local directory:
```
git clone https://github.com/miles-crighton/pact-coffee-cli
```

Install required npm packages:
```
npm install
```

Run the script with:
```
node pactCLI.js
```

### Optional: create bash alias (OSX/Unix Bash Users)
Run this command from the project directory:
```
echo "alias pact='node "$PWD"/pactCLI.js'" >> ~/.bash_profile
```

You should now be able to run the program simply using:
```
pact
```

## Todo

- [ ] Deauthenticate on error
- [ ] Prevent dispatch date being a weekend (causes error)
- [ ] Create API for additional actions (ASAP dispatch, Select coffee)