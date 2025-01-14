import Parser = require("tap-parser");
import {
    DefaultReporter,
    VerboseReporter,
    SummaryReporter,
    BaseReporter,
    AggregatedResult,
    TestResult,
} from "@jest/reporters";
import {
    addResult,
    createEmptyTestResult,
    makeEmptyAggregatedTestResult,
    Status,
} from "@jest/test-result";
import { formatExecError, formatResultsErrors } from "jest-message-util";
import {
    Assert,
    createAssertionResult,
    createContext,
    createFailureMessage,
} from "./utils";
import type { Config } from "@jest/types";
import { BrsError } from "brs/types/Error";

function isBrsError(error: Error | BrsError): error is BrsError {
    let maybeBrsError = error as BrsError;
    return !!maybeBrsError.location && !!maybeBrsError.message;
}

export class JestReporter {
    /** Aggregated results from all test files. */
    private aggregatedResults: AggregatedResult;

    /** The results from the test file that is currently being run. */
    private currentResults: TestResult = createEmptyTestResult();

    /** List of Jest reporters to use. */
    private reporters: BaseReporter[];

    constructor(
        readonly reporterStream: NodeJS.WriteStream & any,
        private projectConfig: Config.ProjectConfig,
        globalConfig: Config.GlobalConfig,
        reporterType: string
    ) {
        this.subscribeToParser(reporterStream);

        // Create aggregated results for reporting
        this.aggregatedResults = makeEmptyAggregatedTestResult();

        // Create a summary reporter and either a default or verbose reporter.
        this.reporters = [];
        if (reporterType === "jest-verbose") {
            this.reporters.push(new VerboseReporter(globalConfig));
        } else {
            this.reporters.push(new DefaultReporter(globalConfig));
        }
        this.reporters.push(new SummaryReporter(globalConfig));
    }

    /**
     * Subscribe to a TAP Parser's events.
     * @param parser Parser instance to subscribe
     */
    protected subscribeToParser(parser: Parser) {
        parser.on("fail", this.onTestFailure.bind(this));
        parser.on("child", this.subscribeToParser.bind(this));

        parser.on("pass", (assert: Assert) => {
            this.currentResults.numPassingTests++;
            this.addNonFailureTestResult(assert, "passed");
        });

        parser.on("skip", (assert: Assert) => {
            this.currentResults.numTodoTests++;
            this.addNonFailureTestResult(assert, "skipped");
        });

        parser.on("todo", (assert: Assert) => {
            this.currentResults.numTodoTests++;
            this.addNonFailureTestResult(assert, "todo");
        });

        parser.on("extra", (extra: string) => {
            if (!this.currentResults.console) {
                this.currentResults.console = [];
            }
            this.currentResults.console.push({
                message: extra,
                origin: "", // TODO: figure out how to get the stack
                type: "info",
            });
        });
    }

    /**
     * Callback for when a test run is starting.
     * @param numSuites The number of suites in the run
     */
    public onRunStart(numSuites: number) {
        this.aggregatedResults.startTime = Date.now();
        this.aggregatedResults.numTotalTestSuites = numSuites;

        this.reporters.forEach((reporter) => {
            reporter.onRunStart(this.aggregatedResults, {
                estimatedTime: 0, // TODO: estimate this maybe?
                showStatus: false,
            });
        });
    }

    /**
     * Callback for when all test files have been executed.
     */
    public onRunComplete() {
        let contextSet = new Set([createContext(this.projectConfig)]);
        this.reporters.forEach((reporter) => {
            reporter.onRunComplete(contextSet, this.aggregatedResults);
        });
    }

    /**
     * Callback for when brs encounters an execution error.
     * @param filename The name of the file that failed
     * @param index The TAP index of the file
     * @param reason The error that was thrown to cause the execution error
     */
    public onFileExecError(
        filename: string,
        index: number,
        reason: Error | BrsError | BrsError[]
    ) {
        // If we get an array of errors, report the first one.
        reason = Array.isArray(reason) ? reason[0] : reason;

        if (isBrsError(reason)) {
            this.currentResults.testExecError = {
                stack: `\nat ${reason.location.file}:${reason.location.start.line}:${reason.location.start.column}`,
                message: reason.message,
            };
        } else {
            this.currentResults.testExecError = {
                stack: reason.stack,
                message: reason.message,
            };
        }
    }

    /**
     * Callback for when a file starts test execution. Creates empty results
     * for the new file and sets it as the current results for this parser.
     * @param filePath The path to the file that is starting its run.
     */
    public onFileStart(filePath: string) {
        this.currentResults = createEmptyTestResult();
        this.currentResults.testFilePath = filePath;
        this.currentResults.perfStats.start = Date.now();
    }

    /**
     * Callback for when a file ends execution. Adds the results from the current
     * file to the aggregated results, and tells each Jest reporter that this file has completed.
     */
    public onFileComplete() {
        // Flatten console output because tap-parser splits output by newline in the "extra" event.
        // We don't know which lines are supposed to go together, so just print them all together.
        if (this.currentResults.console) {
            this.currentResults.console = [
                {
                    message: this.currentResults.console
                        .map((entry) => entry.message)
                        .join(""),
                    origin: "", // TODO: figure out how to get the stack trace
                    type: "print" as any, // a little hack because brightscript uses `print` instead of `console.log`
                },
            ];
        }

        if (this.currentResults.testExecError) {
            this.currentResults.failureMessage = formatExecError(
                this.currentResults.testExecError,
                this.projectConfig,
                { noStackTrace: false, noCodeFrame: false }
            );
        } else {
            // Generate the failure message if there is one.
            this.currentResults.failureMessage = formatResultsErrors(
                this.currentResults.testResults,
                this.projectConfig,
                {
                    noStackTrace: false,
                    noCodeFrame: false,
                },
                this.currentResults.testFilePath
            );
        }

        this.currentResults.perfStats.end = Date.now();
        this.currentResults.perfStats.runtime =
            this.currentResults.perfStats.start -
            this.currentResults.perfStats.end;

        // Add our file results to the overall aggregated results
        addResult(this.aggregatedResults, this.currentResults);

        // Tell our reporters that this file is complete.
        this.reporters.forEach((reporter) => {
            reporter.onTestResult(
                {
                    path: this.currentResults.testFilePath,
                    context: createContext(this.projectConfig),
                },
                this.currentResults,
                this.aggregatedResults
            );
        });
    }

    /**
     * Utility function for non-failed test results.
     * @param assert Metadata object about the failed test.
     * @param status The test result status
     */
    protected addNonFailureTestResult(assert: Assert, status: Status) {
        this.currentResults.testResults.push(
            createAssertionResult(status, assert.name)
        );
    }

    /**
     * Callback when a test case fails.
     * @param assert Metadata object about the failed test.
     */
    public onTestFailure(assert: Assert) {
        let failureMessage = assert.diag
            ? createFailureMessage(assert.diag)
            : "Test case failed";

        // Add the failed test case to our ongoing results.
        this.currentResults.numFailingTests++;
        this.currentResults.testResults.push(
            createAssertionResult("failed", assert.name, failureMessage)
        );
        process.exitCode = 1;
    }
}
