import { globMatchFiles } from "../../src/util";

let wrappedGlobMatchFiles = async (filePatterns: string[]) => {
    let results = await globMatchFiles(filePatterns);
    return results.map((result) => result.split(__dirname + "/resources/")[1]);
};

describe("globMatchFiles", () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
        spy = jest.spyOn(process, "cwd");
        spy.mockReturnValue(__dirname + "/resources");
    });

    afterEach(() => {
        spy.mockRestore();
    });

    it("Finds all .test.brs files when not given patterns", async () => {
        let results = await wrappedGlobMatchFiles([]);
        expect(results).toEqual([
            "fly-you-fools.test.brs",
            "bar/bar-suffix.test.brs",
            "bar/bar.test.brs",
            "bar/prefix-bar.test.brs",
            "foo/main.test.brs",
            "foo2/main.test.brs",
        ]);
    });

    it("Partially matches on filename suffix when given a .brs extension", async () => {
        let results = await wrappedGlobMatchFiles(["bar.test.brs"]);
        expect(results).toEqual([
            "bar/bar.test.brs",
            "bar/prefix-bar.test.brs",
        ]);
    });

    it("Can handle asterisks in pattern", async () => {
        let results = await wrappedGlobMatchFiles(["bar*.test.brs"]);
        expect(results).toEqual([
            "bar/bar-suffix.test.brs",
            "bar/bar.test.brs",
            "bar/prefix-bar.test.brs",
        ]);
    });

    it("Looks for both partial directory and file matches when not given a .brs extension", async () => {
        let results = await wrappedGlobMatchFiles(["foo"]);
        expect(results).toEqual([
            "fly-you-fools.test.brs",
            "foo/main.test.brs",
            "foo2/main.test.brs",
        ]);
    });

    it("Excludes files when handling directories", async () => {
        let results = await wrappedGlobMatchFiles(["foo/"]);
        expect(results).toEqual(["foo/main.test.brs"]);
    });

    it("Handles a .brs file without .test if explicitly told to", async () => {
        let results = await wrappedGlobMatchFiles(["no-test-ext.brs"]);
        expect(results).toEqual(["no-test-ext.brs"]);
    });

    it("Handles multiple patterns", async () => {
        let results = await wrappedGlobMatchFiles(["main", "prefix"]);
        expect(results).toEqual([
            "bar/prefix-bar.test.brs",
            "foo/main.test.brs",
            "foo2/main.test.brs",
        ]);
    });
});
