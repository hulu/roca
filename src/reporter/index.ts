export * from "./utils";
export * from "./JestReporter";

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
