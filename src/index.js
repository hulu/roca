const brs = require('brs');
const glob = require('glob');
const path = require('path');

function findBrsFiles(testFile, sourceDir, cb) {
    let searchDir = sourceDir || 'source';
    const pattern = path.join(searchDir, '**', '*.brs');
    glob(pattern, (err, files) => {
        if (!err) {
            files.push(testFile);
            cb(files);
        }
    });
}

async function runTest(files) {
    let rocaBrs = path.join(__dirname, "..", "resources", "roca.brs");

    try {
        const result = await brs.execute([ rocaBrs, ...files ]);
    } catch(e) {
        console.error("Interpreter found an error: ", e);
        process.exit(11);
    }
    process.exit(0);
}

module.exports = function(testFile, sourceDir) {
    findBrsFiles(testFile, sourceDir, runTest);
}
