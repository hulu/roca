# Testing functions

# Functions in the `source/` directory tree

To make testing functions easier, any function that appears in the `source/` directory is put into the global scope. This means that you can directly call these functions from your test case. For example:

Source file: `<project root>/source/utilities/myUtil.brs`
```brightscript
function myUtil()
    return "awesome!"
end function
```

Test file:
```brightscript
m.describe("myUtil.brs", sub()
    m.it("returns something awesome", sub()
        ' We can directly call myUtil, because it's in scope
        output = myUtil()
        m.assert.equal(output, "awesome!", "output failed to match")
    end sub)
end sub)
```

# Functions in the `components/` directory tree

Component scope is a bit more complicated, so we don't put files in the `components/` directory tree into the global scope. Because of this, any `.brs` files that are in `components/` will need to be tested by pulling the file in using a `<script>` tag in a component.

There are a couple ways to accomplish this:

## Use a source component

The best way to test `.brs` files in the `components/` tree is to write component-level tests for whichever component(s) consume the `.brs` file in your application. This is good practice because your tests will align more closely to how the code is being used in your actual application.

For example, if we have this file: `<project root>/components/foo-workflow/foo.brs`
```brightscript
function foo()
    m.top.sideEffectField = "foo"
    return m.top.sideEffectField
end function
```

We can test the `foo` function based on how a component (which we'll call `FooComponent`) uses it:

### As a callback

If `FooComponent` uses the `foo` function as a callback:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<component name="FooComponent">
    <script type="text/brightscript" uri="pkg:/components/foo-workflow/foo.brs" />
    <interface>
        <!-- Field with a callback we want to test -->
        <field id="myField" type="string" onChange="foo" />

        <!-- Field with a callback we want to test -->
        <field id="sideEffectField" type="string">
    </interface>
</component>
```

Then we can test it by modifying `myField` in our test case:
```brightscript
m.it("calls foo when myField is modified", sub()
    ' create a spy
    spy = _brs_.mockFunction("foo")

    ' create the object
    component = createObject("RoSGNode", "FooComponent")

    ' modify the field to trigger the callback
    component.myField = "something new"

    ' assert that it was called
    m.assert.equal(spy.calls.count(), 1, "expected foo to be called once")

    ' assert on the side effect
    m.assert.equal(component.sideEffectField, "foo", "expected sideEffectField value to be 'foo'")
end sub)
```

### As a public function in the interface

If `FooComponent` puts `foo` as a function in the interface:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<component name="FooComponent">
    <script type="text/brightscript" uri="pkg:/components/foo-workflow/foo.brs" />
    <interface>
        <function name="foo" />
    </interface>
</component>
```

Then we can test it using `callFunc`:
```brightscript
m.it("calls foo", sub()
    ' create a spy
    spy = _brs_.mockFunction("foo")

    ' create the object
    component = createObject("RoSGNode", "FooComponent")

    ' call foo
    component.callFunc("foo")

    ' assert that it was called
    m.assert.equal(spy.calls.count(), 1, "expected foo to be called once")

    ' assert on the side effect
    m.assert.equal(component.sideEffectField, "foo", "expected sideEffectField value to be 'foo'")
end sub)
```

### As a private function

If `foo` isn't defined as a callback or function in the component's `<interface>`, then `foo` is effectively a private function. In this case, you should consider the code paths that trigger `foo`, and the best way for your tests to exercise those code paths.

If there is no straightforward way to trigger `foo` from a source component, then you can test it by creating a [test component](#use-a-test-component).

## Use a test component

The easiest way to test private functions (functions that are not exposed in the `<interface>` of a component) is by creating a "test component", or a component that only exists for unit tests. **Note: make sure that you are not bundling these as part of your application!**

For example, if we have this file: `<project root>/components/foo-workflow/foo.brs`
```brightscript
function foo()
    m.top.sideEffectField = "foo"
    return m.top.sideEffectField
end function
```

Then we can test it by creating a test component and exposing `foo` on the interface: `<project root>/tests/components/foo-workflow/Test_foo.brs`
```xml
<?xml version="1.0" encoding="UTF-8"?>
<component name="Test_foo">
    <script type="text/brightscript" uri="pkg:/components/foo-workflow/foo.brs" />
    <interface>
        <function name="foo" />
    </interface>
</component>
```

And in our test case, we can now create a `Test_foo` object and use `callFunc`:
```brightscript
m.it("calls foo", sub()
    ' create a spy
    spy = _brs_.mockFunction("foo")

    ' create the object
    component = createObject("RoSGNode", "FooComponent")

    ' call foo
    component.callFunc("foo")

    ' assert that it was called
    m.assert.equal(spy.calls.count(), 1, "expected foo to be called once")

    ' assert on the side effect
    m.assert.equal(component.sideEffectField, "foo", "expected sideEffectField value to be 'foo'")
end sub)
```

### Reusing source component scope

The above strategy works for most use cases. Sometimes, however, your `.brs` file relies on other `.brs` files, and it makes more sense to extend a source component. For example, consider this source component:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<component name="FooComponent">
    <script type="text/brightscript" uri="pkg:/components/foo-workflow/foo.brs" />
    <script type="text/brightscript" uri="pkg:/components/foo-workflow/bar.brs" />
    <script type="text/brightscript" uri="pkg:/components/other-workflow/baz.brs" />
</component>
```

If `foo.brs` relies on `bar.brs` and `baz.brs`, it can get tedious to copy all the dependencies from `FooComponent` and put them into a test component, `Test_foo`. In this case, we can simply extend `FooComponent` and expose the necessary functions:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<component name="Test_foo" extends="FooComponent">
    <interface>
        <function name="foo">
    </interface>
</component>
```

Now, we have the exact same scope as `FooComponent` in `Test_foo`, but we also have the benefit of the `foo` function being exposed in the public interface! :tada:
