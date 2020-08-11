function main(args as object) as object
    return roca(args).describe("baz suite", sub()
        m.it("has a test case", sub()
            m.assert.equal(test(), "baz", "test() must return ""baz""")
        end sub)

        m.it("has another test case", sub()
            m.pass()
        end sub)
    end sub)
end function
