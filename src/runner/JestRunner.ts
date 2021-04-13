import { Config } from "@jest/types";
import { resetTestData, ExecuteWithScope, types as BrsTypes } from "brs";
import { JestReporter } from "../reporter/JestReporter";
import { TestRunner } from "./TestRunner";

export class JestRunner extends TestRunner {
    private reporter: JestReporter;

    constructor(
        readonly reporterStream: NodeJS.WriteStream & any,
        projectConfig: Config.ProjectConfig,
        globalConfig: Config.GlobalConfig,
        reporterType: string
    ) {
        super(reporterStream);

        this.reporter = new JestReporter(
            reporterStream,
            projectConfig,
            globalConfig,
            reporterType
        );
    }

    /** @override */
    protected _run(
        execute: ExecuteWithScope,
        executeArgs: BrsTypes.RoAssociativeArray,
        testFiles: string[]
    ) {
        this.reporter.onRunStart(testFiles.length);

        testFiles.forEach((filename, index) => {
            this.reporter.onFileStart(filename);
            try {
                resetTestData();
                execute([filename], [executeArgs]);
            } catch (reason) {
                this.reporter.onFileExecError(filename, index, reason);
            }
            this.reporter.onFileComplete();

            // Update the index so that our TAP reporting is correct.
            executeArgs.elements.set("index", new BrsTypes.Int32(index + 1));
        });

        this.reporter.onRunComplete();
    }
}
