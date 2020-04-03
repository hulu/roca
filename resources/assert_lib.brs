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
    if deepEquals(actual, expected) = true then
        m.__pass()
    else
        m.__fail(m.formatError(error))
    end if
end sub

'utility function to compare two objects/associative arrays with nested data structures
function deepEquals(left as object, right as object) as boolean
    ' because Brightsript does not support closures and we are doing recursion,
    'we want to hold the function parameters in top-level state variables during each execution
    updatedLeftState = invalid
    updatedRightState = invalid
    isEqual = true

    if type(left) <> type(right) then return false

    if isArray(left) and isArray(right) then
        if left.count() <> right.count() then return false

        updatedLeftState = left
        updatedRightState = right

        index = 0
        for each updatedLeft in updatedLeftState
            updatedRight = updatedRightState[index]

            isEqual = deepEquals(updatedLeft, updatedRight)

            index++
        end for
    end if

    if isAssociativeArray(left) and isAssociativeArray(right) then
        for each key in left.keys()
            if not right.doesExist(key) then return false

            if isArray(left[key]) and isArray(right[key]) and left[key].count() <> right[key].count() then
                return false
            end if

            if isArray(left[key]) and isArray(right[key])then
                updatedLeftState = left[key]
                updatedRightState = right[key]

                isEqual = deepEquals(updatedLeftState, updatedRightState)

                if isEqual = false then exit for
            end if

            if isAssociativeArray(left[key]) and isAssociativeArray(right[key]) then
                updatedLeftState = left[key]
                updatedRightState = right[key]

                isEqual = deepEquals(updatedLeftState, updatedRightState)

                if isEqual = false then exit for
            end if

            ' we are at the point which the left and right data types coulbe primitive values (strings, integers, etc)
            if not (isAssociativeArray(left[key]) and isAssociativeArray(right[key])) and not (isArray(left[key]) and isArray(right[key])) then
                if left[key] <> right[key] then return false
            end if
        end for
    end if

    return isEqual
end function

function isArray(obj as dynamic) as boolean
    return isValid(obj) and getInterface(obj, "ifArray") <> invalid
end function

function isAssociativeArray(obj as dynamic) as boolean
    return isValid(obj) and getInterface(obj, "ifAssociativeArray") <> invalid
end function
