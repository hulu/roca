function main(args as object) as object
    return roca(args).describe("suite", sub()
        m.it("case 1", sub()
            m.pass()
        end sub)

        m.it("case 2", sub()
            ' nothing (should be "pending")
        end sub)

        m.it("case 3", sub()
            m.fail()
        end sub)
    end sub)
end function