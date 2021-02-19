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

export function createTestRunner(reporterType: MochaReporterType) {
    // Add more runner options as they are implemented
    return new TestRunner(new TapMochaReporter(reporterType));
}
