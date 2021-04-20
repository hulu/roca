' should all get run since `./xit.test.brs` doesn't include `fit()`
function main(args as object) as object
    return roca(args).describe("root 2", sub()
        m.it("case 1.1", pass)

        m.describe("suite 2", sub()
            m.it("case 2.1", pass)
            m.it("case 2.2", pass)
        end sub)

        m.it("case 3.1", pass)
    end sub)
end function

' passes a test
sub pass()
    m.pass()
end sub
