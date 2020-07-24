sub main()
    basePath = "tests"
    files = MatchFiles("pkg:/" + basePath, "*.test.brs")

    rootSuites = []
    for each file in files
        path = ["pkg:", basePath, file].join("/")
        suite = _brs_.runInScope(path, {})
        if GetInterface(suite, "ifArray") <> invalid then
            rootSuites.append(suite)
        else if suite <> invalid then
            rootSuites.push(suite)
        end if
    end for

    numFocusedSuites = 0
    focusedCasesDetected = false
    for each suite in rootSuites
        if suite.__state.hasFocusedDescendants then
            numFocusedSuites++
            focusedCasesDetected = true
        end if
    end for

    tap = tap()
    tap.version()

    if focusedCasesDetected then
        tap.plan(numFocusedSuites)
    else
        tap.plan(rootSuites.count())
    end if

    args = {
        exec: true,
        focusedCasesDetected: focusedCasesDetected,
        index: 0,
        tap: tap
    }

    for each file in files
        ' _brs_.resetMocks()

        path = ["pkg:", basePath, file].join("/")
        suite = _brs_.runInScope(path, args)

        ' If brs returned invalid for runInScope, that means the suite threw an exception, so we should bail.
        if suite = invalid then
            tap.bail("Error occurred in " + [basePath, file].join("/"))
            return
        end if

        ' If there are focused cases, only update the index when we've run a focused root suite.
        ' Otherwise, always update it.
        if focusedCasesDetected <> true or suite.__state.hasFocusedDescendants then
            args.index += 1
        end if
    end for
end sub

