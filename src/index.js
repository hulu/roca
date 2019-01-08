const brs = require('brs');
const argv = require('yargs').argv;
const glob = require('glob');

function findBrsFiles(testFile, cb) {
    glob("source/**/*.brs", (err, files) => {
        if (!err) {
            files.push(testFile);
            cb(files);
        }
    });
}

async function runTest(files) {
    try {
        const result = await brs.execute(files);
    } catch(e) {
        console.error("Interpreter found an error: ", e);
        process.exit(11);
    }
    process.exit(0);
}

function testRunner(testFile) {
    findBrsFiles(testFile, runTest);
}

if (argv.f) {
    testRunner(argv.f)
} else {
    console.warn("You need to specify a file to test.");
}