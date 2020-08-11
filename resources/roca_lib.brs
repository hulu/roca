' Initializes a Roca unit test instance with the arguments provided by the Roca CLI.
' Should only be called once per test file, accepting the arguments passed into `main`.
'
' @param {assocarray} args - the set of arguments provided by the Roca test framework
'
' @returns {assocarray} - an instance of Roca
function roca(args = {} as object)
    return {
        log: __util_log,
        args: args,
        __createDescribeBlock: __roca_createDescribeBlock,
        describe: __roca_describe,
        fdescribe: __roca_fdescribe,
        xdescribe: __roca_xdescribe,
        it: __it,
        fit: __fit,
        xit: __xit,
        __ctx: {},
        addContext: __roca_addContext,
        __state: {
            beforeEachChildFn: invalid,
            afterEachChildFn: invalid
        },
        beforeEach: __roca_beforeEach,
        afterEach: __roca_afterEach
    }
end function

' @param {string} description - a string describing the suite of tests contained within.
' @param {function} func - the function to execute as part of this suite.
' @returns {assocarray} - the newly-created test suite -- state included.
function __roca_describe(description as string, func as object)
    return m.__createDescribeBlock("default", description, func)
end function

function __roca_fdescribe(description as string, func as object)
    return m.__createDescribeBlock("focus", description, func)
end function

function __roca_xdescribe(description as string, func as object)
    return m.__createDescribeBlock("skip", description, func)
end function

function __roca_createDescribeBlock(mode as string, description as string, func as object)
    if mode <> "default" and mode <> "skip" and mode <> "focus" then
        print "[roca.brs] Error: Received unexpected describe block mode'" mode "'"
        return
    end if

    suite = __roca_suite()
    suite.mode = mode
    suite.__state.description = description
    suite.__state.func = func

    ' This will be true for suites, but false for the roca object.
    if m.__suite <> invalid then
        if mode = "focus" then
            m.__suite.__state.hasFocusedSuites = true
        end if

        suite.__state.hasFocusedAncestors = m.__suite.mode = "focus" or m.__suite.__state.hasFocusedAncestors
        suite.__state.hasSkippedAncestors = m.__suite.mode = "skip" or m.__suite.__state.hasSkippedAncestors

        suite.__state.parentSuite = m.__suite

        ' cascade context
        suite.__ctx.append(m.__suite.__ctx)

        ' pass the beforeEach function to the child so that it can execute it in-scope
        suite.__state.beforeExecFn = m.__suite.__state.beforeEachChildFn

        ' pass the afterEach function to the child so that it can execute it in-scope
        suite.__state.afterExecFn = m.__suite.__state.afterEachChildFn

        m.__suite.__registerSuite(suite)
    end if

    ' cascade roca context
    if m.__ctx <> invalid then suite.__ctx.append(m.__ctx)

    ' package the suite up with its context accessible via `m.`
    withM = {
        __suite: suite
        __func: suite.__state.func
        __beforeExecFn: suite.__state.beforeExecFn
        __afterExecFn: suite.__state.afterExecFn
        log: __util_log
        it: __it
        fit: __fit
        xit: __xit
        __createDescribeBlock: __roca_createDescribeBlock,
        describe: __roca_describe,
        fdescribe: __roca_fdescribe,
        xdescribe: __roca_xdescribe,
        addContext: __roca_addContext,
        beforeEach: __roca_beforeEach,
        afterEach: __roca_afterEach
    }

    ' don't run beforeEach/afterEach if we're not executing
    if m.args.exec = true and withM.__beforeExecFn <> invalid and type(withM.__beforeExecFn) = "Function" then
        withM.__beforeExecFn()
    end if

    withM.__func()

    ' don't run beforeEach/afterEach if we're not executing
    if m.args.exec = true and withM.__afterExecFn <> invalid and type(withM.__afterExecFn) = "Function" then
        withM.__afterExecFn()
    end if

    suite.__state.hasFocusedDescendants = suite.__hasFocusedDescendants()
    suite.__state.totalCases = suite.__totalCases()

    ' start to execute tests only from the top-level describe
    if suite.__state.parentSuite = invalid and m.args.exec = true then
        suite.exec(m.args)
    end if

    return suite
