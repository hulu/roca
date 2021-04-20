import * as c from "ansi-colors";
import * as path from "path";
import fastGlob from "fast-glob";

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
 * @param filePatterns A list of file path matches from the command line
 */
export async function globMatchFiles(filePatterns: string[]) {
    let parsedPatterns: string[] = [];
    filePatterns.forEach((match) => {
        if (path.parse(match).ext === ".brs") {
            // If the string is a brs file, match anything that ends with this file name.
            parsedPatterns.push(`*${match}`);
        } else {
            // Do a partial match on any files with this string in their name.
            parsedPatterns.push(`*${match}*.test.brs`);

            // Do a partial match on any directories with this string in their name.
            parsedPatterns.push(`*${match}*/**/*.test.brs`);
        }
    });

    let testsPattern: string = `${process.cwd()}/**/`;
    if (parsedPatterns.length === 0) {
        // If the user didn't specify any pattern, just look for .test.brs files.
        testsPattern += "*.test.brs";
    } else if (parsedPatterns.length === 1) {
        testsPattern += parsedPatterns[0];
    } else {
        testsPattern += `{${parsedPatterns.join(",")}}`;
    }

    // exclude node_modules from the test search
    return fastGlob([testsPattern, `!${process.cwd()}/node_modules/**/*`]);
}
