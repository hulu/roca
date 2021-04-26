function main(args as object) as object
    return roca(args).describe("single-level root", sub()
        m.addContext({
            counterA: 0
        })

        m.beforeEach(sub()
            m.counterA++

            m.inScopeValue = "in-scope"
        end sub)

        m.afterEach(sub()
            m.counterA++

            m.assert.equal(m.inScopeValue, "in-scope", "inScopeValue must remain in scope in the afterEach")
        end sub)

        m.it("case 1", sub()
            m.assert.equal(m.inScopeValue, "in-scope", "inScopeValue must remain in scope from beforeEach")
            m.assert.isInvalid(m.counterB, "afterEach state must not spread to sibling suites")
            m.assert.equal(m.counterA, 1, "counterA must be incremented for each test case")
        end sub)

        m.it("case 2", sub()
            m.assert.equal(m.inScopeValue, "in-scope", "inScopeValue must remain in scope from beforeEach")
            m.assert.isInvalid(m.counterB, "afterEach state must not spread to sibling suites")
            m.assert.equal(m.counterA, 3, "counterA must be incremented for each test case")
        end sub)

        m.xit("skipped case", sub()
            ' intentionally empty; afterEach() function shouldn't be called for this case
        end sub)

        m.it("case 3", sub()
            m.assert.equal(m.inScopeValue, "in-scope", "inScopeValue must remain in scope from beforeEach")
            m.assert.isInvalid(m.counterB, "afterEach state must not spread to sibling suites")
            m.assert.equal(m.counterA, 5, "counterA must be incremented for each test case")
        end sub)
        
        m.it("check _brs_.testData", sub()
            m.assert.isTrue(_brs_.testData <> invalid, "_brs_.testData should be presented")
            m.assert.isTrue(_brs_.testData.count() = 0, "by default _brs_.testData should be equal to {}")
            
            ' change value to check whether it clears between different test files
            _brs_.testData = {
                ctx: "file 1"
            }
        end sub)
    end sub)
end function