end function

' Creates a test case with a given description.
' @param description a string describing this test case
' @param func the function to execute as part of this test case
sub __it(description as string, func as object)
    m.__suite.__registerCase("default", description, m.__suite, func)
end sub

sub __fit(description as string, func as object)
    m.__suite.__registerCase("focus", description, m.__suite, func)
end sub

sub __xit(description as string, func as object)
    m.__suite.__registerCase("skip", description, m.__suite, func)
end sub

' Registers a function to run before each child executes
' @param func the function to run
sub __roca_beforeEach(func as object)
    m.__suite.__state.beforeEachChildFn = func
end sub

' Registers a function to run after each child executes
' @param func the function to run
sub __roca_afterEach(func as object)
    m.__suite.__state.afterEachChildFn = func
end sub

' Fields to add to `m` in the case context.
' @param ctx a roAssociativeArray
sub __roca_addContext(ctx as object)
    if type(ctx) <> "roAssociativeArray" then
        print "[roca.brs] Error: addContext only accepts a 'roAssociativeArray' - got '" type(ctx) "'"
    ' called from roca object
    else if m.__ctx <> invalid then
        m.__ctx.append(ctx)
    ' called in suite
    else
        m.__suite.__ctx.append(ctx)
    end if
end sub

' Creates a new test suite, which can contain an arbitrary number of test cases and sub-suites.
' @returns a new test suite
function __roca_suite()
    return {
        __state: {
            parentSuite: invalid,
            description: "",
            cases: [],
            hasFocusedCases: false,
            hasFocusedSuites: false,
            hasFocusedDescendants: false,
            hasFocusedAncestors: false,
            hasSkippedAncestors: false,
            suites: [],
            results: {
                passed: 0,
                failed: 0,
                skipped: 0
            },
            ' function to run in-scope before executing the test suite
            beforeExecFn: invalid,
            ' function that each child should run in-scope before executing
            beforeEachChildFn: invalid,
            ' function to run in-scope after executing the test suite
            afterExecFn: invalid,
            ' function that each child should run in-scope after executing
            afterEachChildFn: invalid
        },
        __hasFocusedDescendants: __suite_hasFocusedDescendants,
        __totalCases: __suite_totalCases,
        __registerSuite: __suite_registerSuite,
        __registerCase: __suite_registerCase,
        __filterFocused: __suite_filterFocused,
        __ctx: {},
        exec: __suite_exec,
        mode: "",
    }
end function

' Registers a test case with the provided description and function in the given suite.
' @param mode one of ["default", "skip", "focus"], describing how this test was declared
' @param description a string describing the test case
' @param suite the suite from the parent 'describe', used to track test pass and fail states
' @param func the function to execute as part of the test case
sub __suite_registerCase(mode as string, description as string, suite as object, func as object)
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
            success: invalid
            metadata: invalid
        },
        description: description,
        func: func,
        suite: suite,
        report: __case_report,
        exec: __case_execute,
        __beforeExecFn: suite.__state.beforeEachChildFn,
        __afterExecFn: suite.__state.afterEachChildFn
    })
end sub

function __case_execute()
    withM = {
        pass: __util_pass,
        fail: __util_fail,
        log: __util_log,
        __suite: m.suite,
        __func: m.func,
        __state: m.__state
        assert: assert(__util_pass, __util_fail, m.__state)
        __beforeExecFn: m.__beforeExecFn
        __afterExecFn: m.__afterExecFn
    }

    ' extra case fields
    if m.suite.__ctx <> invalid then withM.append(m.suite.__ctx)

    ' we need to execute the beforeEach using the test case `m` scope
    if withM.__beforeExecFn <> invalid and type(withM.__beforeExecFn) = "Function" then
        withM.__beforeExecFn()
    end if

    withM.__func()

    ' we need to execute the afterEach using the test case `m` scope
    if withM.__afterExecFn <> invalid and type(withM.__afterExecFn) = "Function" then
        withM.__afterExecFn()
    end if
end function

