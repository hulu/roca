const brs = require('brs');
const glob = require('glob');
const path = require('path');
const util = require('util');
const TapMochaReporter = require('tap-mocha-reporter');

async function findBrsFiles(sourceDir) {
    let searchDir = sourceDir || 'source';
    const pattern = path.join(searchDir, '**', '*.brs');
    return util.promisify(glob)(pattern);
}

async function runTest(files, reporter, requireFilePath) {
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
        await brs.execute(allTestFiles, {
            stdout: reporterStream,
            stderr: process.stderr
        });
        reporterStream.end();
    } catch(e) {
        console.error("Interpreter found an error: ", e);
        process.exitCode = 1;
    }
}

module.exports = async function(options) {
    let { sourceDir, reporter, requireFilePath } = options;
    let files = await findBrsFiles(sourceDir);
    await runTest(files, reporter, requireFilePath);
}
