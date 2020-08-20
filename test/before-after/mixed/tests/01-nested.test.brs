function main(args as object) as object
    return roca(args).describe("nested root", sub()
        m.addContext({
            counterB: 0,
            incrementCounterB: incrementCounterB
        })

        m.beforeEach(sub()
            m.incrementCounterB()
        end sub)

        m.afterEach(sub()
            m.incrementCounterB()
        end sub)

        m.it("case 1", sub()
            m.assert.isInvalid(m.counterA, "afterEach state must not spread to sibling suites")
            m.assert.equal(m.counterB, 7, "counterB must be incremented for each test case")
        end sub)

        m.it("case 2", sub()
            m.assert.isInvalid(m.counterA, "afterEach state must not spread to sibling suites")
            m.assert.equal(m.counterB, 9, "counterB must be incremented for each test case")
        end sub)

        m.xit("skipped case", sub()
            ' intentionally empty; afterEach() function shouldn't be called for this case
        end sub)

        m.it("case 3", sub()
            m.assert.isInvalid(m.counterA, "afterEach state must not spread to sibling suites")
            m.assert.equal(m.counterB, 11, "counterB must be incremented for each test case")
        end sub)

        m.describe("suite 1", sub()
            m.addContext({
                counterC: 0,
                incrementCounterC: incrementCounterC
            })

            m.beforeEach(sub()
                m.incrementCounterC()
            end sub)

            m.afterEach(sub()
                m.incrementCounterC()
            end sub)

            m.it("case 1.1", sub()
                m.assert.isInvalid(m.counterA, "afterEach state must not spread to sibling suites")
                m.assert.equal(m.counterC, 1, "counterC must be incremented for each test case")
            end sub)

            m.it("case 1.2", sub()
                m.assert.isInvalid(m.counterA, "afterEach state must not spread to sibling suites")
                m.assert.equal(m.counterC, 3, "counterC must be incremented for each test case")
            end sub)

            m.xit("skipped case", sub()
                ' intentionally empty; afterEach() function shouldn't be called for this case
            end sub)

            m.it("case 1.3", sub()
                m.assert.isInvalid(m.counterA, "afterEach state must not spread to sibling suites")
                m.assert.equal(m.counterC, 5, "counterC must be incremented for each test case")
            end sub)
        end sub)
    end sub)
end function

sub incrementCounterB()
    ' WARNING: accessing m.__suite and m.__suite.__ctx are prone to breakage in future releases,
    ' and are being done here as part of testing the test framework; please don't view this as
    ' tacit approval to do the same in production tests :)
    if m.__suite.__ctx.counterB <> invalid then m.__suite.__ctx.counterB++
    m.append(m.__suite.__ctx)
end sub

sub incrementCounterC()
    ' WARNING: accessing m.__suite and m.__suite.__ctx are prone to breakage in future releases,
    ' and are being done here as part of testing the test framework; please don't view this as
    ' tacit approval to do the same in production tests :)
    if m.__suite.__ctx.counterC <> invalid then m.__suite.__ctx.counterC++
    m.append(m.__suite.__ctx)
end sub
