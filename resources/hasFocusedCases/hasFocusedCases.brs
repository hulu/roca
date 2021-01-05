function __roca_hasFocusedCases(suite) as boolean
    if suite = invalid then return false

    if GetInterface(suite, "ifArray") = invalid then
        suite = [suite]
    end if

    for each subSuite in suite
        if subSuite.mode = "focus" or subSuite.__state.hasFocusedDescendants then return true
    end for

    return false
end function
