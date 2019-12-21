function Assert(passFunc, failFunc, state) as object
    return {
        __pass: passFunc,
        __fail: failFunc,
        __state: state
        equal: __equal,
        notEqual: __notEqual,
        isTrue: __isTrue,
        isFalse: __isFalse,
        isInvalid: __isInvalid
    }
end function

sub __equal(actual, expected)
    if actual = expected then
        m.__pass()
    else
        m.__fail()
    end if
end sub

sub __notEqual(actual, expected)
    if actual <> expected then
        m.__pass()
    else
        m.__fail()
    end if
end sub

sub __isTrue(actual)
    if actual = true then
        m.__pass()
    else
        m.__fail()
    end if
end sub

sub __isFalse(actual)
    if actual = false then
        m.__pass()
    else
        m.__fail()
    end if
end sub

sub __isInvalid(actual)
    if actual = invalid then
        m.__pass()
    else
        m.__fail()
    end if
end sub
