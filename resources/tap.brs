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
        formatTitle: __tap_formatTitle,
        printExtras: __tap_printExtras
        enterSubTest: __tap_enterSubTest,
        exitSubTest: __tap_exitSubTest,
        indent: __tap_indent,
        deindent: __tap_deindent,
        getIndent: __tap_getIndent,
        __state: {
            depth: 0
        }
    }
end function

' Prints a spec-appropriate TAP version string
sub __tap_version()
    print "TAP version 13"
end sub

' Prints a TAP testing plan in the form of "1..${numberOfTests}"
' @param {integer} numberOfTests - the number of test cases being run
sub __tap_plan(numberOfTests as integer)
    print m.getIndent() "1.." numberOfTests
end sub

' Prints a "test case passed" message to the TAP stream
' @param {integer} index - the zero-based index of the test that passed
' @param {string} rawTitle - the unsanitized title of the test that passed
sub __tap_pass(index as integer, rawTitle as string)
    print m.getIndent() "ok " index + 1 " - " m.formatTitle(rawTitle)
end sub

' Prints a "test case skipped" message to the TAP stream
' @param {integer} index - the zero-based index of the test that was skipped
' @param {string} rawTitle - the unsanitized title of the test that was skipped
sub __tap_skip(index as integer, rawTitle as string)
    print m.getIndent() "ok " index + 1 " - " m.formatTitle(rawTitle) " # skip"
end sub

' Prints a "test case failed" message to the TAP stream
' @param {integer} index - the zero-based index of the test that failed
' @param {string} rawTitle - the unsanitized title of the test that failed
' @param {assocarray} [metadata] - blob of data to be printed in an indented YAML block
sub __tap_fail(index as integer, rawTitle as string, metadata = invalid as object)
    print m.getIndent() "not ok " index + 1 " - " m.formatTitle(rawTitle)
    if metadata <> invalid then
        m.printExtras(metadata)
    end if
end sub

' Prints the provided data as a TAP-compliant diagnostic (i.e. prefixed with `# `)
' @param {dynamic} arg - the value to print
sub __tap_diagnostic(arg as dynamic)
    print m.getIndent() "# " arg
end sub

' Sanitizes a test case's title for inclusion in a TAP stream.
' Necessary only because `#` is reserved for comments in TAP streams
'
' @param {string} title - the title of the test to format for TAP-safety
' @returns {string} a sanitized version of `title`
function __tap_formatTitle(title as string) as string
    return title.replace("#", "")
end function

' Given a metadata object, it recursively prints all
' items inside a YAML block with its respective indentation
' @param {object} extra - the metadata object
' @param {number} level - indentation level
sub __tap_printExtras(extra = {}, level = 0)
    if level = 0 then
        m.indent()
        print m.getIndent() "---"
    end if

    m.indent()
    for each item in extra
        if type(extra[item]) = "roAssociativeArray" then
            print m.getIndent() item ":"
            level = level + 1
            m.printExtras(extra[item], level)
            level = level - 1
        else if extra[item] <> invalid
            print m.getIndent() item ": " extra[item]
        end if
    end for
    m.deindent()

    if level = 0 then
        print m.getIndent() "..."
        m.deindent()
    end if
end sub

sub __tap_enterSubTest(name as string)
    print m.getIndent() "# Subtest: " name
    m.indent()
end sub

sub __tap_exitSubTest()
    m.deindent()
end sub

sub __tap_indent()
    m.__state.depth++
end sub

sub __tap_deindent()
    if m.__state.depth > 0 then m.__state.depth--
end sub

function __tap_getIndent()
    indent = ""
    for i = 0 to m.__state.depth - 1
        indent += "    "
    end for
    return indent
end function
