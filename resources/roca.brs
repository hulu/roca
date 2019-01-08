' Creates a suite of test cases with a given description.
' @param description a string describing the suite of tests contained within.
' @param context the context from the parent `describe`, used to create sub-suites.  Use `invalid` for the top-level suite.
' @param func the function to execute as part of this suite.
sub describe(description as string, context as object, func as object)
    if context = invalid then
        context = createContext()
    end if

    context.__registerSuite(description, context, func)

    func(context)

    if context.__state.parentCtx = invalid then
        ' calls func, checks the result, and prints "ok" or "not ok" followed by the description variable
        for each case in context.__state.cases
            ' TODO: recursively execute tests
            case.func(case.ctx)

            if case.ctx.__state.success then
                print "ok - " case.description
            else
                print "not ok - " case.description
            end if
        end for
    end if
end sub

' Creates a test case with a given description.
' @param description a string describing this test case
' @param context the context from the parent 'describe', used to track test pass and fail states
' @param func the function to execute as part of this test case
sub it(description as string, context as object, func as object)
    context.__registerCase(description, context, func)
end sub

' Creates a new test or suite context, which encapsulates the test or suite's internal state and provides the test API
' to consumers.
' @returns a new test case or suite context
sub createContext()
    return {
        __state: {
            parentCtx: invalid,
            success: true,
            cases: [],
            suites: []
        },
        __registerSuite: __context_registerSuite,
        __registerCase: __context_registerCase
        pass: __context_pass,
        fail: __context_fail
    }
end sub

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
sub __context_registerSuite(description as string, context as object, func as object)
    m.__state.suites.push({
        description: description,
        func: func,
        ctx: context
    })
end sub

' Forces a test case into a "success" state.
sub __context_pass()
    m.__state.success = true
end sub

' Forces a test case into a "failure" state.
sub __context_fail()
    m.__state.success = false
end sub
