# Mocks

## \_brs_.mockComponent(componentName, impl)
Dynamically overwrite a component's implementation. Works with both custom components and built-in components.

### Parameters 
**componentName** `string` \
The name of the component to overwrite. 
------------
**impl** `associative array` \
Fields and functions that will be available as properties on any future component instances.
------------

### Return value 
None.

### Usage 
```brightscript
' Mock a custom component
_brs_.mockComponent("ComponentName", {
    someField: "foobar",
    someFunc: function()
      return 123
    end function
})

' Mock a built-in component
_brs_.mockComponent("roDateTime", {
    asDateString: function(foo)
        return "FEB"
    end function
})
```
<br/>

------------

## \_brs_.mockComponentPartial(componentName, impl)
Dynamically overwrite specific functions and fields that exist in a component's scope. Any functions/fields that are _not_ specified in the mock will use the original implementation.

### Parameters 
**componentName** `string` \
The name of the component to partially mock. 
------------
**impl** `associative array` \
Fields and functions that will be available as properties on any future component instances. If the function/field exists on the source component already, the mocked version will overwrite the source.
------------

### Return value 
None.

### Usage 
Source component XML:
```xml
<component name="FooComponent">
    <interface>
        <field id="foo" type="string" value="source!" />
        <function name="triggerInScope"/>
    </interface>
    <script type="text/brightscript" uri="./FooComponent.brs" />
</component>
```

`FooComponent.brs`:
```brightscript
sub triggerInScope()
    inScopeFunc()
end sub

sub inScopeFunc()
    print "inScopeFunc - source!"
end sub
```

Test code:
```brightscript
' Mock a custom component
_brs_.mockComponentPartial("FooComponent", {
    foo: "mocked!",
    inScopeFunc: sub()
      print "inScopeFunc - mocked!"
    end sub
})

node = createObject("RoSGNode", "FooComponent")
print node.foo ' => "mocked!"

' This will call the _real_ implementation of `triggerInScope`,
' which calls `inScopeFunc`, which has been mocked.
node.callFunc("triggerInScope") ' => "inScopeFunc - mocked!"
```
<br/>

------------

## \_brs_.mockFunction(funcName, impl)
Dynamically overwrite a function's implementation, and spy on the mocked implementation.

### Parameters 
**funcName** `string` \
The name of the function to overwrite. 
------------
**impl** `function` _optional_ \
The function implementation. If omitted, a default implementation will be created that accepts any number of arguments (up to 10) and returns `invalid`.
------------

