const { rocaInDir } = require("../util");

describe("parameterized tests", () => {
    test("it_each", async () => {
        let results = await rocaInDir(__dirname, "it_each");

        expect(results.stats).toMatchObject({
            suites: 1,
            tests: 3,
            passes: 3,
            pending: 0,
            failures: 0,
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "root case 1" },
            { fullTitle: "root case 2" },
            { fullTitle: "root case 3" },
        ]);
    });

    test("fit_each", async () => {
        let results = await rocaInDir(__dirname, "fit_each");

        expect(results.stats).toMatchObject({
            suites: 1,
            tests: 3,
            passes: 3,
            pending: 0,
            failures: 0,
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "root case 1" },
            { fullTitle: "root case 2" },
            { fullTitle: "root case 3" },
        ]);
    });

    test("xit_each", async () => {
        let results = await rocaInDir(__dirname, "xit_each");

        expect(results.stats).toMatchObject({
            suites: 1,
            tests: 4,
            passes: 1,
            pending: 3,
            failures: 0,
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "root ignores xit_each" },
        ]);
    });
});
