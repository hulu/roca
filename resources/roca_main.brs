sub main()
    basePath = "tests"
    files = MatchFiles("pkg:/" + basePath, "*.test.brs")

    rootSuites = []
    for each file in files
        path = ["pkg:", basePath, file].join("/")
        suite = _brs_.runInScope(path, {})
        if suite <> invalid then rootSuites.push(suite)
    end for

    focusedCasesDetected = false
    for each suite in rootSuites
        focusedCasesDetected = (focusedCasesDetected or suite.__state.transitivelyHasFocusedCases)
    end for

    tap = tap()
    tap.version()
    tap.plan(rootSuites.count())

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

