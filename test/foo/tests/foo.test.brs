function main(args as object) as object
    return roca(args).describe("test suite", sub()
        m.it("has a test case", sub()
            m.assert.equal(test(), "foo", "test() must return ""foo""")
        end sub)

        m.it("has another test case", sub()
            m.pass()
        end sub)
    end sub)
end function