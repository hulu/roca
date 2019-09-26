' A producer of [Test Anything Protocol (TAP)](http://testanything.org/) streams,
' intended to be consumed by any known TAP stream consumer for further prettification.
'
' Adapted in part from https://github.com/mochajs/mocha/blob/5f8df0848aa52bb0f7a0844bcd3715012a6ecfd6/lib/reporters/tap.js
function Tap() as object
    return {
        version: __tap_version,
        plan: __tap_plan,
        pass: __tap_pass,
        skip: __tap_skip,
        fail: __tap_fail,
        diagnostic: __tap_diagnostic,
        formatTitle: __tap_formatTitle
    }
end function

' Prints a spec-appropriate TAP version string
sub __tap_version()
    print "TAP version 13"
end sub

' Prints a TAP testing plan in the form of "1..${numberOfTests}"
' @param {integer} numberOfTests - the number of test cases being run
sub __tap_plan(numberOfTests as integer)
    print "1.." numberOfTests
end sub

' Prints a "test case passed" message to the TAP stream
' @param {integer} index - the zero-based index of the test that passed
' @param {string} rawTitle - the unsanitized title of the test that passed
sub __tap_pass(index as integer, rawTitle as string)
    print "ok"; index + 1; "-"; m.formatTitle(rawTitle)
end sub

' Prints a "test case skipped" message to the TAP stream
' @param {integer} index - the zero-based index of the test that was skipped
' @param {string} rawTitle - the unsanitized title of the test that was skipped
sub __tap_skip(index as integer, rawTitle as string)
    print "ok"; index + 1; "-"; m.formatTitle(rawTitle); "# skip"
end sub

' Prints a "test case failed" message to the TAP stream
' @param {integer} index - the zero-based index of the test that failed
' @param {string} rawTitle - the unsanitized title of the test that failed
' @param {assocarray} [metadata] - blob of data to be printed in an indented YAML block
sub __tap_fail(index as integer, rawTitle as string, metadata = invalid as object)
    print "not ok"; index + 1; "-"; m.formatTitle(rawTitle)
    if metadata <> invalid then
        ' TODO print a YAML (but probably JSON) document of that data
    end if
end sub

' Prints the provided data as a TAP-compliant diagnostic (i.e. prefixed with `# `)
' @param {dynamic} arg - the value to print
sub __tap_diagnostic(arg as dynamic)
    print "#"; arg
end sub

' Sanitizes a test case's title for inclusion in a TAP stream.
' Necessary only because `#` is reserved for comments in TAP streams
'
' @param {string} title - the title of the test to format for TAP-safety
' @returns {string} a sanitized version of `title`
function __tap_formatTitle(title as string) as string
    return title.replace("#", "")
end function
