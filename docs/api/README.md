<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [API Overview](#api-overview)
  - [The `_brs_` object](#the-_brs_-object)
  - [The `roca` object](#the-roca-object)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# API Overview

As discussed in the [Getting started section](getting-started.md), there are two different libraries: `brs` for interpreting BrightScript code, and `roca` for running tests. Because of this, there are two different ways that APIs will be accessed.

## The `_brs_` object

Any **modifications** to your source code will be done through the APIs on the globally-accessible `_brs_` object. This includes things like mocking, triggering key events, getting stack traces, and more.

## The `roca` object

Any **test-case-specific** functions are done on the `roca` object, which is the `m` scope inside your test cases. This includes things like creating test suites/cases, modifying test case scope, asserting expected values, and more.