function __case_report(index as integer, tap as object) as string
    if m.mode = "skip" or m.__state.success = invalid then
        tap.skip(index, m.description)
        return "skipped"
    end if

    if m.__state.success = true then
        tap.pass(index, m.description)
        return "passed"
    else if m.__state.success = false then
        tap.fail(index, m.description, m.__state.metadata)
        return "failed"
    end if
end function

function __suite_hasFocusedDescendants() as boolean
    for each suite in m.__state.suites
        if suite.mode = "focus" then
            return true
        else if suite.__state.hasFocusedCases = true then
            return true
        else if suite.__state.hasFocusedSuites = true then
            return true
        else if suite.__hasFocusedDescendants() = true then
            return true
        end if
    end for

    return m.__state.hasFocusedCases or m.__state.hasFocusedSuites
end function


function __suite_totalCases() as integer
    cases = 0
    for each suite in m.__state.suites
        cases += suite.__totalCases()
    end for

    return cases + m.__state.cases.count()
end function

' Registers a test case with the provided description and function in the given parent suite.
' @param description a string describing the suite of tests contained within.
' @param suite the suite from the parent `describe`, used to create sub-suites.  Use `invalid` for the top-level suite.
sub __suite_registerSuite(suite)
    m.__state.suites.push(suite)
end sub

sub __suite_filterFocused()
    ' If we have test cases or sub-suites that are in focus, only test those.
    ' Otherwise, we can assume that we should test everything because we are in the focus chain.
    if m.__state.hasFocusedDescendants then
        focusedCases = []
        for each testCase in m.__state.cases
            if testCase.mode = "focus" then
                focusedCases.push(testCase)
            end if
        end for

        focusedSuites = []
        for each suite in m.__state.suites
            if suite.mode = "focus" or suite.__state.hasFocusedDescendants then
                focusedSuites.push(suite)
            end if
        end for

        m.__state.cases = focusedCases
        m.__state.suites = focusedSuites
    end if
end sub

sub __suite_exec(args as object)
    if args.exec <> true then return

    if args.focusedCasesDetected then
        if m.__state.hasFocusedAncestors <> true and m.__state.hasFocusedDescendants <> true and m.mode <> "focus" then return

        m.__filterFocused()
    end if

    tap = args.tap
    tap.enterSubTest(m.__state.description)
    tap.plan(m.__state.suites.count() + m.__state.cases.count())

    subTestIndex = 0
    for each suite in m.__state.suites
        suite.exec({
            exec: true,
            focusedCasesDetected: args.focusedCasesDetected,
            index: subTestIndex,
            tap: args.tap
        })

        subTestIndex++
    end for
    tap.exitSubTest()

    index = subTestIndex
    for each case in m.__state.cases
        tap.indent()
        if case.mode <> "skip" and m.mode <> "skip" and m.__state.hasSkippedAncestors <> true then
            case.exec()
        end if
        result = case.report(index, tap)
        if result = "passed" then
            m.__state.results.passed++
        else if result = "failed" then
            m.__state.results.failed++
        else
            m.__state.results.skipped++
        end if
        tap.deindent()

        index++
    end for

    results = m.__state.results
    description = m.__state.description
    ' ignore skipped tests as part of suite completion -- as long as the suite doesn't fail, it's
    ' basically a success
    if results.failed > 0 then
        tap.fail(args.index, description)
    else
        tap.pass(args.index, description)
    end if
end sub

' Forces a test case into a "success" state.
'
' If the test case is already in a failure state, do nothing
' to preserve the previous failure.
sub __util_pass()
    if m.__state.success <> false
        m.__state.success = true
    end if
end sub

' Forces a test case into a "failure" state.
'
' If the test case is already in a failure state, do nothing
' to preserve the previous failure.
sub __util_fail(metadata = invalid)
    if m.__state.success <> false
        m.__state.success = false
        m.__state.metadata = metadata
    end if
end sub

' Prints messages to stdout in a TAP-compliant format
' @param msg the message to print as a TAP diagnostic
sub __util_log(arg as dynamic)
    tap().diagnostic(arg)
end sub
