#!/usr/bin/env node
let argv = require('yargs')
    .option('date', {
        alias: 'd',
        type: 'string',
        description: "Change your coffee's dispatch date",
    })
    .option('next', {
        alias: 'n',
        type: 'boolean',
        description: 'Find out when your next coffee is incoming.',
    }).argv;

const pact = require('./index.js');

if (argv.d) {
    pact.changeDate(argv.d);
} else if (argv.n) {
    pact.dispatchWhen();
} else {
    pact.main();
}
