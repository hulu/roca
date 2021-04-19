import * as c from "ansi-colors";
import * as path from "path";
import fg from "fast-glob";

export function formatInterpreterError(error: any) {
    if (!Array.isArray(error)) {
        return error.toString();
    }

    return error
        .map(
            (e) =>
                `${e}\n\t\t` +
                c.dim(
                    `at ${e.location.file}:${e.location.start.line}:${e.location.start.column}`
                )
        )
        .join("\n\t");
}

/**
 * Finds all the test files that match a given list of strings. If the list is empty,
 * it finds all *.test.brs files.
 * @param fileMatches A list of file path matches from the command line
 */
export async function globMatchFiles(fileMatches: string[]) {
    let parsedMatches: string[] = [];
    fileMatches.forEach((match) => {
        if (path.parse(match).ext === ".brs") {
            // If the string is a brs file, match anything that ends with this file name.
            parsedMatches.push(`*${match}`);
        } else {
            // Do a partial match on any files with this string in their name.
            parsedMatches.push(`*${match}*.test.brs`);

            // Do a partial match on any directories with this string in their name.
            parsedMatches.push(`*${match}*/**/*.test.brs`);
        }
    });

    let testsPattern: string;
    if (parsedMatches.length === 0) {
        // If the user didn't specify any pattern, just look for .test.brs files.
        testsPattern = `${process.cwd()}/{test,tests,source,components}/**/*.test.brs`;
    } else if (parsedMatches.length === 1) {
        testsPattern = `${process.cwd()}/**/${parsedMatches[0]}`;
    } else {
        testsPattern = `${process.cwd()}/**/{${parsedMatches.join(",")}}`;
    }

    return fg.sync(testsPattern);
}
