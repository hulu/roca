function Assert(passFunc, failFunc, state) as object
    return {
        __pass: passFunc,
        __fail: failFunc,
        __state: state
        equal: __equal,
        notEqual: __notEqual,
        isTrue: __isTrue,
        isFalse: __isFalse,
        isInvalid: __isInvalid,
        formatError: __formatError
    }
end function

sub __equal(actual, expected, error)
    if actual = expected then
        m.__pass()
    else
        m.__fail(m.formatError(error))
    end if
end sub

sub __notEqual(actual, expected, error)
    if actual <> expected then
        m.__pass()
    else
        m.__fail(m.formatError(error))
    end if
end sub

sub __isTrue(actual, error)
    if actual = true then
        m.__pass()
    else
        m.__fail(m.formatError(error))
    end if
end sub

sub __isFalse(actual, error)
    if actual = false then
        m.__pass()
    else
        m.__fail(m.formatError(error))
    end if
end sub

sub __isInvalid(actual, error)
    if actual = invalid then
        m.__pass()
    else
        m.__fail(m.formatError(error))
    end if
end sub

function __formatError(errMessage)
    return {
        error: {
            message: errMessage
        },
        stack: {}
    }
end function
