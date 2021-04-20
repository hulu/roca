function main(args as object) as object
    return roca(args).describe("root", sub()
        m.describe("suite 1", sub()
            m.it("case 1.1", pass)
        end sub)

        m.fdescribe("suite 2", sub()
            m.it("case 2.1", pass)
            m.describe("suite 2.2", sub()
                m.it("case 2.2.1", pass)
            end sub)
        end sub)

        m.describe("suite 3", sub()
            m.it("case 3.1", pass)
            m.fdescribe("suite 3.2", sub()
                m.it("case 3.2.1", pass)
            end sub)
        end sub)
    end sub)
end function

' passes a test
sub pass()
    m.pass()
end sub
