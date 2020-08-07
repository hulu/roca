const brs = require('brs');
const glob = require('glob');
const path = require('path');
const util = require('util');
const TapMochaReporter = require('tap-mocha-reporter');
const c = require("ansi-colors");

async function findBrsFiles(sourceDir) {
    let searchDir = sourceDir || 'source';
    const pattern = path.join(searchDir, '**', '*.brs');
    return util.promisify(glob)(pattern);
}

async function runTest(files, options) {
    let { reporter, requireFilePath, forbidFocused } = options;
    let rocaFiles = [
        "tap.brs",
        "roca_lib.brs",
        "roca_main.brs",
        "assert_lib.brs"
    ].map(basename => path.join(__dirname, "..", "resources", basename));

    try {
        let reporterStream = new TapMochaReporter(reporter);
        let allTestFiles = [...rocaFiles];
        if (requireFilePath) {
            allTestFiles.push(requireFilePath);
        }
        allTestFiles.push(...files);
        let returnVals = await brs.execute(allTestFiles, {
            stdout: reporterStream,
            stderr: process.stderr
        });

        reporterStream.end();

        if (forbidFocused && returnVals.length > 0) {
            // iterate through return values and see if there are focused cases
            for (output of returnVals) {
                let focusedFiles = output.getValue().get("fileswithfocusedcases").getElements();
                if (focusedFiles.length > 0) {
                    let formattedList = focusedFiles.map((brsStringPath) => `    ${brsStringPath.value}`).join("/n");
                    console.error(c.red(`Error: used command line arg ${c.cyan("--forbid-focused")} but found focused tests in these files:`));
                    console.error(formattedList);

                    process.exitCode = 1;
                    return;
                }
            }
        }
    } catch(e) {
        console.error("Interpreter found an error: ", e);
        process.exitCode = 1;
    }
}

module.exports = async function(args) {
    let { sourceDir, ...options } = args;
    let files = await findBrsFiles(sourceDir);
    await runTest(files, options);
}
