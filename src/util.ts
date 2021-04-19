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
    fileMatches = fileMatches.map((match) => {
        if (path.parse(match).ext === ".brs") {
            // If the string is a brs file, use it directly.
            return match;
        } else {
            // If the string is not already a brs file, do partial matches on brs files
            // that contain the string, and also treat the string as a directory.
            // This allows us to match all files/directories that contain the string.
            return `{*${match}*.brs,*${match}*/**/*.brs}`;
        }
    });

    let testsPattern: string;
    if (fileMatches.length === 0) {
        // If the user didn't specify any pattern, just look for .test.brs files.
        testsPattern = `${process.cwd()}/{test,tests,source,components}/**/*.test.brs`;
    } else if (fileMatches.length === 1) {
        testsPattern = `${process.cwd()}/**/${fileMatches[0]}`;
    } else {
        testsPattern = `${process.cwd()}/**/{${fileMatches.join(",")}}`;
    }

    return fg.sync(testsPattern);
}
