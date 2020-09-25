const brs = require("brs");
const glob = require("glob");
const path = require("path");
const util = require("util");
const TapMochaReporter = require("tap-mocha-reporter");
const c = require("ansi-colors");
const coverage = require("./coverage");

async function findBrsFiles(sourceDir) {
    let searchDir = sourceDir || "source";
    const pattern = path.join(process.cwd(), searchDir, "**", "*.brs");
    return util.promisify(glob)(pattern);
}

async function runTest(files, options) {
    let { reporter, requireFilePath, forbidFocused, coverageReporters = [] } = options;
    let coverageEnabled = coverageReporters.length > 0;

    let rocaFiles = [
        "tap.brs",
        "roca_lib.brs",
        "roca_main.brs",
        "assert_lib.brs"
    ].map(basename => path.join(__dirname, "..", "resources", basename));

    let reporterStream = new TapMochaReporter(reporter);
    let allTestFiles = [...rocaFiles];
    if (requireFilePath) {
        allTestFiles.push(requireFilePath);
    }
    allTestFiles.push(...files);

    try {
        let returnVals = await brs.execute(allTestFiles, {
            root: process.cwd(),
            stdout: reporterStream,
            stderr: process.stderr,
            generateCoverage: coverageEnabled,
            componentDirs: ["test", "tests"]
        });

        reporterStream.end();

        if (coverageEnabled) {
            coverage.report(coverageReporters);
        }

        if (forbidFocused && returnVals.length > 0) {
            // iterate through return values and see if there are focused cases
            for (output of returnVals) {
                let maybeFiles = output.getValue().get("fileswithfocusedcases");
                if (maybeFiles) {
                    let focusedFiles = maybeFiles.getElements();
                    if (focusedFiles.length > 0) {
                        let formattedList = focusedFiles.map((brsStringPath) => `\t${brsStringPath.value}`).join("\n");
                        console.error(c.red(`Error: used command line arg ${c.cyan("--forbid-focused")} but found focused tests in these files:\n${formattedList}`));

                        process.exitCode = 1;
                        return;
                    }
                }
            }
        }
    } catch(e) {
        console.error("Interpreter found an error: ", e);
        process.exitCode = 1;
    }

    return reporterStream.runner.testResults;
}

module.exports = async function(args) {
    let { sourceDir, ...options } = args;
    let files = await findBrsFiles(sourceDir);
    return await runTest(files, options);
}
