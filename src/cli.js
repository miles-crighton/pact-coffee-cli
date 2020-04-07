#!/usr/bin/env node
let argv = require('yargs').option('date', {
    alias: 'd',
    type: 'string',
    description: 'Change the date...',
}).argv;

if (argv.d) {
    //Perform date change
    console.log('User asked to change date');
} else {
    //Run the cli
    require('./index.js');
}
