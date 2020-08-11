const { rocaInDir } = require("../util");

describe("bar", () => {
    it("bars", async () => {
        let results = await rocaInDir(__dirname);

        expect(results.stats).toMatchObject({
            suites: 1,
            tests: 2,
            passes: 2,
            pending: 0,
            failures: 0
        });

        expect(results.passes).toMatchObject([
            { fullTitle: "bar suite has a test case" },
            { fullTitle: "bar suite has another test case" }
        ]);
    });
});
