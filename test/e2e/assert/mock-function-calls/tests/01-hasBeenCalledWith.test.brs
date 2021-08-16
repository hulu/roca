function main(args as object) as object
    return roca(args).describe("hasBeenCalledWith", sub()
        m.beforeEach(sub()
            m.spy = _brs_.mockFunction("fakeFunc")
        end sub)

        m.describe("success", sub()
            m.it("no args", sub()
                fakeFunc()
                m.assert.hasBeenCalledWith(m.spy, [])
            end sub)

            m.it("primitive arg", sub()
                fakeFunc("foo")
                m.assert.hasBeenCalledWith(m.spy, ["foo"])
            end sub)

            m.it("complex arg", sub()
                fakeFunc({ foo: "bar" })
                m.assert.hasBeenCalledWith(m.spy, [{foo: "bar"}])
            end sub)

            m.it("multiple args", sub()
                fakeFunc({ foo: "bar" }, "baz", 123)
                m.assert.hasBeenCalledWith(m.spy, [{foo: "bar"}, "baz", 123])
            end sub)

            m.it("multiple calls", sub()
                fakeFunc("foo")
                fakeFunc("bar")
                fakeFunc("baz")
                m.assert.hasBeenCalledWith(m.spy, ["foo"])
                m.assert.hasBeenCalledWith(m.spy, ["bar"])
                m.assert.hasBeenCalledWith(m.spy, ["baz"])
            end sub)
        end sub)

        m.describe("failure", sub()
            m.it("not called", sub()
                m.assert.hasBeenCalledWith(m.spy, ["foo"])
            end sub)

            m.it("incorrect arg", sub()
                fakeFunc("foo")
                m.assert.hasBeenCalledWith(m.spy, ["bar"])
            end sub)

            m.it("too many actual args", sub()
                fakeFunc("foo", 123)
                m.assert.hasBeenCalledWith(m.spy, [123])
            end sub)

            m.it("too few actual args", sub()
                fakeFunc("foo")
                m.assert.hasBeenCalledWith(m.spy, ["foo", 123])
            end sub)

            m.it("multiple calls, no matches", sub()
                fakeFunc(["foo", "bar"], 123)
                fakeFunc([], 456)
                m.assert.hasBeenCalledWith(m.spy, [["baz"], 456])
            end sub)
        end sub)
    end sub)
end function

sub fakeFunc()
    ' noop
end sub
