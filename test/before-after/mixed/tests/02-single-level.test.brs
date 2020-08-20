function main(args as object) as object
    return roca(args).describe("single-level root", sub()
        m.addContext({
            counterA: 0,
            incrementCounterA: incrementCounterA
        })

        m.beforeEach(sub()
            m.incrementCounterA()

            m.inScopeValue = "in-scope"
        end sub)

        m.afterEach(sub()
            m.incrementCounterA()

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
    end sub)
end function

sub incrementCounterA()
    ' WARNING: accessing m.__suite and m.__suite.__ctx are prone to breakage in future releases,
    ' and are being done here as part of testing the test framework; please don't view this as
    ' tacit approval to do the same in production tests :)
    if m.__suite.__ctx.counterA <> invalid then m.__suite.__ctx.counterA++
    m.append(m.__suite.__ctx)
end sub
