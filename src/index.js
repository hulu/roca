const brs = require('brs');
const glob = require('glob');
const path = require('path');
const util = require('util');
const TapMochaReporter = require('tap-mocha-reporter');

async function findBrsFiles(exclusions) {
    const defaultDirs = ['source', 'components'];
    let exclusionList = [];

    if (exclusions) {
        exclusionList = exclusions.trim().split(',');
    }

    let inclusionList = defaultDirs
        .filter( dir => !exclusionList.includes(dir))
        .map( dir => path.join(dir, '**', '*.brs'));

    let pattern = inclusionList.length > 1 ? `{${inclusionList.join(',')}}` : inclusionList[0];

    return util.promisify(glob)(pattern);
}

async function runTest(files, reporter) {
    let rocaFiles = [
        "tap.brs",
        "roca_lib.brs",
        "roca_main.brs",
        "assert_lib.brs"
    ].map(basename => path.join(__dirname, "..", "resources", basename));

    try {
        let reporterStream = new TapMochaReporter(reporter);
        await brs.execute([ ...rocaFiles, ...files], {
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
    let { exclusions, reporter } = options;
    let files = await findBrsFiles(exclusions);
    await runTest(files, reporter);
}
