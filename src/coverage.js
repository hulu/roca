const LibReport = require("istanbul-lib-report");
const Reports = require("istanbul-reports");
const LibCoverage = require("istanbul-lib-coverage");
const brs = require("brs");

/*
 * Generates coverage reports using the given list of reporters.
 * @param {array} reporters the istanbul reporters to use
 */
module.exports.report = function(reporters) {
    let coverageData = brs.getCoverageResults();
    if (!coverageData) return;

    let context = LibReport.createContext({
        coverageMap: LibCoverage.createCoverageMap(coverageData)
    });

    reporters.forEach((reporter) => {
        Reports.create(reporter).execute(context);
    });
}
