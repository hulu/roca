#!/usr/bin/env node
const testRunner = require('../src/');
const argv = require('yargs')
    .usage("Usage: $0 <option> test file")
    .describe("f", "Path to test file")
    .alias("f", "file")
    .help("h")
    .alias("h", "help")
    .argv;

if (argv.f) {
    testRunner(argv.f);
} else {
    console.warn("You need to specify a file to test.");
}
