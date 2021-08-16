const { rocaInDir } = require("../util");

describe("assert", () => {
    test("mock-function-calls", async () => {
        let results = await rocaInDir(__dirname, "mock-function-calls");

        expect(results.passes).toMatchObject([
            { fullTitle: "hasBeenCalled success" },
            { fullTitle: "hasBeenCalledTimes success 0" },
            { fullTitle: "hasBeenCalledTimes success 1" },
            { fullTitle: "hasBeenCalledTimes success 10" },
            { fullTitle: "hasBeenCalledWith success no args" },
            { fullTitle: "hasBeenCalledWith success primitive arg" },
            { fullTitle: "hasBeenCalledWith success complex arg" },
            { fullTitle: "hasBeenCalledWith success multiple args" },
            { fullTitle: "hasBeenCalledWith success multiple calls" },
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
            {
                fullTitle: "hasBeenCalledWith failure not called",
                err: {
                    actual: "",
                    expected: "(foo)",
                    message:
                        "Expected mock function 'fakeFunc' to have been called with args (foo)",
                    name: "m.assert.hasBeenCalledWith",
                },
            },
            {
                fullTitle: "hasBeenCalledWith failure incorrect arg",
                err: {
                    actual: "(foo)",
                    expected: "(bar)",
                    message:
                        "Expected mock function 'fakeFunc' to have been called with args (bar)",
                    name: "m.assert.hasBeenCalledWith",
                },
            },
            {
                fullTitle: "hasBeenCalledWith failure too many actual args",
                err: {
                    actual: "(foo, 123)",
                    expected: "(123)",
                    message:
                        "Expected mock function 'fakeFunc' to have been called with args (123)",
                    name: "m.assert.hasBeenCalledWith",
                },
            },
            {
                fullTitle: "hasBeenCalledWith failure too few actual args",
                err: {
                    actual: "(foo)",
                    expected: "(foo, 123)",
                    message:
                        "Expected mock function 'fakeFunc' to have been called with args (foo, 123)",
                    name: "m.assert.hasBeenCalledWith",
                },
            },
            {
                fullTitle:
                    "hasBeenCalledWith failure multiple calls, no matches",
                err: {
                    actual: '(["foo","bar"], 123) or ([], 456)',
                    expected: '(["baz"], 456)',
                    message:
                        "Expected mock function 'fakeFunc' to have been called with args ([\"baz\"], 456)",
                    name: "m.assert.hasBeenCalledWith",
                },
            },
        ]);
    });
});
