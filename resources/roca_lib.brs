' Creates a suite of test cases with a given description.
' @param description a string describing the suite of tests contained within.
' @param func the function to execute as part of this suite.
' @param
function describe(description as string, func as object, args = invalid as object)
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
        it: __it
        fit: __fit
        xit: __xit
    }
    withM.__func()

    ' start to execute tests only from the top-level describe
    if context.__state.parentCtx = invalid then
        if args.exec = true then
            context.__state.totalCases = context.__totalCases()
            context.exec(args)
            return context
        else
            context.__state.transitivelyHasFocusedCases = context.__transitivelyHasFocusedCases()
            context.__state.totalCases = context.__totalCases()
            return context
        end if
    end if
end function

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
sub __it(description as string, func as object)
    m.__ctx.__registerCase("default", description, m.__ctx, func)
end sub

sub __fit(description as string, func as object)
    m.__ctx.__registerCase("focus", description, m.__ctx, func)
end sub

sub __xit(description as string, func as object)
    m.__ctx.__registerCase("skip", description, m.__ctx, func)
end sub

' Creates a new test or suite context, which encapsulates the test or suite's internal state and provides the test API
' to consumers.
' @returns a new test case or suite context
function createContext()
    ctx = {
        __state: {
            parentCtx: invalid,
            description: "",
            cases: [],
            hasFocusedCases: false,
            transitivelyHasFocusedCases: false,
            suites: []
        },
        __transitivelyHasFocusedCases: __context_transitivelyHasFocusedCases,
        __totalCases: __context_totalCases,
        __registerSuite: __context_registerSuite,
        __registerCase: __context_registerCase,
        exec: __context_exec,
    }
    return ctx
end function

' Registers a test case with the provided description and function in the given context.
' @param mode one of ["default", "skip", "focus"], describing how this test was declared
' @param description a string describing the test case
' @param context the context from the parent 'describe', used to track test pass and fail states
' @param func the function to execute as part of the test case
sub __context_registerCase(mode as string, description as string, context as object, func as object)
    if mode <> "default" and mode <> "skip" and mode <> "focus" then
        print "[roca.brs] Error: Received unexpected test case mode '" mode "'"
        return
    end if

    if mode = "focus" then
        m.__state.hasFocusedCases = true
    end if

    m.__state.cases.push({
        mode: mode,
        __state: {
            success: true
        },
        description: description,
        func: func,
        ctx: context,
        report: __case_report,
        exec: __case_execute
    })
end sub

function __case_execute()
    withM = {
        pass: __util_pass,
        fail: __util_fail,
        log: __util_log,
        __ctx: m.ctx,
        __func: m.func,
        __state: m.__state
    }
    withM.__func()
end function

sub __case_report(index as integer)
    description = buildDescription(m)
    if m.mode = "skip" then
        description += " # skip"
    end if
    if m.__state.success then
        print "ok " index " - " description
    else
        print "not ok " index " - " description
    end if
end sub

function __context_transitivelyHasFocusedCases() as boolean
    for each suiteWrapper in m.__state.suites
        suite = suiteWrapper.ctx
        if suite.__state.hasFocusedCases = true then
            return true
        else if suite.__transitivelyHasFocusedCases() = true then
            return true
        end if
    end for

    return m.__state.hasFocusedCases
end function


function __context_totalCases() as integer
    cases = 0
    for each suiteWrapper in m.__state.suites
        suite = suiteWrapper.ctx
        cases += suite.__totalCases()
    end for

    return cases + m.__state.cases.count()
end function

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

sub __context_exec(args as object)
    if args.exec <> true then return
    index = args.startingIndex
    for each case in m.__state.cases
        if (args.focusedCasesDetected and case.mode = "focus") or not args.focusedCasesDetected then
            if case.mode <> "skip" then
                case.exec()
            end if
        end if
        case.report(index)

        index++
    end for
end sub

' Forces a test case into a "success" state.
sub __util_pass()
    m.__state.success = true
end sub

' Forces a test case into a "failure" state.
sub __util_fail()
    m.__state.success = false
end sub

' Prints messages to stdout in a TAP-compliant format
' @param msg the message to print as a TAP diagnostic
sub __util_log(msg as string)
    print "# " msg
end sub
