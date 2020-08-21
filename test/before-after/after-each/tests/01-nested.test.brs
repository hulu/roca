function main(args as object) as object
    return roca(args).describe("nested root", sub()
        m.addContext({
            counterB: 0
        })

        m.afterEach(sub()
            m.counterB++
        end sub)

        m.it("case 1", sub()
            m.assert.isInvalid(m.counterA, "afterEach state must not spread to sibling suites")
            m.assert.equal(m.counterB, 3, "counterB must be incremented for each test case")
        end sub)

        m.it("case 2", sub()
            m.assert.isInvalid(m.counterA, "afterEach state must not spread to sibling suites")
            m.assert.equal(m.counterB, 4, "counterB must be incremented for each test case")
        end sub)

        m.xit("skipped case", sub()
            ' intentionally empty; afterEach() function shouldn't be called for this case
        end sub)

        m.it("case 3", sub()
            m.assert.isInvalid(m.counterA, "afterEach state must not spread to sibling suites")
            m.assert.equal(m.counterB, 5, "counterB must be incremented for each test case")
        end sub)

        m.describe("suite 1", sub()
            m.addContext({
                counterC: 0
            })

            m.afterEach(sub()
                m.counterC++
            end sub)

            m.it("case 1.1", sub()
                m.assert.isInvalid(m.counterA, "afterEach state must not spread to sibling suites")
                m.assert.equal(m.counterC, 0, "counterC must be incremented for each test case")
            end sub)

            m.it("case 1.2", sub()
                m.assert.isInvalid(m.counterA, "afterEach state must not spread to sibling suites")
                m.assert.equal(m.counterC, 1, "counterC must be incremented for each test case")
            end sub)

            m.xit("skipped case", sub()
                ' intentionally empty; afterEach() function shouldn't be called for this case
            end sub)

            m.it("case 1.3", sub()
                m.assert.isInvalid(m.counterA, "afterEach state must not spread to sibling suites")
                m.assert.equal(m.counterC, 2, "counterC must be incremented for each test case")
            end sub)
        end sub)
    end sub)
end function
