import { types, ExecuteWithScope, createExecuteWithScope } from "brs";
import fg from "fast-glob";
import * as path from "path";
import * as c from "ansi-colors";
import { ReportOptions } from "istanbul-reports";
import { reportCoverage } from "./coverage";
import { formatInterpreterError } from "./util";
import { createTestRunner, ReporterType } from "./runner";

const { isBrsBoolean, isBrsString, RoArray, RoAssociativeArray } = types;

interface CliOptions {
    /** The test reporter to use. */
    reporter: ReporterType;
    /** A path to a file that we should load into global exec scope prior to test run. */
    requireFilePath: string | undefined;
    /** Whether or not to fail the test run if focused cases are detected. */
    forbidFocused?: boolean;
    /** The istanbul coverage reporters to use. */
    coverageReporters?: (keyof ReportOptions)[];
    /** The directory where we should load source files from, if not 'source'. */
    sourceDir?: string;
    /** Test file matches specified in the command (if empty, we will test/search for all *.test.brs files) */
    fileMatches: string[];
}

async function findBrsFiles(sourceDir?: string) {
    let searchDir = sourceDir || "source";
    const pattern = path.join(process.cwd(), searchDir, "**", "*.brs");
    return fg.sync(pattern);
}

/**
 * Generates an execution scope and runs the tests.
 * @param files List of filenames to load into the execution scope
 * @param options BRS interpreter options
 */
async function run(brsSourceFiles: string[], options: CliOptions) {
    let {
        reporter,
        requireFilePath,
        forbidFocused,
        coverageReporters = [],
        fileMatches,
    } = options;
    let coverageEnabled = coverageReporters.length > 0;

    // Get the list of files that we should load into the execution scope.
    // Loading them here ensures that they only get lexed/parsed once.
    let inScopeFiles = [
        "roca_lib.brs",
        "assert_lib.brs",
        path.join("tap", "tap.brs"),
    ].map((basename) => path.join(__dirname, "..", "resources", basename));
    if (requireFilePath) {
        inScopeFiles.push(requireFilePath);
    }
    inScopeFiles.push(...brsSourceFiles);

    let testRunner = await createTestRunner(reporter);

    // Create an execution scope using the project source files and roca files.
    let execute: ExecuteWithScope;
    try {
        execute = await createExecuteWithScope(inScopeFiles, {
            root: process.cwd(),
            stdout: testRunner.reporterStream,
            stderr: process.stderr,
            generateCoverage: coverageEnabled,
            componentDirs: ["test", "tests"],
        });
    } catch (e) {
        console.error(
            `Stopping execution. Interpreter encountered errors:\n\t${formatInterpreterError(
                e
            )}`
        );
        process.exit(1);
    }

    let { testFiles, focusedCasesDetected } = await getTestFiles(
        execute,
        fileMatches
    );

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

        return {};
    }

    testRunner.run(execute, testFiles, focusedCasesDetected);
    testRunner.reporterStream.end();

    if (coverageEnabled) {
        reportCoverage(coverageReporters);
    }

    return testRunner.reporterStream.runner?.testResults || {};
}

/**
 * Returns the appropriate set of *.test.brs files, depending on whether it detects any focused tests.
 * Runs through the entire test suite (in non-exec mode) to determine this.
 * Also returns a boolean indicating whether focused tests were found.
 * @param execute The scoped execution function to run with each file
 */
async function getTestFiles(execute: ExecuteWithScope, fileMatches: string[]) {
    let testFiles = await globMatchFiles(fileMatches);

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
 * Finds all the test files that match a given list of strings. If the list is empty,
 * it finds all *.test.brs files.
 * @param testMatches A list of file path matches from the command line
 */
async function globMatchFiles(fileMatches: string[]) {
    fileMatches = fileMatches.map((match) => {
        if (path.parse(match).ext === ".brs") {
            // If the string is a brs file, use it directly.
            return match;
        } else {
            // If the string is not already a brs file, do partial matches on brs files
            // that contain the string, and also treat the string as a directory.
            return `{*${match}*.brs,*${match}*/**/*.brs}`;
        }
    });

    let testsPattern: string;
    if (fileMatches.length === 0) {
        testsPattern = `${process.cwd()}/{test,tests,source,components}/**/*.test.brs`;
    } else if (fileMatches.length === 1) {
        testsPattern = `${process.cwd()}/**/${fileMatches[0]}`;
    } else {
        testsPattern = `${process.cwd()}/**/{${fileMatches.join(",")}}`;
    }

    return fg.sync(testsPattern);
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

module.exports = async function (args: CliOptions) {
    let { sourceDir, ...options } = args;
    let files = await findBrsFiles(sourceDir);
    return await run(files, options);
};
