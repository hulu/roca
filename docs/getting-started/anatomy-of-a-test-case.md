# Anatomy of a test case

Just like [Mocha](https://mochajs.org/) tests are written in JavaScript, roca tests are written in BrightScript.  Roca will recursively find and execute all files that match `*.test.brs` in any of the following directories: `source/`, `components/`, `tests/`, and `test/`.

## Requirements

The smallest possible unit test must meet the following requirements:

1. A function called `main` that accepts one argument of type `object` and returns a value of type `object`
2. That `main` function initializes a Roca instance by passing the arguments from (1) into `roca()`.
3. That `main` function returns the return value of the `someRocaInstance.describe()` function
4. A test case declared with `m.it`
5. The test case passes or fails with `m.pass()`, `m.fail()`, or an assertion that calls one of those.

Put simply:
```brightscript
function main(args as object) as object
    return roca(args).describe("test suite", sub()
        m.it("has a test case", sub()
            m.pass()
        end sub)
    end sub)
end function
```
