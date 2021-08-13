function main(args as object) as object
    return roca(args).describe("hasBeenCalled", sub()
        m.beforeEach(sub()
            m.spy = _brs_.mockFunction("fakeFunc")
        end sub)

        m.it("success", sub()
            fakeFunc()
            m.assert.hasBeenCalled(m.spy)
        end sub)

        m.it("failure", sub()
            m.assert.hasBeenCalled(m.spy)
        end sub)

        m.it("wrong argument", sub()
            m.assert.hasBeenCalled({})
        end sub)
    end sub)
end function

sub fakeFunc()
    ' noop
end sub
