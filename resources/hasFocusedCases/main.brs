' Driver script to check for focused cases in a suite. The function
' __roca_hasFocusedCases is defined in roca_runHelpers.brs.
function main(suite) as boolean
    return __roca_hasFocusedCases(suite)
end function
