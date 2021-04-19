function main(args as object) as object
    return roca(args).describe("nested root", sub()
        m.addContext({
           counterB: 0
        })

        m.beforeEach(sub()
            m.counterB++
        end sub)

        m.afterEach(sub()
            m.counterB++
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

        m.it("check _brs_.testData", sub()
            m.assert.isTrue(_brs_.testData <> invalid, "_brs_.testData should be presented")
            m.assert.isTrue(_brs_.testData.count() = 0, "by default _brs_.testData should be equal to {}")
            
            ' change value to check whether it clears between different test files
            _brs_.testData = {
                ctx: "file 1"
            }
        end sub)

        m.describe("suite 1", sub()
            m.addContext({
                counterC: 0
            })

            m.beforeEach(sub()
                m.counterC++
            end sub)

            m.afterEach(sub()
                m.counterC++
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
