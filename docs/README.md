# Roca

BrightScript unit testing.  No device required.

## Getting Started
Note: All examples use `npm`, but these steps should be easily adapted to [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.js.org/), and many other JavaScript package managers.

### Install
Roca requires the [brs](https://github.com/sjbarag/brs/) runtime, which runs on [node.js](https://nodejs.org/en/).  If needed, initialize an NPM project with:

```bash
npm init
```

Then install `@hulu/roca` as a development dependency with:

```bash
npm install --save-dev @hulu/roca
```

### Add NPM hook
To allow `npm test` to run your unit tests, simply call `roca` in your `package.json`'s "test" script:

```jsonc
{
    // ...
    scripts: {
        "test": "roca"
    }
}
```

### Adding a Test
Just like [Mocha](https://mochajs.org/) tests are written in JavaScript, roca tests are written in BrightScript.  By default, roca will find and execute all files in the `test/` directory that match `*.test.brs`.  The smallest possible unit test must meet the following requirements:

1. A function called `main` that accepts one argument of type `object` and returns a value of type `object`
2. That `main` function returns the return value of a top-level `describe` function that accepts the argument from (1)
3. A test case declared with `m.it`
4. The test case passes or fails with `m.pass()`, `m.fail()`, or an assertion that calls one of those

Put simply:

```brightscript
function main(args as object) as object
    return describe("test suite", sub()
        m.it("has a test case", sub()
            m.pass()
        end sub)
    end sub, args)
end function
```

### Output & CI Support
Roca exclusively reports its state via the [Test Anything Protocol](http://testanything.org/), and defaults to a Mocha-like "spec" output.  Failed tests cause the `roca` CLI to return a non-zero exit code, which allows most continuous integration systems to automatically detect pass/fail states.

Other output formats are available!  See `roca --help` for more details.

## API
### Global Functions
#### `describe(description as string, func as object, args = invalid as object) as object`
Roca only has one global function &mdash; `describe` &mdash; used to declare test suites with arbitrary nesting.

Parameters:
* `description as string` - a string describing the suite of tests contained within this `describe` function
* `func as object` - the function to execute as part of this suite
* `args = invalid as object` - (optional) the set of arguments provided by the Roca test framework

Return value:
* the newly-created test suite, including state, as an associative array

Example:
```brightscript
describe("a test suite", sub()
    ' this is a test suite!
end sub)
```

### Within a Test Suite
Defining a test case matches the semantics of [Jasmine](https://jasmine.github.io/), using `it`, `fit`, and `xit` functions accessible on the `m` scope within a suite.

#### `m.it(description as string, func as object)`
Creates a test case with a given description.

Parameters:
* `description as string` - a string describing the test case executed by `func`
* `func as object` - the function to execute as part of this test case

Example:
```brightscript
m.it("a test case", sub()
    if 4 / 2 = 2 then
        m.pass()
    else
        m.fail()
    end if
end sub)
```

#### `m.fit(description as string, func as object)`
Creates a focused test case &mdash; a test case that causes all non-focused tests *in all files* to be skipped.  Useful when debugging specific unit tests.

Parameters:
* `description as string` - a string describing the test case executed by `func`
* `func as object` - the function to execute as part of this test case

Example:
```brightscript
m.it("a test case", sub()
    ' this test won't run, because another is focused
end sub)

m.fit("a focused test case", sub()
    ' this test *will* be executed, because it's focused
    if 1 + 1 = 3 then
        m.pass()
    else
        m.fail()
    end if
end sub)
```

#### `m.xit(description as string, func as object)`
Creates a skipped unit test case.  It will never execute.

Parameters:
* `description as string` - a string describing the test case executed by `func`
* `func as object` - the (skipped) function to execute as part of this test case

Example:
```brightscript
m.xit("a focused test case", sub()
    m.fail() ' this test will never be executed, so it doesn't matter if it's explicitly failed
end sub)
```

### Within a Test Case
#### `m.log(value as dynamic)`
Prints a value to the console in a TAP-safe way.

Parameters:
* `value as dynamic` - the value to print to the console

Example:
```brightscript
m.it("prints diagnostic info", sub()
    m.log(someFunctionCall())
end sub)
```

#### `m.pass()`
Marks a unit test as passing, overriding any previous "failed" states.

Example:
```brightscript
m.it("passes", sub()
    m.pass()
end sub)
```

#### `m.fail()`
Marks a unit test as failing, overriding any previous "passed" states.

Example:
```brightscript
m.it("fails", sub()
    m.fail()
end sub)
```
