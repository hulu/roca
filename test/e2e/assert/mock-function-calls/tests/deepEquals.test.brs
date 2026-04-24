function main(args as object) as object
    return roca(args).describe("deepEquals", sub()
        m.it("success array", sub()
            argument = [2]
            result = fakeFunc(argument)
            m.assert.deepEquals(result, argument, "arguments should match")
        end sub)

        m.it("success boolean values", sub()
            argument = true
            result = fakeFunc(argument)
            m.assert.deepEquals(result, argument, "arguments should match")
        end sub)

        m.it("success string values", sub()
            argument = "test"
            result = fakeFunc(argument)
            m.assert.deepEquals(result, argument, "arguments should match")
        end sub)

        m.it("success numeric values", sub()
            argument = 22
            result = fakeFunc(argument)
            m.assert.deepEquals(result, argument, "arguments should match")
        end sub)  

        m.it("failure array", sub()
            argument = [2]
            result = fakeFunc(argument)
            m.assert.deepEquals(result, [1], "Expected mock function 'fakeFunc' should have returned [2], but [1] is expected")
        end sub)

        m.it("failure boolean values", sub()
            argument = true
            result = fakeFunc(argument)
            m.assert.deepEquals(result, false, "Expected mock function 'fakeFunc' should have returned true, but false is expected")        
        end sub)

        m.it("failure string values", sub()
            argument = "test"
            result = fakeFunc(argument)
            m.assert.deepEquals(result, false, "Expected mock function 'fakeFunc' should have returned 'test', but false is expected")
        end sub)
        
        m.it("failure numeric values", sub()
            argument = 22
            result = fakeFunc(argument)
            m.assert.deepEquals(result, 11, "Expected mock function 'fakeFunc' should have returned 22, but 11 is expected")
        end sub)  
    end sub)
end function

function fakeFunc(arg as dynamic)
    return arg
end function
