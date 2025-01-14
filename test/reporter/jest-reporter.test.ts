import { Config } from "@jest/types";
import { PassThrough } from "stream";
import { JestReporter } from "../../src/reporter/JestReporter";
import * as Reporters from "@jest/reporters";
import * as TestResult from "@jest/test-result";
import { BrsError } from "brs/types/Error";

jest.mock("@jest/reporters");
let ReportersMock = Reporters as jest.Mocked<typeof Reporters>;
type DefaultReporterMock = jest.Mocked<Reporters.DefaultReporter>;
type SummaryReporterMock = jest.Mocked<Reporters.SummaryReporter>;

jest.mock("@jest/test-result");
let TestResultMock = TestResult as jest.Mocked<typeof TestResult>;

describe("JestReporter.ts", () => {
    let jestReporter: JestReporter;
    let defaultReporter: DefaultReporterMock;
    let summaryReporter: SummaryReporterMock;

    let projectConfig = {} as Config.ProjectConfig;
    let globalConfig = {} as Config.GlobalConfig;

    beforeEach(() => {
        ReportersMock.DefaultReporter.mockClear();
        ReportersMock.SummaryReporter.mockClear();
        ReportersMock.VerboseReporter.mockClear();

        TestResultMock.makeEmptyAggregatedTestResult.mockClear();
        TestResultMock.createEmptyTestResult.mockClear();
        TestResultMock.makeEmptyAggregatedTestResult.mockReturnValue(
            {} as Reporters.AggregatedResult
        );
        TestResultMock.createEmptyTestResult.mockReturnValue({
            perfStats: {},
            numFailingTests: 0,
            testResults: [] as TestResult.AssertionResult[],
        } as Reporters.TestResult);

        Date.now = jest.fn().mockReturnValue(12345);

        jestReporter = new JestReporter(
            new PassThrough(),
            projectConfig,
            globalConfig,
            "jest"
        );

        defaultReporter = ReportersMock.DefaultReporter.mock
            .instances[0] as DefaultReporterMock;
        summaryReporter = ReportersMock.SummaryReporter.mock
            .instances[0] as SummaryReporterMock;
    });

    afterEach(() => {
        (Date.now as jest.MockedFunction<typeof Date.now>).mockRestore();
    });

    it("creates a default reporter and summary reporter", () => {
        expect(ReportersMock.DefaultReporter).toHaveBeenCalledTimes(1);
        expect(ReportersMock.DefaultReporter).toHaveBeenCalledWith(
            globalConfig
        );
        expect(ReportersMock.SummaryReporter).toHaveBeenCalledTimes(1);
        expect(ReportersMock.SummaryReporter).toHaveBeenCalledWith(
            globalConfig
        );

        expect(ReportersMock.VerboseReporter).not.toHaveBeenCalled();
    });

    it("creates a verbose reporter", () => {
        jestReporter = new JestReporter(
            new PassThrough(),
            projectConfig,
            globalConfig,
            "jest-verbose"
        );
        expect(ReportersMock.VerboseReporter).toHaveBeenCalledTimes(1);
        expect(ReportersMock.VerboseReporter).toHaveBeenCalledWith(
            globalConfig
        );
    });

    describe("onRunStart", () => {
        it("starts a test run with correct number of suites and time", () => {
            let numTotalTestSuites = 3;
            jestReporter.onRunStart(numTotalTestSuites);

            [defaultReporter, summaryReporter].forEach((reporterMock) => {
                expect(reporterMock.onRunStart).toHaveBeenCalledTimes(1);
                expect(reporterMock.onRunStart.mock.calls[0][0]).toMatchObject({
                    numTotalTestSuites,
                    startTime: 12345,
                });
            });
        });
    });

    describe("onRunComplete", () => {
        it("calls onRunComplete for each reporter", () => {
            jestReporter.onRunComplete();
            [defaultReporter, summaryReporter].forEach((reporterMock) => {
                expect(reporterMock.onRunComplete).toHaveBeenCalledTimes(1);

                let args = reporterMock.onRunComplete.mock.calls[0];
                expect(args.length).toEqual(2);
                expect(args[0]).toBeInstanceOf(Set);
                expect(args[0]?.size).toEqual(1);
                expect(args[1]).toMatchObject({});
            });
        });
    });

    describe("onFileExecError", () => {
        it("creates an exec error for a BrsError", () => {
            jestReporter.onFileExecError("foo", 0, {
                message: "mock error message",
                location: {
                    file: "/path/to/fake/file",
                    start: { line: 1, column: 2 },
                    end: { line: 3, column: 4 },
                },
            } as BrsError);

            let results =
                TestResultMock.createEmptyTestResult.mock.results[0].value;
            expect(results).toMatchObject({
                testExecError: {
                    stack: "\nat /path/to/fake/file:1:2",
                    message: "mock error message",
                },
            });
        });

        it("creates an exec error for a standard Error", () => {
            jestReporter.onFileExecError("foo", 0, {
                name: "mock error name",
                message: "mock error message",
                stack: "mock:stack:trace",
            });

            let results =
                TestResultMock.createEmptyTestResult.mock.results[0].value;
            expect(results).toMatchObject({
                testExecError: {
                    stack: "mock:stack:trace",
                    message: "mock error message",
                },
            });
        });
    });

    describe("onFileStart", () => {
        it("creates new test results with start time and file", () => {
            TestResultMock;
            jestReporter.onFileStart("/fake/file/path");
            let results =
                TestResultMock.createEmptyTestResult.mock.results[0].value;

            expect(results).toMatchObject({
                testFilePath: "/fake/file/path",
                perfStats: {
                    start: 12345,
                },
            });
        });
    });

    describe("onTestFailure", () => {
        beforeEach(() => {
            jestReporter.onFileStart("/fake/path");
        });

        it("adds failing test to results with generic message when no diagnostics exist", () => {
            jestReporter.onTestFailure({
                ok: false,
                id: 111,
                name: "mock name",
                fullname: "",
            });

            let results =
                TestResultMock.createEmptyTestResult.mock.results[0].value;

            expect(results).toMatchObject({
                numFailingTests: 1,
                testResults: [
                    {
                        status: "failed",
                        title: "mock name",
                        failureMessages: ["Test case failed"],
                    },
                ],
            });
        });

        it("adds failing test to results with formatted message diagnostics", () => {
            jestReporter.onTestFailure({
                ok: false,
                id: 111,
                name: "mock name",
                fullname: "",
                diag: {
                    error: {
                        name: "mock error name",
                        message: "mock message name",
                        stack_frames: ["mock:stack:frame"],
                    },
                    wanted: "foo",
                    found: "bar",
                },
            });

            let results =
                TestResultMock.createEmptyTestResult.mock.results[0].value;

            expect(results).toMatchObject({
                numFailingTests: 1,
                testResults: expect.arrayContaining([
                    expect.objectContaining({
                        status: "failed",
                        title: "mock name",
                    }),
                ]),
            });

            expect(results.testResults[0].failureMessages?.length).toEqual(1);

            let failureMessage = results.testResults[0].failureMessages[0];
            expect(failureMessage).toContain("mock message name");
            expect(failureMessage).toContain("mock:stack:frame");
            expect(failureMessage).toContain("foo");
            expect(failureMessage).toContain("bar");
        });
    });
});
