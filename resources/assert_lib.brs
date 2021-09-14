function Assert(passFunc, failFunc, state) as object
    return {
        __pass: passFunc,
        __fail: failFunc,
        __state: state
        __reportMockFunctionError: __roca_reportMockFunctionError
        equal: __equal,
        notEqual: __notEqual,
        isTrue: __isTrue,
        isFalse: __isFalse,
        isValid: __isValid,
        isInvalid: __isInvalid,
        formatError: __formatError,
        deepEquals: __deepEquals,
        hasBeenCalled: __roca_hasBeenCalled,
        hasBeenCalledTimes: __roca_hasBeenCalledTimes,
        hasBeenCalledWith: __roca_hasBeenCalledWith
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

sub __isValid(actual, error)
    if actual <> invalid then
        m.__pass()
    else
        m.__fail(m.formatError({
            message: error,
            actual: actual,
            expected: "non-invalid",
            funcName: "m.assert.isValid"
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

' Convert a value to a multiline string that's human-readable.
' Converting every value to a string ensures that the diff will _always_ show up in the output.
function __asReadableValue(value)
    readable = { _roca_isMultilineString: true }
    if __roca_isString(value) then
        readable.value = value
    else if __roca_isNumeric(value) then
        readable.value = stri(value).trim()
    else if __roca_isRoSGNode(value) then
        readable.value = "[RoSGNode: " + type(value) + "]"
    else
        readable.value = formatJson(value)
    end if

    return readable
end function

function __formatError(error)
    ' Get the stack trace where the failed test is, filtering out any roca frames
    fileFilters = ["roca"]
    numStackFrames = 3
    stack_frames = _brs_.getStackTrace(numStackFrames, fileFilters)

    error.expected = __asReadableValue(error.expected)
    error.actual = __asReadableValue(error.actual)

    ' Format this into the object that tap-mocha-reporter expects
    return {
        error: {
            name: error.funcName,
            message: error.message,
            ' use snake case so we don't have to worry about case-sensitivity
            stack_frames: stack_frames
        },
        wanted: error.expected,
        found: error.actual
    }
end function

sub __deepEquals(actual, expected, error)
    if __roca_deepEquals(actual, expected) = true then
        m.__pass()
    else
        m.__fail(m.formatError({
            message: error,
            funcName: "m.deepEquals",
            expected: expected,
            actual: actual
        }))
    end if
end sub

'utility function to compare two objects/associative arrays with nested data structures
function __roca_deepEquals(lhs as object, rhs as object) as boolean
    isEqual = true

    if type(lhs) <> type(rhs) then return false

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

    if __roca_isNumeric(lhs) and __roca_isNumeric(rhs) then
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

function __roca_isMockFunction(mock)
    return __roca_isAssociativeArray(mock) and __roca_isArray(mock.calls) and mock.getMockName <> invalid
end function

sub __roca_reportMockFunctionError(actualArg, funcName)
    m.__fail(m.formatError({
        message: "You must pass a mock function (created via `_brs_.mockFunction`) as the argument.",
        actual: actualArg,
        expected: "[Mock Function]",
        funcName: funcName
    }))
end sub

' Takes an array and turns it into a comma-separated string value
function __roca_arrayToString(array)
    stringArray = []
    for each item in array
        stringArray.push(__asReadableValue(item).value)
    end for
    return stringArray.join(", ")
end function

sub __roca_hasBeenCalled(mock as object, error = invalid)
    if not __roca_isMockFunction(mock) then
        m.__reportMockFunctionError(mock, "m.assert.hasBeenCalled")
        return
    end if

    if mock.calls.count() > 0 then
        m.__pass()
    else
        if error = invalid then
            error = "Expected mock function '" + mock.getMockName() + "' to have been called"
        end if

        m.__fail(m.formatError({
            message: error,
            actual: 0,
            expected: "> 0",
            funcName: "m.assert.hasBeenCalled"
        }))
    end if
end sub

sub __roca_hasBeenCalledTimes(mock as object, count as integer, error = invalid)
    if not __roca_isMockFunction(mock) then
        m.__reportMockFunctionError(mock, "m.assert.hasBeenCalledTimes")
        return
    end if

    if mock.calls.count() = count
        m.__pass()
    else
        if error = invalid then
            error = "Expected mock function '" + mock.getMockName() + "' to have been called" + stri(count) + " times"
        end if

        m.__fail(m.formatError({
            message: error,
            actual: mock.calls.count(),
            expected: count,
            funcName: "m.assert.hasBeenCalledTimes"
        }))
    end if
end sub

sub __roca_hasBeenCalledWith(mock as object, argsArray as object, error = invalid)
    if not __roca_isMockFunction(mock) then
        m.__reportMockFunctionError(mock, "m.assert.hasBeenCalledWith")
        return
    end if

    actualArgs = []
    for each funcCall in mock.calls
        if __roca_deepEquals(funcCall, argsArray) then
            m.__pass()
            return
        end if
        actualArgs.push("(" + __roca_arrayToString(funcCall) + ")")
    end for

    stringArgsArray = "(" + __roca_arrayToString(argsArray) + ")"
    if error = invalid then
        error = "Expected mock function '" + mock.getMockName() + "' to have been called with args " + stringArgsArray
    end if

    m.__fail(m.formatError({
        message: error,
        actual: actualArgs.join(" or "),
        expected: stringArgsArray,
        funcName: "m.assert.hasBeenCalledWith"
    }))
end sub
