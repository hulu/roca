function main(args as object) as object
    return roca(args).describe("root", sub()
        m.it("case 1", sub()
            m.pass()
        end sub)

        m.describe("lorem", sub()
            m.it("case 1", sub()
                m.pass()
            end sub)

            m.describe("ipsum", sub()
                m.it("case 1", sub()
                    m.pass()
                end sub)

                m.describe("dolor", sub()
                    m.it("case 1", sub()
                        m.pass()
                    end sub)

                    m.describe("sit", sub()
                        m.it("case 1", sub()
                            m.pass()
                        end sub)

                        m.describe("amet", sub()
                            m.it("case", sub()
                                m.pass()
                            end sub)
                        end sub)

                        m.it("case 2", sub()
                            m.pass()
                        end sub)
                    end sub)

                    m.it("case 2", sub()
                        m.pass()
                    end sub)
                end sub)

                m.it("case 2", sub()
                    m.pass()
                end sub)
            end sub)

            m.it("case 2", sub()
                m.pass()
            end sub)
        end sub)

        m.it("case 2", sub()
            m.pass()
        end sub)
    end sub)
end function