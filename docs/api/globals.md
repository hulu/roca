
# Globals
## roca(args = {})
Roca only has one global function &mdash; `roca` &mdash; used to initialize a new Roca test instance.  You probably want to call it only once.

### The `roca` object
This is the return value of calling `roca(args)`. Note that each property is documented in [the test suites and cases section](api/test-suites-and-cases.md) in greater detail.
```brightscript
{
    args: object, ' whatever was passed into the roca() call
    log: function,
    addContext: function,

    ' Suites
    describe: function,
    fdescribe: function,
    xdescribe: function,

    ' Cases
    it: function,
    fit: function,
    xit: function,

    ' Parameterized cases
    it_each: function,
    fit_each: function,
    xit_each: function,

    ' Setup
    beforeEach: function,
    afterEach: function
}
```

### Parameters 
**args** `object` \
The set of arguments provided by the Roca test framework. Set up the `main` function of your test case so it receives arguments, which you can then pass to this function.

### Return value 
The [`roca` object](#the-roca-object).

### Usage 
```brightscript
function main(args as object) as object
    r = roca(args)
    print r     ' => an instance of roca
    return r
end sub
```

## The `_brs_` object

For the most part, `brs` attempts to emulate BrightScript as closely as possible. However, in the spirit of unit testing, it also has a few extensions that will help with testing.

These extensions are all available on a global associative array called `_brs_`:
```brightscript
{
    getStackTrace: function,
    global: associative array,
    mockComponent: function,
    mockComponentPartial: function,
    mockFunction: function,
    resetMockComponent: function,
    resetMockComponents: function,
    resetMockFunction: function,
    resetMockFunctions: function,
    resetMocks: function,
    runInScope: function,
    process: associative array,
    triggerKeyEvent: function,
}
```
