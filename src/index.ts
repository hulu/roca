import * as brs from "brs";
import { glob } from "glob";
import * as path from "path";
import * as util from "util";
import * as c from "ansi-colors";
import { ReportOptions } from "istanbul-reports";
import TapMochaReporter = require("tap-mocha-reporter");
import { reportCoverage } from "./coverage";

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
    return util.promisify(glob)(pattern);
}

async function runTest(files: string[], options: Options) {
    let {
        reporter,
        requireFilePath,
        forbidFocused,
        coverageReporters = [],
    } = options;
    let coverageEnabled = coverageReporters.length > 0;

    let rocaFiles = [
        "tap.brs",
        "roca_lib.brs",
        "roca_main.brs",
        "assert_lib.brs",
    ].map((basename) => path.join(__dirname, "..", "resources", basename));

    let reporterStream = new TapMochaReporter(reporter);
    let allTestFiles = [...rocaFiles];
    if (requireFilePath) {
        allTestFiles.push(requireFilePath);
    }
    allTestFiles.push(...files);

    try {
        let returnVals = await brs.execute(allTestFiles, {
            root: process.cwd(),
            stdout: reporterStream,
            stderr: process.stderr,
            generateCoverage: coverageEnabled,
            componentDirs: ["test", "tests"],
        });

        reporterStream.end();

        if (coverageEnabled) {
            reportCoverage(coverageReporters);
        }

        if (forbidFocused && returnVals.length > 0) {
            checkForFocusedCases(returnVals);
        }
    } catch (e) {
        console.error("Interpreter found an error: ", e);
        process.exitCode = 1;
    }
}

/**
 * Checks an array of brs elements to see if they have a non-empty focused cases field.
 * @param elements The elements to check for focused cases
 */
function checkForFocusedCases(elements: brs.types.BrsType[]) {
    // iterate through elements and see if there are focused cases
    for (let output of elements) {
        if (output instanceof brs.types.RoAssociativeArray) {
            let maybeFiles = output.getValue().get("fileswithfocusedcases");
            let focusedFiles = maybeFiles instanceof brs.types.RoArray ? maybeFiles.getElements() : [];
            if (focusedFiles.length > 0) {
                let formattedList = focusedFiles
                    .map((brsStringPath) => `\t${brsStringPath.toString()}`)
                    .join("\n");
                console.error(
                    c.red(
                        `Error: used command line arg ${c.cyan(
                            "--forbid-focused"
                        )} but found focused tests in these files:\n${formattedList}`
                    )
                );

                process.exitCode = 1;
                return;
            }
        }
    }
}

module.exports = async function (args: { sourceDir: string | undefined } & Options) {
    let { sourceDir, ...options } = args;
    let files = await findBrsFiles(sourceDir);
    return await runTest(files, options);
};
