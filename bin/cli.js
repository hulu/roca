#!/usr/bin/env node
const testRunner = require('../src/');
const argv = require('yargs')
    .usage("Usage: $0 [command] [options]")
    .updateStrings({
        "Positionals:": "Available commands",
        "Options:": "Other Options"
    })
    .command(
        ["$0", "run "],
        "Discovers and executes all .test.brs tests in the current directory",
        (yargs) => {
            yargs.option("reporter", {
                // use capital-R for reporter selection to match mocha
                alias: "R",
                type: "string",
                describe: "The mocha reporter to use, via tap-mocha-reporter",
                default: "spec",
                choices: [
                    "classic",
                    "doc",
                    "dot",
                    "dump",
                    "json",
                    "jsonstream",
                    "landing",
                    "list",
                    "markdown",
                    "min",
                    "nyan",
                    "progress",
                    "silent",
                    "spec",
                    "tap",
                    "xunit"
                ],
            })

        },
        async (argv) => {
            await testRunner({
                sourceDir: argv.s,
                reporter: argv.reporter,
                requireFilePath: argv.r,
                forbidFocused: argv.f
            });
        }
    )
    .describe("s", "Path to brs files (if different from source/)")
    .alias("s", "source")
    .describe("r", "Path to a required setup file (will be run before unit tests)")
    .alias("r", "require")
    .describe("f", "Fail if focused test or suite is encountered")
    .alias("f", "forbid-focused")
    .help("h")
    .alias("h", "help")
    .argv;

