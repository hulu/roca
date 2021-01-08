import TapMochaReporter = require("tap-mocha-reporter");
import { TestRunner } from "./TestRunner";

export type MochaReporterType =
    | "classic"
    | "doc"
    | "dot"
    | "dump"
    | "json"
    | "jsonstream"
    | "landing"
    | "list"
    | "markdown"
    | "min"
    | "nyan"
    | "progress"
    | "silent"
    | "spec"
    | "tap"
    | "xunit";
export type JestReporterType = "jest" | "jest-verbose";
export type ReporterType = JestReporterType | MochaReporterType;

export function createTestRunner(reporterType: ReporterType) {
    // Add more runner options as they are implemented
    return new TestRunner(new TapMochaReporter(reporterType));
}
