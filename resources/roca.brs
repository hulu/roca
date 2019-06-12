' Creates a suite of test cases with a given description.
' @param description a string describing the suite of tests contained within.
' @param func the function to execute as part of this suite.
sub describe(description as string, func as object)
    context = createContext()
    context.__state.description = description

    if m.__ctx <> invalid then
        context.__state.parentCtx = m.__ctx
        m.__ctx.__registerSuite(context, func)
    end if

    ' package the suite up with its context accessible via `m.`
    withM = {
        __ctx: context
        __func: func
        __log: __util_log
    }
    withM.__func()

    ' start to execute tests only from the top-level describe
    if context.__state.parentCtx = invalid then
        ' first gather them all up so we can get an accurate count for our TAP output
        allTests = gatherTests(context)

        if allTests.count() = 0 then
            print "No tests detected!"
            return
        end if

        ' add the TAP version header and test count
        print "TAP version 13"
        print "1.." allTests.count()

        ' then execute each test and report its results
        index = 1
        for each case in allTests
            ' package the test case up with some test utilities accessible via `m.`
            withM = {
                pass: __util_pass,
                fail: __util_fail,
                log: __util_log,
                __ctx: case.ctx,
                __func: case.func
            }
            ' then call it
            withM.__func()

            ' and report the results
            description = buildDescription(case)
            if case.ctx.__state.success then
                print "ok " index " - " description
            else
                print "not ok " index " - " description
            end if

            index = index + 1
        end for
    end if
end sub

' Performs a depth-first search of test suites, starting at `root`, to find all test cases.
' @param root the context representing the top-level test suite
' @param startAt the current suite to search within
function gatherTests(root as object, startAt = root as object)
    casesInSuite = []
    for each suiteModel in startAt.__state.suites
        casesInSuite.append(gatherTests(root, suiteModel.ctx))
    end for

    casesInSuite.append(startAt.__state.cases)

    return casesInSuite
end function

' Builds a description string for the provided test case that includes all parent suite descriptions.
' This mimicks the behavior of `mocha` with the `--reporter tap` option.
function buildDescription(case as object)
    if case.ctx = invalid then return invalid

    descriptions = [ case.description ]

    ctx = case.ctx
    while ctx <> invalid
        if ctx.__state.description <> "" then
            descriptions.unshift(ctx.__state.description)
        end if
        
        ctx = ctx.__state.parentCtx
    end while

    description = ""
    descriptionPart = descriptions.shift()

    ' TODO: Replace with ifArrayJoin#join() when that's implemented in brs
    while descriptionPart <> invalid and descriptionPart <> ""
        if description <> "" then
            description = description + " "
        end if

        description = description + descriptionPart
        descriptionPart = descriptions.shift()
    end while

    return description
end function

' Creates a test case with a given description.
' @param description a string describing this test case
' @param func the function to execute as part of this test case
sub it(description as string, func as object)
    m.__ctx.__registerCase(description, m.__ctx, func)
end sub

' Creates a new test or suite context, which encapsulates the test or suite's internal state and provides the test API
' to consumers.
' @returns a new test case or suite context
function createContext()
    return {
        __state: {
            parentCtx: invalid,
            success: true,
            description: "",
            cases: [],
            suites: []
        },
        __registerSuite: __context_registerSuite,
        __registerCase: __context_registerCase
    }
end function

' Registers a test case with the provided description and function in the given context.
' @param description a string describing the test case
' @param context the context from the parent 'describe', used to track test pass and fail states
' @param func the function to execute as part of the test case
sub __context_registerCase(description as string, context as object, func as object)
    m.__state.cases.push({
        description: description,
        func: func,
        ctx: context
    })
end sub

' Registers a test case with the provided description and function in the given context.
' @param description a string describing the suite of tests contained within.
' @param context the context from the parent `describe`, used to create sub-suites.  Use `invalid` for the top-level suite.
' @param func the function to execute as part of this suite.
sub __context_registerSuite(context as object, func as object)
    m.__state.suites.push({
        func: func,
        ctx: context
    })
end sub

' Forces a test case into a "success" state.
sub __util_pass()
    m.__ctx.__state.success = true
end sub

' Forces a test case into a "failure" state.
sub __util_fail()
    m.__ctx.__state.success = false
end sub

' Prints messages to stdout in a TAP-compliant format
' @param msg the message to print as a TAP diagnostic
sub __util_log(msg as string)
    print "# " msg
end sub
