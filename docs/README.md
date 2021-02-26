# Roku unit testing

Unit testing. BrightScript. **Without a device**. Yep, you read that right.

## How does it work?

There are two libraries that make the magic happen: [`brs`](https://github.com/sjbarag/brs) and [`roca`](https://github.com/hulu/roca). `brs` is an interpreter for the BrightScript language, and `roca` is a test runner (think: [mocha](https://mochajs.org/) for BrightScript).

Essentially, the flow is:
1. You tell `roca` to find and run your tests.
1. `roca` tells `brs` to parse and interpret all of your source files to create an execution scope that each test will run in.
1. `roca` sends each test file to `brs`, which parses/interprets/executes the test.
1. Based on the [asserts](api/reference/asserts.md) in each test, `roca` reports the results in [TAP output](https://testanything.org/), which gets automatically parsed and reported back to you in the format of whichever [Mocha reporter](api/cli-options.md) you choose.

## How do I use it?

See the [Quick start](getting-started/quick-start.md.md) page for a guide to installing and writing your first test case.