### Return value 
[Mock function](#mock-function-api)

### Usage 
Original function definition:
```brightscript
function myFunc(requiredArg as string)
    return "myFunc: " + requiredArg
end function
```

Test case:
```brightscript
' original implementation
print myFunc("foo") ' => "myFunc: foo"

' mocked with a custom implementation
mock = _brs_.mockFunction("myFunc", function()
    return "foobar"
end function)
print myFunc() ' => "foobar"
print myFunc("foo") ' => runtime error because the signatures don't match

' implicitly mocked -- can be called with or without args
mock = _brs_.mockFunction("myFunc")
print myFunc() ' => invalid
print myFunc(123, {}, "foo") ' => invalid
```
<br/>

------------

## \_brs_.resetMockComponent(componentName)
Resets a specific component mock. Works on both partially mocked and fully mocked components.

### Parameters 
**componentName** `string` \
The name of the mocked component to reset.
------------

### Return value 
None.

### Usage 
```brightscript
_brs_.resetMockComponent("MyComponent")
```
<br/>

------------

## \_brs_.resetMockComponents()
Resets all existing component mocks.

### Parameters 
None.

### Return value 
None.

### Usage 
```brightscript
_brs_.resetMockComponents()
```
<br/>

------------

### \_brs_.resetMockFunction(funcName)
Resets a specific function mock.

### Parameters 
**funcName** `string` \
The name of the mocked function to reset.
------------

### Return value 
None.

### Usage 
```brightscript
_brs_.resetMockFunction("MyFunction")
```

**Note:** If you have a mocked component that has a function with the same name, this _will not_ reset that component member function. For example:

```brightscript
_brs_.mockComponent("Component", {
    foo: sub()
        print "mock component foo"
    end sub
})
_brs_.mockFunction("foo", sub()
    print "mock global foo"
end sub)

node = createObject("roSGNode", "Component")
foo() ' => "mock global foo"
node.foo() ' => "mock component foo"

_brs_.resetMockFunction("foo")
foo() ' => "original implementation"
node.foo() ' => "mock component foo"
```
<br/>

------------

### \_brs_.resetMockFunctions()
Resets all function mocks. Usage:

### Parameters 
None.

### Return value 
None.

### Usage 
```brightscript
_brs_.resetMockFunctions()
```
<br/>

------------

### \_brs_.resetMocks()
Resets all component and function mocks.

### Parameters 
None.

### Return value 
None.

### Usage 
```brightscript
_brs_.resetMocks()
```
<br/>

------------

## \_brs_.runInScope(filePath, mainArgs)
Runs a file (or set of files) **in the current global + module scope** with the provided arguments, 

### Parameters 
**filePath** `string | array<string>` \
The file(s) to run.
------------
**mainArgs** `dynamic` \
The arguments to pass to the `main` function. Note that there should only be one `main` function in the given set of files.
------------

### Return value 
Either the value returned by the `main` function in the file(s) or `invalid` if an error occurs.

### Usage 
```brightscript
_brs_.runInScope("/path/to/myFile.brs", { foo: "bar" })
_brs_.runInScope(["/path/to/main.brs", "/path/to/helper.brs"], { foo: "bar" })
```
<br/>

------------

## \_brs_.triggerKeyEvent(key, press)
This will call [`onKeyEvent` handlers](https://developer.roku.com/docs/references/scenegraph/component-functions/onkeyevent.md) up the focus chain until the event is handled. If there is no focused component, nothing will happen (which is how RBI behaves).

### Parameters 
**key** `string` \
The name of the key. This is passed directly to the `onKeyEvent` handlers.
------------
**press** `boolean` \
Whether the button was pressed or not. This is passed directly to the `onKeyEvent` handlers.
------------

### Return value 
None.

### Usage 
```brightscript
_brs_.triggerKeyEvent("OK", true)
```
<br/>

------------

# Mock Function API

The Mock Function API is modeled after [Jest's `mockFn` API](https://jestjs.io/docs/en/mock-function-api). Methods:

## mock.calls
An array containing the arguments of each call to this function. Each item in the array is an array of the arguments for that call.

### Type
`array<dynamic>`

### Usage
```brightscript
mock = _brs_.mockFunction("fooBar", function(arg1 as string, arg2 as integer)
    print "fooBar"
end function)

fooBar("baz", 123)
print mock.calls
' [
'     ["baz", 123]
' ]

fooBar("lorem", 456)
print mock.calls
' [
'     ["baz", 123]
'     ["lorem", 456]
' ]
```
<br/>

------------

## mock.clearMock()
Clears the `calls` and `results` arrays. Does not affect the mock implementation.

### Parameters
None.

### Return value
None.

### Usage
```brightscript
mock = _brs_.mockFunction("fooBar", function()
    return "hello, world"
end function)

fooBar()
print mock.calls.count()   ' => 1
print mock.results.count() ' => 1

mock.clearMock()
print mock.calls.count()   ' => 0
print mock.results.count() ' => 0
```
<br/>

------------

## mock.getMockName()
Returns the name of the mocked function.

### Parameters
None.

### Return value
`string` The name of the mocked function.

### Usage
```brightscript
mock = _brs_.mockFunction("fooBar", function()
    return "hello, world"
end function)

print mock.getMockName() ' => "fooBar"
```
<br/>

------------

## mock.mockReturnValue(value)
Sets a new return value for a mocked function. This overwrites any existing mock implementation.

### Parameters
**value** `dynamic` \
The value that this mocked function should return.
------------

### Return value
None.

### Usage
```brightscript
mock = _brs_.mockFunction("fooBar", function()
    return "hello, world"
end function)
print fooBar() ' => "hello, world"

mock.mockReturnValue(123)
print fooBar() ' => 123
```
<br/>

------------

## mock.results
An array containing the return value for each call to this function.

### Type
`array<dynamic>`

### Usage
```brightscript
mock = _brs_.mockFunction("fooBar", function(arg as boolean)
    if arg then
        return "foo"
    else
        return "bar"
    end if
end function)

fooBar(true)
print mock.results ' => [ "foo" ]

fooBar(false)
print mock.results ' => [ "foo", "bar" ]
```
