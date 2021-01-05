import * as brs from "brs";
import { glob } from "glob";
import * as path from "path";
import * as util from "util";
import * as c from "ansi-colors";
import { ReportOptions } from "istanbul-reports";
import TapMochaReporter = require("tap-mocha-reporter");
import { reportCoverage } from "./coverage";

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

async function run(files: string[], options: Options) {
    let {
        reporter,
        requireFilePath,
        forbidFocused,
        coverageReporters = [],
    } = options;
    let coverageEnabled = coverageReporters.length > 0;

    let rocaFiles = [
        path.join("hasFocusedCases", "hasFocusedCases.brs"),
        "roca_lib.brs",
        "assert_lib.brs",
    ].map((basename) => path.join(__dirname, "..", "resources", basename));

    let inScopeFiles = [...rocaFiles];
    if (requireFilePath) {
        inScopeFiles.push(requireFilePath);
    }
    inScopeFiles.push(...files);

    let reporterStream = new TapMochaReporter(reporter);
    let execute: brs.ExecuteWithScope;
    try {
        execute = await brs.createExecuteWithScope(inScopeFiles, {
            root: process.cwd(),
            stdout: reporterStream,
            stderr: process.stderr,
            generateCoverage: coverageEnabled,
            componentDirs: ["test", "tests"],
        });
    } catch (e) {
        console.error("Interpreter found an error: ", e);
        process.exit(1);
    }

    let { testFiles, focusedCasesDetected } = await getTestFiles(execute);
    await runTestFiles(execute, testFiles, focusedCasesDetected);

    reporterStream.end();

    if (coverageEnabled) {
        reportCoverage(coverageReporters);
    }

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
 * Loops through the given test files and executes each one. If an interpreter exception is encountered,
 * then it exits with status code 1.
 * @param execute The function to execute each file with
 * @param testFiles The files to execute
 * @param focusedCasesDetected Whether or not focused cases were detected
 */
async function runTestFiles(execute: brs.ExecuteWithScope, testFiles: string[], focusedCasesDetected: boolean) {
    let tap = execute(
        [path.join(__dirname, "..", "resources", "tap.brs")],
        [new brs.types.Int32(testFiles.length)]
    );
    let runArgs = generateRunArgs(tap, focusedCasesDetected);
    let indexString = new brs.types.BrsString("index");

    testFiles.forEach((filename, index) => {
        try {
            execute([filename], [runArgs]);
            runArgs.set(indexString, new brs.types.Int32(index));
        } catch (e) {
            console.error(`Interpreter found an error in ${filename}: `, e);
            process.exit(1);
        }
    });
}

/**
 * Returns the appropriate set of *.test.brs files, depending on whether it detects any focused tests.
 * Also returns a boolean indicating whether focused tests were found.
 * @param execute The scoped execution function to run with each file
 */
async function getTestFiles(execute: brs.ExecuteWithScope) {
    let testsPattern = path.join(
        process.cwd(),
        `{test,tests,source,components}`,
        "**",
        "*.test.brs"
    );
    let testFiles: string[] = await globPromise(testsPattern);

    let focusedSuites: string[] = [];
    let emptyRunArgs = new brs.types.RoAssociativeArray([]);
    let scriptPath = path.join(
        __dirname,
        "..",
        "resources",
        "hasFocusedCases",
        "main.brs"
    );
    testFiles.forEach((filename) => {
        try {
            let suite = execute([filename], [emptyRunArgs]);
            let hasFocusedCases = execute([scriptPath], [suite]);
            if (
                brs.types.isBrsBoolean(hasFocusedCases) &&
                hasFocusedCases.toBoolean()
            ) {
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
 * Generates the run arguments for roca, to pass to test files when executing them.
 * @param tap The return value from tap.brs (an instance of the Tap object)
 * @param focusedCasesDetected Whether or not there are focused cases in this run
 */
function generateRunArgs(
    tap: brs.types.BrsType,
    focusedCasesDetected: boolean
) {
    return new brs.types.RoAssociativeArray([
        {
            name: new brs.types.BrsString("exec"),
            value: brs.types.BrsBoolean.from(true),
        },
        {
            name: new brs.types.BrsString("focusedCasesDetected"),
            value: brs.types.BrsBoolean.from(focusedCasesDetected),
        },
        {
            name: new brs.types.BrsString("index"),
            value: new brs.types.Int32(0),
        },
        {
            name: new brs.types.BrsString("tap"),
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
