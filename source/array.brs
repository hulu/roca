function array_findIndex(needle, haystack) as Integer
    for i = 0 to haystack.count() - 1
        if haystack[i] = needle then
            return i
        end if
    end for
    return -1
end function