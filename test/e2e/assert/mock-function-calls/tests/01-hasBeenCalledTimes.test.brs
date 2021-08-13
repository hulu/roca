function main(args as object) as object
    return roca(args).describe("hasBeenCalledTimes", sub()
        m.beforeEach(sub()
            m.spy = _brs_.mockFunction("fakeFunc")
        end sub)

        m.describe("success", sub()
            m.it("0", sub()
                m.assert.hasBeenCalledTimes(m.spy, 0)
            end sub)
            
            m.it("1", sub()
                fakeFunc()
                m.assert.hasBeenCalledTimes(m.spy, 1)
            end sub)

            m.it("10", sub()
                for i = 1 to 10 
                    fakeFunc()
                end for
                m.assert.hasBeenCalledTimes(m.spy, 10)
            end sub)
        end sub)

        m.describe("failure", sub()
            m.beforeEach(sub()
                for i = 1 to 5 
                    fakeFunc()
                end for
            end sub)

            m.it("too few calls", sub()
                m.assert.hasBeenCalledTimes(m.spy, 4)
            end sub)

            m.it("too many calls", sub()
                m.assert.hasBeenCalledTimes(m.spy, 6)
            end sub)
        end sub)
    end sub)
end function

sub fakeFunc()
    ' noop
end sub
