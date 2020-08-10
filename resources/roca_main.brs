function main() as object
    basePath = "tests"
    files = MatchFiles("pkg:/" + basePath, "*.test.brs")

    rootSuites = []
    filesWithFocusedCases = []
    for each file in files
        filePath = [basePath, file].join("/")
        suite = _brs_.runInScope(["pkg:", filePath].join("/"), {})

        if suite = invalid then
            print "Error running tests: Runtime exception occurred in " + [basePath, file].join("/")
            return
        end if

        if GetInterface(suite, "ifArray") = invalid then
            suite = [suite]
        end if

        for each subSuite in suite
            if subSuite.mode = "focus" or subSuite.__state.hasFocusedDescendants then
                filesWithFocusedCases.push(filePath)
            end if

            rootSuites.push(subSuite)
        end for
    end for

    tap = tap()
    tap.version()

    numFocusedCases = filesWithFocusedCases.count()
    if focusedCasesDetected then
        tap.plan(numFocusedCases)
    else
        tap.plan(rootSuites.count())
    end if

    args = {
        exec: true,
        focusedCasesDetected: numFocusedCases > 0
        index: 0,
        tap: tap
    }

    for each file in files
        ' Don't allow test files to pollute each other
        _brs_.resetMocks()

        filePath = [basePath, file].join("/")
        suite = _brs_.runInScope(["pkg:", filePath].join("/"), args)

        ' If brs returned invalid for runInScope, that means the suite threw an exception, so we should bail.
        if suite = invalid then
            tap.bail("Error running tests: Runtime exception occurred in " + filePath)
            return
        end if

        ' If there are focused cases, only update the index when we've run a focused root suite.
        ' Otherwise, always update it.
        if focusedCasesDetected <> true or suite.__state.hasFocusedDescendants then
            args.index += 1
        end if
    end for

    return {
        filesWithFocusedCases: filesWithFocusedCases
    }
end function

