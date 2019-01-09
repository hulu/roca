const brs = require('brs');
const glob = require('glob');
const path = require('path');

function findBrsFiles(testFile, cb) {
    glob("source/**/*.brs", (err, files) => {
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

module.exports = function(testFile) {
    findBrsFiles(testFile, runTest);
}
