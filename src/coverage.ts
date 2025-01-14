import { createContext } from "istanbul-lib-report";
import { create as createReport, ReportOptions } from "istanbul-reports";
import { createCoverageMap } from "istanbul-lib-coverage";
import { getCoverageResults } from "brs";

/*
 * Generates coverage reports using the given list of reporters.
 * @param {array} reporters the istanbul reporters to use
 */
export function reportCoverage(reporters: (keyof ReportOptions)[]) {
    let coverageData = getCoverageResults();
    if (!coverageData) return;

    let context = createContext({
        coverageMap: createCoverageMap(coverageData),
    });

    reporters.forEach((reporter) => {
        (createReport(reporter) as any).execute(context);
    });
}
