#!/usr/bin/env node
const testRunner = require('../src/');
const argv = require('yargs')
    .usage("Usage: $0 [command] [options]")
    .updateStrings({
        "Positionals:": "Available commands",
        "Options:": "Other Options"
    })
    .command(
        "file <file>",
        "Run tests on given file", 
        (yargs) => {
            yargs.positional("file", {
                type: "string",
                describe: "The test file to execute"
            })
        },
        (argv) => {
            testRunner(argv.file, argv.s);
        }
    )
    .describe('s', 'Path to brs files (if different from source/)')
    .alias("s", "source")
    .help("h")
    .alias("h", "help")
    .argv;

