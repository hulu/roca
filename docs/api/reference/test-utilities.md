# Extensions

In addition to [mocking capabilities](api/reference/mocks.md), there are a few other helpful extensions available on the global `_brs_` object.

## \_brs_.getStackTrace(numFrames = 10, excludePatterns = [])

Prints out a given number of stack trace frames, where each frame is a string in the format `<file>:<line number>:<column number>`. This can be helpful for debugging. Note that because `_brs_` is globally accessible, you can add this in your source code as well as test code -- if you do, just make sure to remove it before committing your code!

### Parameters
**numFrames** `number` _optional_ \
The number of stack trace entries to print. Defaults to 10.
-------------
**excludePatterns** `array<string>` _optional_ \
An array of strings used to exclude stack frames from the trace. Defaults to an empty array. This is helpful if you want to filter certain files or folders from the trace. \
*Note: this function internally uses the [Javascript regex engine](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) to match the strings, not [Brightscript PCRE](https://developer.roku.com/en-ca/docs/references/brightscript/components/roregex.md).*
-------------

### Returns
An array of strings.

### Usage
```brightscript
print _brs_.getStackTrace()
' [
'     "test/baz.test.brs:1:10",
'     "lib/utils.brs:25:4",
'     "foo/baz.brs:50:29"
' ]

print _brs_.getStackTrace(1)
' [
'     "test/baz.test.brs:1:10",
' ]

print _brs_.getStackTrace(10, ["lib"])
' [
'     "test/baz.test.brs:1:10",
'     "foo/baz.brs:50:29"
' ]
```
<br/>

------------

## \_brs_.global

A reference to the `m.global` associative array, so that you can access it from inside your unit tests.

### Usage
```brightscript
print _brs_.global
' {
'   someGlobalField: "someGlobalValue"
' }
```
<br/>

------------

# \_brs_.process

Allows you to access the command line arguments and locale.

```brightscript
print _brs_.process
' {
'   argv: [ "some", "arg" ],
'   getLocale: [Function getLocale]
'   setLocale: [Function setLocale]
' }
```
<br/>

------------

## process.setLocale(newLocale)
Set a new locale for the application. Locale changes will be reflected in related `RoDeviceInfo` functions and the standard library `Tr` function. \
_Note: there is no verification done to ensure that the locale is a value that BrightScript accepts. See [the BrightScript `GetCurrentLocale()` docs](https://developer.roku.com/docs/references/brightscript/interfaces/ifdeviceinfo.md#getcurrentlocale-as-string) for info on the values BrightScript accepts._ 

### Parameters
**newLocale** `string` \
The new locale string.
-------------

### Return value
None.

### Usage:
```brightscript
_brs_.process.setLocale("fr_CA")
print _brs_.process.getLocale() ' => "fr_CA"
print createObject("roDeviceInfo").getCurrentLocale() ' => "fr_CA"
```
<br/>

------------

## process.getLocale()
Gets the current locale. Note that this is the same as `RoDeviceInfo#GetCurrentLocale`.

### Parameters
None.

### Return value
None.

### Usage:
```brightscript
_brs_.process.setLocale("fr_CA")
print _brs_.process.getLocale() ' => "fr_CA"
print createObject("roDeviceInfo").getCurrentLocale() ' => "fr_CA"
```
