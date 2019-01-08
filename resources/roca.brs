sub describe(description as string, context as object, func as object)
    if context = invalid then
        context = createContext()
    end if

    context.__registerSuite(description, context, func)

    func(context)

    if context.__state.parentCtx = invalid then
        ' calls func, checks the result, and prints "ok" or "not ok" followed by the description variable
        for each case in context.__state.cases
            ' TODO: recursively execute tests
            case.func(case.ctx)

            if case.ctx.__state.success then
                print "ok - " case.description
            else
                print "not ok - " case.description
            end if
        end for
    end if
end sub

sub it(description as string, context as object, func as object)
    context.__registerCase(description, context, func)
end sub

sub createContext()
    return {
        __state: {
            parentCtx: invalid,
            success: true,
            cases: [],
            suites: []
        },
        __registerSuite: __context_registerSuite,
        __registerCase: __context_registerCase
        pass: __context_pass,
        fail: __context_fail
    }
end sub

sub __context_registerCase(description as string, context, func as object)
    m.__state.cases.push({
        description: description,
        func: func,
        ctx: context
    })
end sub

sub __context_registerSuite(description as string, context as object, func as object)
    m.__state.suites.push({
        description: description,
        func: func,
        ctx: context
    })
end sub

sub __context_pass()
    m.__state.success = true
end sub

sub __context_fail()
    m.__state.success = false
end sub
