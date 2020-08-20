
const { rocaInDir } = require("../util");

describe("before-after", () => {
    test("before-each", async () => {
        let results = await rocaInDir(__dirname, "before-each");

        expect(results.stats).toMatchObject({
            suites: 5,
            tests: 16,
            passes: 12,
            pending: 4,
            failures: 0
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "nested root suite 1 case 1.1" },
            { fullTitle: "nested root suite 1 case 1.2" },
            { fullTitle: "nested root suite 1 case 1.3" },
            { fullTitle: "nested root case 1" },
            { fullTitle: "nested root case 2" },
            { fullTitle: "nested root case 3" },
            { fullTitle: "single-level root case 1" },
            { fullTitle: "single-level root case 2" },
            { fullTitle: "single-level root case 3" },
            { fullTitle: "multiple-calls root case 1" },
            { fullTitle: "multiple-calls root case 2" },
            { fullTitle: "multiple-calls root case 3" },
        ]);
    });

    test("after-each", async () => {
        let results = await rocaInDir(__dirname, "after-each");

        expect(results.stats).toMatchObject({
            suites: 5,
            tests: 16,
            passes: 12,
            pending: 4,
            failures: 0
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "nested root suite 1 case 1.1" },
            { fullTitle: "nested root suite 1 case 1.2" },
            { fullTitle: "nested root suite 1 case 1.3" },
            { fullTitle: "nested root case 1" },
            { fullTitle: "nested root case 2" },
            { fullTitle: "nested root case 3" },
            { fullTitle: "single-level root case 1" },
            { fullTitle: "single-level root case 2" },
            { fullTitle: "single-level root case 3" },
            { fullTitle: "multiple-calls root case 1" },
            { fullTitle: "multiple-calls root case 2" },
            { fullTitle: "multiple-calls root case 3" },
        ]);
    });

    test("mixed", async () => {
        let results = await rocaInDir(__dirname, "mixed");

        expect(results.stats).toMatchObject({
            suites: 4,
            tests: 12,
            passes: 9,
            pending: 3,
            failures: 0
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "nested root suite 1 case 1.1" },
            { fullTitle: "nested root suite 1 case 1.2" },
            { fullTitle: "nested root suite 1 case 1.3" },
            { fullTitle: "nested root case 1" },
            { fullTitle: "nested root case 2" },
            { fullTitle: "nested root case 3" },
            { fullTitle: "single-level root case 1" },
            { fullTitle: "single-level root case 2" },
            { fullTitle: "single-level root case 3" },
        ]);
    });
});
