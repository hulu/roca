const { rocaInDir } = require("../util");

describe("selection", () => {
    test("fdescribe", async () => {
        let results = await rocaInDir(__dirname, "fdescribe");

        expect(results.stats).toMatchObject({
            suites: 9,
            tests: 3,
            passes: 3,
            pending: 0,
            failures: 0
        });

        expect(results.tests).toMatchObject([
            { fullTitle: "root suite 2 suite 2.2 case 2.2.1" },
            { fullTitle: "root suite 2 case 2.1" },
            { fullTitle: "root suite 3 suite 3.2 case 3.2.1" },
        ]);
    });

    test("xdescribe", async () => {
        let results = await rocaInDir(__dirname, "xdescribe");

        expect(results.stats).toMatchObject({
            suites: 13,
            tests: 6,
            passes: 3,
            pending: 3,
            failures: 0
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "root suite 1 case 1.1" },
            { fullTitle: "root suite 3 suite 3.3 case 3.3.1" },
            { fullTitle: "root suite 3 case 3.1" },
        ]);
    });

    test("fit", async () => {
        let results = await rocaInDir(__dirname, "fit");

        expect(results.stats).toMatchObject({
            tests: 1,
            passes: 1,
            pending: 0,
            failures: 0
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "root 1 suite 2 case 2.1" },
        ]);
    });

    test("xit", async () => {
        let results = await rocaInDir(__dirname, "xit");

        expect(results.stats).toMatchObject({
            tests: 8,
            passes: 7,
            pending: 1,
            failures: 0
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "root 2 suite 2 case 2.1" },
            { fullTitle: "root 2 suite 2 case 2.2" },
            { fullTitle: "root 2 case 1.1" },
            { fullTitle: "root 2 case 3.1" },
            { fullTitle: "root 1 suite 2 case 2.2" },
            { fullTitle: "root 1 case 1.1" },
            { fullTitle: "root 1 case 3.1" },
        ]);
    });
});