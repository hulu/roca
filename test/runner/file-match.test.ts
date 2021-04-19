import * as fg from "fast-glob";
import { globMatchFiles } from "../../src/util";

jest.mock("fast-glob");
let mockFastGlob = fg as jest.Mocked<typeof fg>;
mockFastGlob.sync.mockImplementation((args) => args as any);

describe("globMatchFiles", () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
        mockFastGlob.sync.mockClear();
        spy = jest.spyOn(process, "cwd");
        spy.mockReturnValue("cwd");
    });

    afterEach(() => {
        spy.mockRestore();
    });

    it("Looks in the default folders when given no strings", async () => {
        await globMatchFiles([]);

        expect(mockFastGlob.sync).toBeCalledTimes(1);
        expect(mockFastGlob.sync).toBeCalledWith("cwd/**/*.test.brs");
    });

    it("Looks for a file suffix when given a .brs extension", async () => {
        await globMatchFiles(["foo.test.brs"]);

        expect(mockFastGlob.sync).toBeCalledTimes(1);
        expect(mockFastGlob.sync).toBeCalledWith("cwd/**/*foo.test.brs");
    });

    it("Looks for both partial directory and file matches when not given a .brs extension", async () => {
        await globMatchFiles(["foo"]);

        expect(mockFastGlob.sync).toBeCalledTimes(1);
        expect(mockFastGlob.sync).toBeCalledWith(
            "cwd/**/{*foo*.test.brs,*foo*/**/*.test.brs}"
        );
    });

    it("Looks for all strings that are passed in", async () => {
        await globMatchFiles(["foo", "bar.test.brs"]);

        expect(mockFastGlob.sync).toBeCalledTimes(1);
        expect(mockFastGlob.sync).toBeCalledWith(
            "cwd/**/{*foo*.test.brs,*foo*/**/*.test.brs,*bar.test.brs}"
        );
    });
});
