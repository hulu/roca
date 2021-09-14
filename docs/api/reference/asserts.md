# Asserts

You can directly call `m.pass()` or `m.fail()` within a test case to mark it as passed or failed. Alternatively, `roca` offers an `assert` library (similar to [Chai](https://www.chaijs.com/api/reference/assert/)), available via `m.assert`. These methods will call `m.pass()` or `m.fail()` for you.

<br/>

------------


## m.pass()
Marks a unit test as passing. If the test case has previously been marked as failed, then this results in a no-op.

### Parameters
None.

### Return value 
None.

### Usage 
```brightscript
m.it("passes", sub()
    m.pass()
end sub)
```
<br/>

------------


## m.fail()
Marks a unit test as failing. Only the first failure encountered in a test case will be reported, and it will override any prior calls to `m.pass`.

### Parameters 
None.

### Return value 
None.

### Usage 
```brightscript
m.it("fails", sub()
    m.fail()
end sub)
```
<br/>

------------


## m.assert.equal(actual, expected, errorMessage)
Compares two **primitive** values for equality.

### Parameters 
**actual** `dynamic` _(primitive)_ \
The value that was calculated in your test case.
------------
**expected** `dynamic` _(primitive)_ \
The expected value to compare against.
------------
**errorMessage** `string` \
The error message to display if the values are not equal.
------------

### Return value 
None.

### Usage 
```brightscript
m.it("test case", sub()
    m.assert.equal("foo", "foo", "whoops, these should be equal")
end sub)
```
<br/>

------------

## m.assert.deepEquals(actual, expected, errorMessage)
Compares two values of **any type** for equality. It will recursively compare objects and arrays.

### Parameters 
**actual** `dynamic` \
The value that was calculated in your test case.
------------
**expected** `dynamic` \
The expected value to compare against.
------------
**errorMessage** `string` \
The error message to display if the values are not equal.
------------

### Return value 
None.

### Usage 
```brightscript
m.it("test case", sub()
    foo = { a: { b: ["c", "d"] }}
    bar = { a: { b: ["c", "e"] }}
    m.assert.deepEquals(foo, bar, "whoops, these should be equal")
end sub)
```
<br/>

------------

## m.assert.hasBeenCalled(mock, errorMessage = invalid)

Verifies that a [mock function](api/reference/mocks?id=mock-function-api) has been called at least one time.

### Parameters 
**mock** `object` \
The mock function that was returned from [`_brs_.mockFunction`](api/reference/mocks?id=_brs_mockfunctionfuncname-impl).
------------
**errorMessage** `string` _optional_ \
The error message to display if the mock was not called. If you don't pass an error message, one will automatically be created for you.
------------

### Return value 
None.

### Usage 
```brightscript
m.it("test case", sub()
    mock = _brs_.mockFunction("foo")
    foo()
    m.assert.hasBeenCalled(mock)
end sub)
```
<br/>

------------

## m.assert.hasBeenCalledTimes(mock, callCount, errorMessage = invalid)

Verifies that a [mock function](api/reference/mocks?id=mock-function-api) has been called a certain number of times.

### Parameters 
**mock** `object` \
The mock function that was returned from [`_brs_.mockFunction`](api/reference/mocks?id=_brs_mockfunctionfuncname-impl).
------------
**callCount** `integer` \
The number of times this mock should have been called.
------------
**errorMessage** `string` _optional_ \
The error message to display if the mock was not called. If you don't pass an error message, one will automatically be created for you.
------------

### Return value 
None.

### Usage 
```brightscript
m.it("test case", sub()
    mock = _brs_.mockFunction("foo")
    foo()
    foo()
    m.assert.hasBeenCalledTimes(mock, 2)
end sub)
```
<br/>

------------

## m.assert.hasBeenCalledWith(mock, argsArray, errorMessage = invalid)

Verifies that a [mock function](api/reference/mocks.md?id=mock-function-api) has been called with certain arguments. Note that this will check against every call to the mock function.

### Parameters 
**mock** `object` \
The mock function that was returned from [`_brs_.mockFunction`](api/reference/mocks?id=_brs_mockfunctionfuncname-impl).
------------
**argsArray** `array` \
An array of arguments to check against.
------------
**errorMessage** `string` _optional_ \
The error message to display if the mock was not called. If you don't pass an error message, one will automatically be created for you.
------------

### Return value 
None.

### Usage 
```brightscript
m.it("test case", sub()
    mock = _brs_.mockFunction("foo")
    foo("bar", 123, { baz: 456 })
    m.assert.hasBeenCalledWith(mock, ["bar", 123, { baz: 456 }])
end sub)
```
<br/>


------------

## m.assert.notEqual(actual, expected, errorMessage)
Opposite of [`m.assert.equal`](#massertequalactual-expected-errormessage). Compares two **primitive** values.

### Parameters 
**actual** `dynamic` _(primitive)_ \
The value that was calculated in your test case.
------------
**expected** `dynamic` _(primitive)_ \
The expected value to compare against.
------------
**errorMessage** `string` \
The error message to display if the values are equal.
------------

### Return value 
None.

### Usage 
```brightscript
m.it("test case", sub()
    m.assert.notEqual("foo", "not foo", "whoops, these should _not_ be equal")
end sub)
```
<br/>

------------


## m.assert.isTrue(value, errorMessage)
Checks to see if a **boolean** value is `true`.

### Parameters 
**value** `boolean` \
The value that was calculated in your test case.
------------
**errorMessage** `string` \
The error message to display if the value is not true.
------------

### Return value 
None.

### Usage 
```brightscript
m.it("test case", sub()
    foo = true
    m.assert.isTrue(foo, "whoops, foo should be true")
end sub)
```
<br/>

------------


## m.assert.isFalse(value, errorMessage)
Checks to see if a **boolean** value is `false`.

### Parameters 
**value** `boolean` \
The value that was calculated in your test case.
------------
**errorMessage** `string` \
The error message to display if the value is not false.
------------

### Return value 
None.

Usage:
```brightscript
m.it("test case", sub()
    foo = false
    m.assert.isFalse(foo, "whoops, foo should be false")
end sub)
```
<br/>

------------


## m.assert.isValid(value, errorMessage)
Checks to see if a value is not `invalid`.

### Parameters 
**value** `dynamic` \
The value that was calculated in your test case.
------------
**errorMessage** `string` \
The error message to display if the value is invalid.
------------

### Return value 
None.

Usage:
```brightscript
m.it("test case", sub()
    foo = {}
    m.assert.isValid(foo, "whoops, foo should not be invalid")
end sub)
```
<br/>

------------


## m.assert.isInvalid(value, errorMessage)
Checks to see if a value is `invalid`.

### Parameters 
**value** `dynamic` \
The value that was calculated in your test case.
------------
**errorMessage** `string` \
The error message to display if the value is not invalid.
------------

### Return value 
None.

### Usage 
```brightscript
m.it("test case", sub()
    foo = invalid
    m.assert.isInvalid(foo, "whoops, foo should be invalid")
end sub)
```
