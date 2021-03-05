import { Config } from "@jest/types";
import { readConfig } from "jest-config";
import { ReporterType, JestReporterType } from "../reporter";
import { JestRunner } from "./JestRunner";
import Parser = require("tap-parser");
import TapMochaReporter = require("tap-mocha-reporter");
import { TestRunner } from "./TestRunner";

const mochaReporterTypes = [
    "classic",
    "doc",
    "dot",
    "dump",
    "json",
    "jsonstream",
    "landing",
    "list",
    "markdown",
    "min",
    "nyan",
    "progress",
    "silent",
    "spec",
    "tap",
    "xunit",
] as const;
export type MochaReporterType = typeof mochaReporterTypes[number];

function isJestReporter(
    reporterName: ReporterType
): reporterName is JestReporterType {
    return reporterName === "jest" || reporterName === "jest-verbose";
}

export async function createTestRunner(reporterType: ReporterType) {
    if (isJestReporter(reporterType)) {
        // Let Jest generate the global and project that it'll use for reporting.
        let { projectConfig, globalConfig } = await readConfig(
            {} as Config.Argv,
            process.cwd()
        );
        return new JestRunner(
            new Parser(),
            projectConfig,
            globalConfig,
            reporterType
        );
    } else {
        return new TestRunner(new TapMochaReporter(reporterType));
    }
}
