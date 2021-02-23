# API Overview

As discussed in the [Getting started section](getting-started.md), there are two different libraries: `brs` for interpreting BrightScript code, and `roca` for running tests. Because of this, there are two different ways that APIs will be accessed.

## The `_brs_` object

Any **modifications** to your source code will be done through the APIs on the globally-accessible `_brs_` object. This includes things like mocking, triggering key events, getting stack traces, and more.

## The `roca` object

Any **test-case-specific** functions are done on the `roca` object, which is what gets returned from calling [`roca(args)`](api/reference/globals?id=the-roca-object). From here, you can do things like creating test suites/cases, modifying test case scope, asserting expected values, and more.
