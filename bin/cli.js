#!/usr/bin/env node
const testRunner = require('../src/');
const argv = require('yargs')
    .usage("Usage: $0 [command] [options]")
    .updateStrings({
        "Positionals:": "Available commands",
        "Options:": "Other Options"
    })
    .command(
        ["$0", "run"],
        "Discovers and executes all .test.brs tests in the current directory", 
        (argv) => {
            testRunner(argv.s);
        }
    )
    .describe('s', 'Path to brs files (if different from source/)')
    .alias("s", "source")
    .help("h")
    .alias("h", "help")
    .argv;

