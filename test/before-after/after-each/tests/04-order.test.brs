function main(args as object) as object
    return roca(args).describe("order of execution", sub()
        m.addContext({
            breadcrumbs: []
        })

        m.afterEach(sub()
            m.breadcrumbs.push(1)
        end sub)

        m.describe("second describe", sub()
            m.afterEach(sub()
                m.breadcrumbs.push(2)
            end sub)

            m.describe("third describe", sub()
                m.afterEach(sub()
                    m.breadcrumbs.push(3)
                end sub)

                m.it("case 1", sub()
                    m.assert.equal(m.breadcrumbs.count(), 0, "breadcrumbs should be empty in the first test")
                end sub)

                m.it("case 2", sub()
                    m.assert.equal(m.breadcrumbs.count(), 3, "breadcrumbs should have 3 entries in the second test")
                    m.assert.equal(m.breadcrumbs[0], 1, "afterEach should be executed from the top downward")
                    m.assert.equal(m.breadcrumbs[1], 2, "afterEach should be executed from the top downward")
                    m.assert.equal(m.breadcrumbs[2], 3, "afterEach should be executed from the top downward")
                end sub)
            end sub)
        end sub)
    end sub)
end function
