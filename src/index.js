const brs = require('brs');
const glob = require('glob');
const path = require('path');

function findBrsFiles(sourceDir, cb) {
    let searchDir = sourceDir || 'source';
    const pattern = path.join(searchDir, '**', '*.brs');
    glob(pattern, (err, files) => {
        if (!err) {
            cb(files);
        }
    });
}

async function runTest(files) {
    let rocaFiles = [
        "tap.brs",
        "roca_lib.brs",
        "roca_main.brs"
    ].map(basename => path.join(__dirname, "..", "resources", basename));

    try {
        const result = await brs.execute([ ...rocaFiles, ...files ]);
    } catch(e) {
        console.error("Interpreter found an error: ", e);
        process.exitCode = 1;
    }
}

module.exports = function(sourceDir) {
    findBrsFiles(sourceDir, runTest);
}
