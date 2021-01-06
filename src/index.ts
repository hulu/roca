import { types, ExecuteWithScope, createExecuteWithScope } from "brs";
import { glob } from "glob";
import * as path from "path";
import * as util from "util";
import * as c from "ansi-colors";
import { ReportOptions } from "istanbul-reports";
import TapMochaReporter = require("tap-mocha-reporter");
import { reportCoverage } from "./coverage";

const {
    BrsBoolean,
    BrsString,
    Int32,
    isBrsBoolean,
    isBrsString,
    RoArray,
    RoAssociativeArray,
} = types;
const globPromise = util.promisify(glob);

type MochaReporter =
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

interface Options {
    reporter: MochaReporter;
    requireFilePath: string | undefined;
    forbidFocused: boolean;
    coverageReporters?: (keyof ReportOptions)[];
}

async function findBrsFiles(sourceDir: string | undefined) {
    let searchDir = sourceDir || "source";
    const pattern = path.join(process.cwd(), searchDir, "**", "*.brs");
    return globPromise(pattern);
}

/**
 * Generates an execution scope and runs the tests.
 * @param files List of filenames to load into the execution scope
 * @param options BRS interpreter options
 */
async function run(files: string[], options: Options) {
    let {
        reporter,
        requireFilePath,
        forbidFocused,
        coverageReporters = [],
    } = options;
    let coverageEnabled = coverageReporters.length > 0;

    // Get the list of files that we should load into the execution scope.
    // Loading them here ensures that they only get lexed/parsed once.
    let rocaFiles = ["roca_lib.brs", "assert_lib.brs"].map((basename) =>
        path.join(__dirname, "..", "resources", basename)
    );
    let inScopeFiles = [...rocaFiles];
    if (requireFilePath) {
        inScopeFiles.push(requireFilePath);
    }
    inScopeFiles.push(...files);

    let reporterStream = new TapMochaReporter(reporter);

    // Create an execution scope using the project source files and roca files.
    let execute: ExecuteWithScope;
    try {
        execute = await createExecuteWithScope(inScopeFiles, {
            root: process.cwd(),
            stdout: reporterStream,
            stderr: process.stderr,
            generateCoverage: coverageEnabled,
            componentDirs: ["test", "tests"],
        });
    } catch (e) {
        console.error(
            "Stopping execution. Interpreter encountered an error: ",
            e
        );
        process.exit(1);
    }

    let { testFiles, focusedCasesDetected } = await getTestFiles(execute);
    await runTestFiles(execute, testFiles, focusedCasesDetected);

    reporterStream.end();

    if (coverageEnabled) {
        reportCoverage(coverageReporters);
    }

    // Fail if we find focused test cases and there weren't supposed to be any.
    if (forbidFocused && focusedCasesDetected) {
        let formattedList = testFiles
            .map((filename) => `\t${filename}`)
            .join("\n");
        console.error(
            c.red(
                `Error: used command line arg ${c.cyan(
                    "--forbid-focused"
                )} but found focused tests in these files:\n${formattedList}`
            )
        );
    }

    return reporterStream.runner?.testResults;
}

/**
 * Loops through the given test files and executes each one. If an interpreter exception is
 * encountered, then it exits with status code 1.
 * @param execute The function to execute each file with
 * @param testFiles The files to execute
 * @param focusedCasesDetected Whether or not focused cases were detected
 */
async function runTestFiles(
    execute: ExecuteWithScope,
    testFiles: string[],
    focusedCasesDetected: boolean
) {
    // Create an instance of the BrightScript TAP object so we can pass it to the tests for reporting.
    let tap = execute(
        [path.join(__dirname, "..", "resources", "tap.brs")],
        [new Int32(testFiles.length)]
    );

    // Run each test and fail if we encounter a runtime exception.
    let runArgs = generateRunArgs(tap, focusedCasesDetected);
    let indexString = new BrsString("index");
    testFiles.forEach((filename, index) => {
        try {
            execute([filename], [runArgs]);
            // Update the index so that our TAP reporting is correct.
            runArgs.set(indexString, new Int32(index + 1));
        } catch (e) {
            console.error(
                `Stopping execution. Interpreter encountered an error in ${filename}.`
            );
            process.exit(1);
        }
    });
}

/**
 * Returns the appropriate set of *.test.brs files, depending on whether it detects any focused tests.
 * Runs through the entire test suite (in non-exec mode) to determine this.
 * Also returns a boolean indicating whether focused tests were found.
 * @param execute The scoped execution function to run with each file
 */
async function getTestFiles(execute: ExecuteWithScope) {
    let testsPattern = path.join(
        process.cwd(),
        `{test,tests,source,components}`,
        "**",
        "*.test.brs"
    );
    let testFiles: string[] = await globPromise(testsPattern);

    let focusedSuites: string[] = [];
    let emptyRunArgs = new RoAssociativeArray([]);
    testFiles.forEach((filename) => {
        try {
            // Run the file in non-exec mode.
            let suite = execute([filename], [emptyRunArgs]);

            // Keep track of which files have focused cases.
            let subSuites =
                suite instanceof RoArray ? suite.getElements() : [suite];
            if (hasFocusedCases(subSuites)) {
                focusedSuites.push(filename);
            }
        } catch {
            // This is the pre-execution phase; report interpreter errors during execution instead.
        }
    });

    let focusedCasesDetected = focusedSuites.length > 0;
    return {
        focusedCasesDetected,
        testFiles: focusedCasesDetected ? focusedSuites : testFiles,
    };
}

/**
 * Checks to see if any suites in a given array of suites are focused.
 * @param subSuites An array of Roca suite objects to check
 */
function hasFocusedCases(subSuites: types.BrsType[]): boolean {
    for (let subSuite of subSuites) {
        if (!(subSuite instanceof RoAssociativeArray)) continue;

        let mode = subSuite.elements.get("mode");
        if (mode && isBrsString(mode) && mode.value === "focus") {
            return true;
        }

        let state = subSuite.elements.get("__state");
        if (state instanceof RoAssociativeArray) {
            let hasFocusedDescendants = state.elements.get(
                "hasfocuseddescendants"
            );
            if (
                hasFocusedDescendants &&
                isBrsBoolean(hasFocusedDescendants) &&
                hasFocusedDescendants.toBoolean()
            ) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Generates the run arguments for roca, to pass to test files when executing them.
 * @param tap The return value from tap.brs (an instance of the Tap object)
 * @param focusedCasesDetected Whether or not there are focused cases in this run
 */
function generateRunArgs(tap: types.BrsType, focusedCasesDetected: boolean) {
    return new types.RoAssociativeArray([
        {
            name: new BrsString("exec"),
            value: BrsBoolean.from(true),
        },
        {
            name: new BrsString("focusedCasesDetected"),
            value: BrsBoolean.from(focusedCasesDetected),
        },
        {
            name: new BrsString("index"),
            value: new Int32(0),
        },
        {
            name: new BrsString("tap"),
            value: tap,
        },
    ]);
}

module.exports = async function (
    args: { sourceDir: string | undefined } & Options
) {
    let { sourceDir, ...options } = args;
    let files = await findBrsFiles(sourceDir);
    return await run(files, options);
};
