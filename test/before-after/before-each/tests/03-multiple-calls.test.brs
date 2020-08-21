function main(args as object) as object
    return roca(args).describe("multiple-calls root", sub()
        m.addContext({
            counterA: 0
        })

        m.beforeEach(sub()
            m.counterA++
            m.inScopeValue = "in-scope"
        end sub)

        m.beforeEach(sub()
            m.counterA++
            m.assert.equal(m.inScopeValue, "in-scope", "inScopeValue must remain in scope in subsequent beforeEach calls")
        end sub)

        m.beforeEach(sub()
            m.counterA++
            m.assert.equal(m.inScopeValue, "in-scope", "inScopeValue must remain in scope in subsequent beforeEach calls")
        end sub)

        m.it("case 1", sub()
            m.assert.equal(m.inScopeValue, "in-scope", "inScopeValue must remain in scope from beforeEach")
            m.assert.isInvalid(m.counterB, "afterEach state must not spread to sibling suites")
            m.assert.equal(m.counterA, 3, "counterA must be incremented for each test case")
        end sub)

        m.it("case 2", sub()
            m.assert.equal(m.inScopeValue, "in-scope", "inScopeValue must remain in scope from beforeEach")
            m.assert.isInvalid(m.counterB, "afterEach state must not spread to sibling suites")
            m.assert.equal(m.counterA, 6, "counterA must be incremented for each test case")
        end sub)

        m.xit("skipped case", sub()
            ' intentionally empty; afterEach() function shouldn't be called for this case
        end sub)

        m.it("case 3", sub()
            m.assert.equal(m.inScopeValue, "in-scope", "inScopeValue must remain in scope from beforeEach")
            m.assert.isInvalid(m.counterB, "afterEach state must not spread to sibling suites")
            m.assert.equal(m.counterA, 9, "counterA must be incremented for each test case")
        end sub)
    end sub)
end function
