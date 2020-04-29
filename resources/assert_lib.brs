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
        formatError: __formatError,
        deepEquals: __deepEquals
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

sub __deepEquals(actual, expected, error)
    if __roca_deepEquals(actual, expected) = true then
        m.__pass()
    else
        m.__fail(m.formatError(error))
    end if
end sub

'utility function to compare two objects/associative arrays with nested data structures
function __roca_deepEquals(lhs as object, rhs as object) as boolean
    ' because Brightsript does not support closures and we are doing recursion,
    'we want to hold the function parameters in top-level state variables during each execution
    updatedLeftState = invalid
    updatedRightState = invalid
    isEqual = true

    ' base case
    if type(lhs) <> type(rhs) then return false

    if isArray(lhs) and isArray(rhs) then
        ' base case
        if lhs.count() <> rhs.count() then return false

        updatedLeftState = lhs
        updatedRightState = rhs

        index = 0
        for each updatedLeft in updatedLeftState
            updatedRight = updatedRightState[index]

            isEqual = deepEquals(updatedLeft, updatedRight)

            if not isEqual then return false

            index++
        end for
    end if

    if isAssociativeArray(lhs) and isAssociativeArray(rhs) then
        ' base case
        if lhs.count() <> rhs.count() then return false

        for each key in lhs.keys()
            ' base case
            if not rhs.doesExist(key) then return false

            if isArray(lhs[key]) and isArray(rhs[key])then
                updatedLeftState = lhs[key]
                updatedRightState = rhs[key]

                isEqual = deepEquals(updatedLeftState, updatedRightState)

                if not isEqual then return false
            end if

            if isAssociativeArray(lhs[key]) and isAssociativeArray(rhs[key]) then
                updatedLeftState = lhs[key]
                updatedRightState = rhs[key]

                isEqual = deepEquals(updatedLeftState, updatedRightState)

                if not isEqual then return false
            end if

            if isString(lhs[key]) and isString(rhs[key]) then
                if lhs[key] <> rhs[key] then return false
            end if

            if isInteger(lhs[key]) and isInteger(rhs[key]) then
                if lhs[key] <> rhs[key] then return false
            end if
        end for
    end if

    return isEqual
end function

function isString(value as dynamic) as boolean
    return value <> invalid and getInterface(value, "ifString") <> invalid
end function

function isInteger(value as dynamic) as boolean
    return value <> invalid and getInterface(value, "ifInt") <> invalid
end function

function isArray(obj as dynamic) as boolean
    return obj <> invalid and getInterface(obj, "ifArray") <> invalid
end function

function isAssociativeArray(obj as dynamic) as boolean
    return obj <> invalid and getInterface(obj, "ifAssociativeArray") <> invalid
end function
