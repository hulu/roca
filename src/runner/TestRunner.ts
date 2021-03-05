import * as path from "path";
import { types as BrsTypes, ExecuteWithScope } from "brs";
import { formatInterpreterError } from "../util";

export class TestRunner {
    constructor(readonly reporterStream: NodeJS.WriteStream & any) {}

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
            [path.join(__dirname, "..", "..", "resources", "tap", "main.brs")],
            [new BrsTypes.Int32(testFiles.length)]
        );
        let executeArgs = this.generateExecuteArgs(tap, focusedCasesDetected);
        this._run(execute, executeArgs, testFiles);
    }

    /**
     * Executes and reports a given test file. Subclasses should override this method
     * with custom implementations as needed.
     * @param execute The scoped execution function
     * @param executeArgs Args to pass to the execution function
     * @param filename The file to execute
     */
    protected _run(
        execute: ExecuteWithScope,
        executeArgs: BrsTypes.RoAssociativeArray,
        testFiles: string[]
    ) {
        testFiles.forEach((filename, index) => {
            // Set the index so that our TAP reporting is correct.
            executeArgs.elements.set("index", new BrsTypes.Int32(index));
            try {
                execute([filename], [executeArgs]);
            } catch (e) {
                console.error(
                    `Stopping execution. Interpreter encountered errors:\n\t${formatInterpreterError(
                        e
                    )}`
                );
                process.exit(1);
            }
        });
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
                value: BrsTypes.BrsBoolean.True,
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
