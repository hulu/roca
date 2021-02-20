<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Roku unit testing](#roku-unit-testing)
  - [How does it work?](#how-does-it-work)
  - [How do I use it?](#how-do-i-use-it)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Roku unit testing

Unit testing. BrightScript. **Without a device**. Yep, you read that right.

## How does it work?

There are two libraries that make the magic happen: [`brs`](https://github.com/sjbarag/brs) and [`roca`](https://github.com/hulu/roca). `brs` is an interpreter for the BrightScript language, and `roca` is a test runner (think: [mocha](https://mochajs.org/) for BrightScript).

Essentially, the flow is:
1. You tell `roca` to find and run your tests.
1. `roca` tells `brs` to parse and interpret all of your source files.
1. `roca` sends each test file to `brs`, which parses/interprets/executes the test, reports it back to `roca`.
1. `roca` gathers all of the results, and reports them back to you.

## How do I use it?

See the [Quick start](getting-started/quick-start.md.md) page for a guide to installing and writing your first test case.
