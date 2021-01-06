import * as path from "path";
import TapMochaReporter = require("tap-mocha-reporter");
import { types as BrsTypes, ExecuteWithScope } from "brs";

export type MochaReporter =
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

export class TestRunner {
    readonly reporterStream: NodeJS.WriteStream & any;

    constructor(reporterType: MochaReporter) {
        this.reporterStream = new TapMochaReporter(reporterType);
    }

    /**
     * Executes and reports a given list of test files.
     * @param execute The scoped execution function
     * @param testFiles The list of files to run
     * @param focusedCasesDetected Whether or not focused cases were detected
     */
    public run(
        execute: ExecuteWithScope,
        testFiles: string[],
        focusedCasesDetected: boolean
    ) {
        // Create an instance of the BrightScript TAP object so we can pass it to the tests for reporting.
        let tap = execute(
            [path.join(__dirname, "..", "resources", "tap.brs")],
            [new BrsTypes.Int32(testFiles.length)]
        );

        let executeArgs = this.generateExecuteArgs(tap, focusedCasesDetected);
        testFiles.forEach((filename, index) => {
            this.executeFile(execute, executeArgs, filename);
            // Update the index so that our TAP reporting is correct.
            executeArgs.elements.set("index", new BrsTypes.Int32(index + 1));
        });
    }

    /**
     * Executes and reports a given test file.
     * @param execute The scoped execution function
     * @param executeArgs Args to pass to the execution function
     * @param filename The file to execute
     */
    protected executeFile(
        execute: ExecuteWithScope,
        executeArgs: BrsTypes.RoAssociativeArray,
        filename: string
    ) {
        try {
            execute([filename], [executeArgs]);
        } catch (e) {
            console.error(
                `Stopping execution. Interpreter encountered an error in ${filename}.`
            );
            process.exit(1);
        }
    }

    /**
     * Generates the execute arguments for roca, to pass to test files when executing them.
     * @param tap The return value from tap.brs (an instance of the Tap object)
     * @param focusedCasesDetected Whether or not there are focused cases in this run
     */
    protected generateExecuteArgs(
        tap: BrsTypes.BrsType,
        focusedCasesDetected: boolean
    ) {
        return new BrsTypes.RoAssociativeArray([
            {
                name: new BrsTypes.BrsString("exec"),
                value: BrsTypes.BrsBoolean.from(true),
            },
            {
                name: new BrsTypes.BrsString("focusedCasesDetected"),
                value: BrsTypes.BrsBoolean.from(focusedCasesDetected),
            },
            {
                name: new BrsTypes.BrsString("index"),
                value: new BrsTypes.Int32(0),
            },
            {
                name: new BrsTypes.BrsString("tap"),
                value: tap,
            },
        ]);
    }
}
