import chalk from "chalk";
import { printDiffOrStringify } from "jest-matcher-utils";
import type { Context } from "@jest/reporters";
import type { AssertionResult, Status } from "@jest/test-result";
import type { ProjectConfig } from "@jest/types/build/Config";

export interface Diag {
    [key: string]: unknown;
    error: {
        name: string;
        message: string;
        stackframes: string[];
    };
    wanted: string;
    found: string;
}

export interface Assert {
    ok: boolean;
    id: number;
    name: string;
    fullname: string;
    todo?: string | boolean;
    skip?: string | boolean;
    diag?: Diag;
}

/**
 * This generates a Jest Context-like object. We are coercing the type
 * because Jest expects some internal stuff that we have no need for, and doesn't
 * affect the execution of the functions we're using.
 * @param config The Jest Project config
 */
export function createContext(config: ProjectConfig): Context {
    return { config } as Context;
}

/**
 * Utility function that creates a Jest AssertionResult for a test suite.
 * @param status The result status of the test suite
 * @param name The name of the test case
 * @param ancestorName Any ancestor suite names
 * @param failureMessage The optional failure message for the suite
 */
export function createAssertionResult(
    status: Status,
    name: string,
    ancestorTitles: string[],
    failureMessage?: string
): AssertionResult {
    return {
        status,
        ancestorTitles,
        title: name,
        fullName: name,
        failureMessages: failureMessage ? [failureMessage] : [],
        failureDetails: [],
        numPassingAsserts: 0,
    };
}

/**
 * Jest expects a specific format for the stack trace and error message
 * in order to generate the code frame, so this is a utility to generate it.
 * @param diag The diagnostics object from an assert
 */
export function createFailureMessage(diag: Diag) {
    let {
        error: { stackframes, message, name },
        wanted,
        found,
    } = diag;
    let diff: string | null = null;
    process.stderr.write(JSON.stringify(diag, null, 2));
    if (wanted && found) {
        diff = printDiffOrStringify(
            wanted,
            found,
            "Expected",
            "Received",
            /* expand */ false
        );
    }

    let formattedStackTrace = stackframes
        .map((line, index) => {
            if (index === 0 && name) {
                return "at " + name + " (" + line + ")";
            } else {
                return "at " + line;
            }
        })
        .join("\n");

    let fullMessage = chalk.red(message) + "\n\n";
    if (diff) {
        fullMessage += diff + "\n";
    }
    fullMessage += formattedStackTrace;
    return fullMessage;
}
