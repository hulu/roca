import * as c from "ansi-colors";

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
