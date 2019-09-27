sub main()
    basePath = "tests"
    files = MatchFiles("pkg:/" + basePath, "*.test.brs")
    print "# found " files.count() " files"
    roca = "pkg:/tests/roca.brs"

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

    totalTests = 0
    for each suite in rootSuites
        totalTests += suite.__state.totalCases
    end for

    args = {
        exec: true,
        focusedCasesDetected: focusedCasesDetected,
        startingIndex: 0
    }

    tap = tap()
    tap.version()
    tap.plan(totalTests)

    for each file in files
        path = ["pkg:", basePath, file].join("/")
        suite = _brs_.runInScope(path, args)
        args.startingIndex += suite.__state.totalCases
    end for
end sub

