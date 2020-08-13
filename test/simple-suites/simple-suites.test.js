const { rocaInDir } = require("../util");

describe("simple-suites", () => {
    test("single-level", async () => {
        let results = await rocaInDir(__dirname, "single-level");

        expect(results.stats).toMatchObject({
            suites: 1,
            tests: 3,
            passes: 1,
            pending: 1,
            failures: 1
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "suite case 1" },
        ]);
        expect(results.pending).toMatchObject([
            { fullTitle: "suite case 2" },
        ]);
        expect(results.failures).toMatchObject([
            { fullTitle: "suite case 3" },
        ]);
    });

    test("nested", async () => {
        let results = await rocaInDir(__dirname, "nested");

        expect(results.stats).toMatchObject({
            tests: 11,
            passes: 11,
            pending: 0,
            failures: 0
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "root lorem ipsum dolor sit amet case" },
            { fullTitle: "root lorem ipsum dolor sit case 1" },
            { fullTitle: "root lorem ipsum dolor sit case 2" },
            { fullTitle: "root lorem ipsum dolor case 1" },
            { fullTitle: "root lorem ipsum dolor case 2" },
            { fullTitle: "root lorem ipsum case 1" },
            { fullTitle: "root lorem ipsum case 2" },
            { fullTitle: "root lorem case 1" },
            { fullTitle: "root lorem case 2" },
            { fullTitle: "root case 1" },
            { fullTitle: "root case 2" },
        ]);
    });

    test("multiple-files", async () => {
        let results = await rocaInDir(__dirname, "multiple-files");

        expect(results.stats).toMatchObject({
            tests: 4,
            passes: 4,
            pending: 0,
            failures: 0
        });

        expect(results.tests).toMatchObject([
            { fullTitle: "bar case 1" },
            { fullTitle: "bar case 2" },
            { fullTitle: "foo case 1" },
            { fullTitle: "foo case 2" },
        ]);

        expect(results.passes).toMatchObject([
            { fullTitle: "bar case 1" },
            { fullTitle: "bar case 2" },
            { fullTitle: "foo case 1" },
            { fullTitle: "foo case 2" },
        ]);
    });

    test("no-cases", async () => {
        let results = await rocaInDir(__dirname, "no-cases");
        expect(results.stats).toMatchObject({
            tests: 1,
            suites: 1,
            passes: 1, // a suite counts as a test, and therefore passes
            pending: 0,
            failures: 0
        });
    });
});
