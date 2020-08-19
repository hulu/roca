function main(args as object) as object
    return roca(args).describe("foo", sub()
        m.it("case 1", sub()
            m.pass()
        end sub)

        m.it("case 2", sub()
            m.pass()
        end sub)
    end sub)
end function