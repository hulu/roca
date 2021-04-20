function main(args as object) as object
    return roca(args).describe("single-level root", sub()
        m.addContext({
            counterA: 0
        })

        m.beforeEach(sub()
            m.counterA++

            m.inScopeValue = "in-scope"
        end sub)

        m.it("case 1", sub()
            m.assert.isInvalid(m.counterB, "beforeEach state must not spread to sibling suites")
            m.assert.equal(m.counterA, 1, "counterA must be incremented for each test case")
            m.assert.equal(m.inScopeValue, "in-scope", "inScopeValue must match its set value in beforeEach")
        end sub)

        m.it("case 2", sub()
            m.assert.isInvalid(m.counterB, "beforeEach state must not spread to sibling suites")
            m.assert.equal(m.counterA, 2, "counterA must be incremented for each test case")
            m.assert.equal(m.inScopeValue, "in-scope", "inScopeValue must match its set value in beforeEach")
        end sub)

        m.xit("skipped case", sub()
            ' intentionally empty; beforeEach() function shouldn't be called for this case
        end sub)

        m.it("case 3", sub()
            m.assert.isInvalid(m.counterB, "beforeEach state must not spread to sibling suites")
            m.assert.equal(m.counterA, 3, "counterA must be incremented for each test case")
            m.assert.equal(m.inScopeValue, "in-scope", "inScopeValue must match its set value in beforeEach")
        end sub)
    end sub)
end function
