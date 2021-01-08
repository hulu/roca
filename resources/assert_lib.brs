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
        m.__fail(m.formatError({
            message: error,
            actual: actual,
            expected: expected,
            funcName: "m.assert.equal"
        }))
    end if
end sub

sub __notEqual(actual, expected, error)
    if actual <> expected then
        m.__pass()
    else
        m.__fail(m.formatError({
            message: error,
            actual: actual,
            expected: expected,
            funcName: "m.assert.notEqual"
        }))
    end if
end sub

sub __isTrue(actual, error)
    if actual = true then
        m.__pass()
    else
        m.__fail(m.formatError({
            message: error,
            actual: actual,
            expected: true,
            funcName: "m.assert.isTrue"
        }))
    end if
end sub

sub __isFalse(actual, error)
    if actual = false then
        m.__pass()
    else
        m.__fail(m.formatError({
            message: error,
            actual: actual,
            expected: false,
            funcName: "m.assert.isFalse"
        }))
    end if
end sub

sub __isInvalid(actual, error)
    if actual = invalid then
        m.__pass()
    else
        m.__fail(m.formatError({
            message: error,
            actual: actual,
            expected: invalid,
            funcName: "m.assert.isInvalid"
        }))
    end if
end sub

function __formatError(error)
    ' Get the stack trace where the failed test is, filtering out any roca frames
    fileFilters = ["roca"]
    numStackFrames = 3
    error.stackFrames = _brs_.getStackTrace(numStackFrames, fileFilters)

    return error
end function

sub __deepEquals(actual, expected, error)
    if __roca_deepEquals(actual, expected) = true then
        m.__pass()
    else
        m.__fail(m.formatError({
            message: error,
            funcName: "m.deepEquals"
        }))
    end if
end sub

'utility function to compare two objects/associative arrays with nested data structures
function __roca_deepEquals(lhs as object, rhs as object) as boolean
    isEqual = true

    if __roca_isArray(lhs) and __roca_isArray(rhs) then
        ' base case
        if lhs.count() <> rhs.count() then return false

        index = 0
        for each updatedLeft in lhs
            updatedRight = rhs[index]

            isEqual = __roca_deepEquals(updatedLeft, updatedRight)

            if not isEqual then return false

            index++
        end for
    end if

    if __roca_isAssociativeArray(lhs) and __roca_isAssociativeArray(rhs) then
        ' base case
        if lhs.count() <> rhs.count() then return false

        for each key in lhs.keys()
            ' base case
            if not rhs.doesExist(key) then return false

            isEqual = __roca_deepEquals(lhs[key], rhs[key])
            if not isEqual then return false
        end for
    end if

    if __roca_isNumeric(lhs) <> __roca_isNumeric(rhs) then
        if lhs <> rhs then return false
    end if

    if __roca_isString(lhs) and __roca_isString(rhs) then
        if lhs <> rhs then return false
    end if

    if __roca_isInvalid(lhs) and __roca_isInvalid(rhs) then
        isEqual = true
    end if

    ' TODO: there's a 'get' of undefined runtime error when a function signature is read.
    ' ex. [Function __testFunc] throws undefined error. Will uncomment below once the issue is resolved
    ' if __roca_isFunction(lhs) and __roca_isFunction(rhs) then
    '     if lhs <> rhs then return false
    ' end if

    ' TODO: Add check for complex types such as roDeviceInfo, roDateTime, etc
    if __roca_isRoDeviceInfo(lhs) and __roca_isRoDeviceInfo(rhs) then
        ' return false for now, but implementation requires more work
        return false
    end if

    if __roca_isRoDateTime(lhs) and __roca_isRoDateTime(rhs) then
        ' return false for now, but implementation requires more work
        return false
    end if

    ' TODO: Flesh out implementation once "getFields" is supported by brs interpreter
    ' if __roca_isroSGNode(lhs) and __roca_isroSGNode(rhs) then
    '     lhsKV = lhs.getFields() ' returns an AA type
    '     rhsKV = rhs.getFields() ' returns an AA type

    '     if __roca_isAssociativeArray(lhsKV) and __roca_isAssociativeArray(rhsKV) then
    '         ' base case
    '         if lhsKV.count() <> rhsKV.count() then return false

    '         for each key in lhsKV.keys()
    '             ' base case
    '             if not rhsKV.doesExist(key) then return false

    '             isEqual = __roca_deepEquals(lhsKV[key], rhsKV[key])
    '             if not isEqual then return false
    '         end for
    '     end if
    ' end if

    return isEqual
end function

function __roca_isString(value as dynamic) as boolean
    return value <> invalid and getInterface(value, "ifString") <> invalid
end function

function __roca_isInteger(value as dynamic) as boolean
    return value <> invalid and getInterface(value, "ifInt") <> invalid
end function

function __roca_isFloat(value as dynamic) as boolean
    return value <> invalid and getInterface(value, "ifFloat") <> invalid
end function

function __roca_isDouble(value as dynamic) as boolean
    return value <> invalid and getInterface(value, "ifDouble") <> invalid
end function

function __roca_isArray(obj as dynamic) as boolean
    return obj <> invalid and getInterface(obj, "ifArray") <> invalid
end function

function __roca_isAssociativeArray(obj as dynamic) as boolean
    return obj <> invalid and getInterface(obj, "ifAssociativeArray") <> invalid
end function

function __roca_isInvalid(value as dynamic) as boolean
    return type(value) = "roInvalid"
end function

function __roca_isFunction(value as dynamic) as boolean
    return value <> invalid and getInterface(value, "ifFunction") <> invalid
end function

function __roca_isNumeric(value as dynamic) as boolean
    return  __roca_isInteger(value) or __roca_isFloat(value) or __roca_isDouble(value)
end function

function __roca_isRoSGNode(obj as dynamic) as boolean
    return obj <> invalid and type(obj) = "roSGNode"
end function

function __roca_isRoDeviceInfo(obj as dynamic) as boolean
    return obj <> invalid and type(obj) = "roDeviceInfo"
end function

function __roca_isRoDateTime(obj as dynamic) as boolean
    return obj <> invalid and type(obj) = "roDateTime"
end function
