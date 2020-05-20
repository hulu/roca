sub main()
    basePath = "tests"
    files = MatchFiles("pkg:/" + basePath, "*.test.brs")

    rootSuites = []
    for each file in files
        path = ["pkg:", basePath, file].join("/")
        suite = _brs_.runInScope(path, {})
        if suite <> invalid then rootSuites.push(suite)
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
        path = ["pkg:", basePath, file].join("/")
        suite = _brs_.runInScope(path, args)
        args.index += 1
    end for
end sub

