const { rocaInDir } = require("../util");

describe("assert", () => {
    test("mock-function-calls", async () => {
        let results = await rocaInDir(__dirname, "mock-function-calls");
        debugger;

        expect(results.stats).toMatchObject({
            suites: 6,
            tests: 8,
            passes: 4,
            pending: 0,
            failures: 4,
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "hasBeenCalled success" },
            { fullTitle: "hasBeenCalledTimes success 0" },
            { fullTitle: "hasBeenCalledTimes success 1" },
            { fullTitle: "hasBeenCalledTimes success 10" },
        ]);

        expect(results.failures).toMatchObject([
            {
                fullTitle: "hasBeenCalled failure",
                err: {
                    actual: "0",
                    expected: "> 0",
                    message:
                        "Expected mock function 'fakeFunc' to have been called",
                    name: "m.assert.hasBeenCalled",
                },
            },
            {
                fullTitle: "hasBeenCalled wrong argument",
                err: {
                    actual: "{}",
                    expected: "[Mock Function]",
                    message:
                        "You must pass a mock function (created via `_brs_.mockFunction`) as the argument.",
                    name: "m.assert.hasBeenCalled",
                },
            },
            {
                fullTitle: "hasBeenCalledTimes failure too few calls",
                err: {
                    actual: "5",
                    expected: "4",
                    message:
                        "Expected mock function 'fakeFunc' to have been called 4 times",
                    name: "m.assert.hasBeenCalledTimes",
                },
            },
            {
                fullTitle: "hasBeenCalledTimes failure too many calls",
                err: {
                    actual: "5",
                    expected: "6",
                    message:
                        "Expected mock function 'fakeFunc' to have been called 6 times",
                    name: "m.assert.hasBeenCalledTimes",
                },
            },
        ]);
    });
});
