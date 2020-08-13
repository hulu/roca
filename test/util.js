const roca = require("../");
const path = require("path");

/**
 * Executes @hulu/roca in a particular directory, suppressing stdout to avoid interleaving test
 * results with expected output.
 * @param {...string} workingDirParts - parts of the absolute path to the directory in which Roca should be executed
 * @returns {object} a set of testResults as defined by tap-mocha-reporter's JSON formatter
 * @see https://github.com/tapjs/tap-mocha-reporter/blob/3e13f6602da28f337e599c6568d952a6f9f5aabe/lib/reporters/json.js#L48-L56
 */
exports.rocaInDir = async function(...workingDirParts) {
    let stdout = jest.spyOn(process.stdout, "write").mockImplementation(() => true);
    let cwd = jest.spyOn(process, "cwd").mockImplementation(() => path.join(...workingDirParts));

    try {
        return await roca({reporter: "json"});
    } finally {
        cwd.mockRestore();
        stdout.mockRestore();
    }
}
