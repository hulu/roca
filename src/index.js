const brs = require('brs');
const glob = require('glob');
const path = require('path');
const util = require('util');
const TapMochaReporter = require('tap-mocha-reporter');

async function findBrsFiles(sourceDir) {
    let searchDir = sourceDir || 'source';
    const pattern = path.join(process.cwd(), searchDir, '**', '*.brs');
    return util.promisify(glob)(pattern);
}

async function runTest(files, reporter, requireFilePath) {
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
        await brs.execute(allTestFiles, {
            root: process.cwd(),
            stdout: reporterStream,
            stderr: process.stderr
        });
        reporterStream.end();
    } catch(e) {
        console.error("Interpreter found an error: ", e);
        process.exitCode = 1;
    }

    return reporterStream.runner.testResults;
}

module.exports = async function(options) {
    let { sourceDir, reporter, requireFilePath } = options;
    let files = await findBrsFiles(sourceDir);
    return await runTest(files, reporter, requireFilePath);
}
