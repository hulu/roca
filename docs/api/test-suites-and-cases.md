# Test suites and cases
Defining a test case matches the semantics of [Jasmine](https://jasmine.github.io/), using `it` (or `fit` and `xit`) and `describe` functions accessible on the `m` scope within a suite.

------------


## m.afterEach(func)
Runs the given `func` after each child test suite and case.

It will run in the `m` context of the preceding test or suite, which will allow you to set fields on `m` within the test case and access them in `afterEach`. However, **the `m` contex is different for each test/suite, so if you need state to be shared across multiple tests/suites, you can use [`m.addContext`](#maddcontextcontext)**.

### Parameters 
**func** `function` \
The function to execute after to each child test/suite.
------------

### Return value 
None.

### Usage 
```brightscript
m.describe("a test suite", sub()
    m.afterEach(sub()
        doSomeCoolTeardown()
        print m.foo ' => "bar" (after first test)
                    ' => invalid (after second test)
    end sub)

    m.it("a test case", sub()
        m.foo = "bar"
        m.pass()
    end sub)

    m.it("a second test case", sub()
        m.pass()
    end sub)
end sub)
```
<br/>

------------


## m.beforeEach(func)
Runs the given `func` before each child test suite and case.

It will run in the `m` context of the following test or suite, which will allow you to set fields on `m` within `beforeEach` and access them in the test or suite. However, **the `m` contex is different for each test/suite, so if you need state to be shared across multiple tests/suites, you can use [`m.addContext`](#maddcontextcontext)**.

### Parameters 
**func** `function` \
The function to execute prior to each child test/suite.
------------

### Return value 
None.

### Usage 
```brightscript
m.describe("a test suite", sub()
    m.beforeEach(sub()
        doSomeCoolMocksOrSetup()
        m.foo = "bar"
    end sub)

    m.it("a test case", sub()
        print m.foo ' => "bar"
        m.iWannaShareThis = true

        m.pass()
    end sub)

    m.it("a second test case", sub()
        print m.foo ' => "bar"
        print m.iWannaShareThis ' => invalid

        m.pass()
    end sub)
end sub)
```
<br/>

------------



## m.describe(description, func)
Creates a new test suite that will contain test cases.  Note that there must always be one root suite, created by calling `describe()` directly on the result of `roca()`.

### Parameters 
**description** `object`\
A string describing the test case executed by `func`.
------------
**func** `object`\
The function to execute as part of this test suite.
------------

### Return value 
An object containing (private) properties such as test-pass state and test cases. You won't need to use this object tests.

### Usage 
```brightscript
function main(args as object) as object
    roca(args).describe("a test suite", sub()
        ' this function is executed when the suite is executed

        m.describe("a sub-suite", sub()
            m.describe("a sub-sub-suite", sub()
                ' sub-suites can be nested arbitrarily
            end sub)
        end sub)
    end sub)
end function
```
<br/>

------------


## m.fdescribe(description, func)
Creates a focused test suite &mdash; a test suite that causes all non-focused tests *in all files* to be ignored.  Useful when debugging specific sets of unit tests.

### Parameters 
**description** `object`\
A string describing the test case executed by `func`.
------------
**func** `object`\
The function to execute as part of this test suite.
------------

### Return value 
An object containing (private) properties such as test-pass state and test cases. You won't need to use this object tests.

### Usage 
```brightscript
m.describe("an unfocused test suite", sub()
    m.it("a test case", sub()
        ' this test won't run, because another suite is focused
    end sub)
end sub)

m.fdescribe("a focused test suite", sub()
    m.it("a test case inside of a focused suite", sub()
        ' this test *will* be executed, because it's inside a focused suite
    end sub)

    ' This sub-suite will run, because it's inside of a focused suite
    m.describe("a sub-suite", sub()
        m.it("a test case inside of the sub-suite", sub()
            ' this test *will* be executed, because it has focused ancestors
        end sub)
    end sub)
end sub)
```
<br/>

------------


## m.xdescribe(description, func)
Creates a skipped unit test suite.  Any tests and sub-suites inside it will never execute.

### Parameters 
**description** `string` \
A string describing the test case executed by `func`.
------------
**func** `function` \
The function to execute as part of this test case.
------------

### Return value 
An object containing (private) properties such as test-pass state and test cases. You won't need to use this object tests.

### Usage 
```brightscript
m.xdescribe("an skipped test suite", sub()
    m.it("a test case", sub()
        ' this test will be skipped, because it's inside of a skipped suite
    end sub)

    ' This sub-suite will be skipped, because it's inside of a skipped suite
    m.describe("a sub-suite", sub()
        m.it("a test case inside of the sub-suite", sub()
            ' this test will be skipped, because it has skipped ancestors
        end sub)
    end sub)
end sub)
```
<br/>

------------


## m.it(description, func, args = invalid)
Creates a test case with a given description.

### Parameters 
**description** `string` \
A string describing the test case executed by `func`.
------------
**func** `object` \
The function to execute as part of this test case.
------------
**args** `dynamic` _optional_ \
Optional parameter that will be passed in to `func` as an argument.
------------

### Return value 
None.

### Usage 
```brightscript
m.it("a test case", sub()
    if 4 / 2 = 2 then
        m.pass()
    else
        m.fail()
    end if
end sub)

m.it("a test case with args", sub(count)
    if count > 0 then m.pass() else m.fail()
end sub, 10)
```
<br/>

------------


## m.fit(description, func, args = invalid)
Creates a focused test case &mdash; a test case that causes all non-focused tests *in all files* to be skipped.  Useful when debugging specific unit tests.

### Parameters 
**description** `string` \
A string describing the test case executed by `func`.
------------
**func** `object` \
The function to execute as part of this test case.
------------
**args** `dynamic` _optional_ \
Optional parameter that will be passed in to `func` as an argument.
------------

### Return value 
None.

### Usage 
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
<br/>

------------


## m.xit(description, func, args = invalid)
Creates a skipped unit test case.  It will never execute.

### Parameters 
**description** `string` \
A string describing the test case executed by `func`.
------------
**func** `object` \
The function to execute as part of this test case.
------------
**args** `dynamic` _optional_ \
Optional parameter that will be passed in to `func` as an argument.
------------

### Usage 
```brightscript
m.xit("a omitted test case", sub()
    m.fail() ' this test will never be executed, so it doesn't matter if it's explicitly failed
end sub)
```
<br/>

------------


## m.it_each(arrayOfArgs, descriptionGenerator, func)
Creates parameterized test cases with a generated description. For each argument in `arrayOfArgs`, an `m.it` block will be created, and the argument is passed in to `func`. 

### Parameters 
**arrayOfArgs** `array` \
The array of args that will be passed in `func`.
------------
**descriptionGenerator** `function` \
A function to generate a description string for each parameterized test.
------------
**func** `function` _optional_ \
The function to execute as part of this test case.
------------

### Usage 
```
m.it_each([
    [1, 1],
    [2, 1],
],
function (args)
    return substitute("compare {0} with {1}", args[0].tostr(), args[1].tostr())
end function,
sub(args)
    if args[0] = args[1] then m.pass() else m.fail()
end sub)
```
<br/>

------------


## m.fit_each(arrayOfArgs, descriptionGenerator, func)
Creates focused parameterized test cases with a generated description. For each argument in `arrayOfArgs`, an `m.fit` block will be created, and the argument is passed in to `func`. 

### Parameters 
**arrayOfArgs** `array` \
The array of args that will be passed in `func`.
------------
**descriptionGenerator** `function` \
A function to generate a description string for each parameterized test.
------------
**func** `function` _optional_ \
The function to execute as part of this test case.
------------

### Usage 
```
m.fit_each([
    [1, 1],
    [2, 1],
],
function (args)
    return substitute("focused test, compare {0} with {1}", args[0].tostr(), args[1].tostr())
end function,
sub(args)
    if args[0] = args[1] then m.pass() else m.fail()
end sub)
```
<br/>

------------


## m.xit_each(arrayOfArgs, descriptionGenerator, func)
Creates skipped parameterized test cases with a generated description. For each argument in `arrayOfArgs`, an `m.xit` block will be created, and the argument is passed in to `func`. 

### Parameters 
**arrayOfArgs** `array` \
The array of args that will be passed in `func`.
------------
**descriptionGenerator** `function` \
A function to generate a description string for each parameterized test.
------------
**func** `function` _optional_ \
The function to execute as part of this test case.
------------

### Usage 
```
m.xit_each([1, 2, 3],
function (args)
    return "omitted parameterized test case"
end function,
sub(args)
    m.fail()' this test will never be executed, so it doesn't matter if it's explicitly failed
end sub)
```
<br/>

------------


## m.log(value)
Prints a value to the console in a TAP-safe way.

### Parameters 
**value** `dynamic` \
The value to print to the console.

### Usage 
```brightscript
m.it("prints diagnostic info", sub()
    m.log(someFunctionCall())
end sub)
```
<br/>

------------


## m.addContext(context)
Allows you to add context to the `m` object, and have that context shared between **all** test cases and suites in the test file. This can be called multiple times.

### Parameters 
**context** `roAssociativeArray` \
An associative array where each key-value pair will be onto the `m` object.

### Usage 
```brightscript
m.addContext({
    aField: "value 1"
})

m.describe("a test suite with context", sub()
    m.addContext({
        aFn: function()
            return "value 2"
        end function
    })

    m.it("a test case", sub()
        m.assert.equal("value 1", m.aField, "Get context field")
        m.assert.equal("value 2", m.aFn(), "Use context function")
    end sub)
end sub)
```
<br/>

------------
