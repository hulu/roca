const LibReport = require("istanbul-lib-report");
const Reports = require("istanbul-reports");
const LibCoverage = require("istanbul-lib-coverage");
const brs = require("brs");

/**
 * Takes a formatted dictionary of file coverage and generates
 * given istanbul reports. Format needed for istanbul:
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
