function main(args as object) as object
    return roca(args).fdescribe("root", sub()
        m.it("ignores xit_each", sub()
            m.pass()
        end sub)

        m.xit_each([
                ' these would all fail if they ran
                { name: "case 1", in: "lorem", out: "lorem" },
                { name: "case 2", in: "iPsUm", out: "ipsum" },
                { name: "case 3", in: "DoLoR", out: "dolor" }
            ], function(args) : return args.name : end function,
            sub (args)
                m.assert.equal(ucase(args.in), args.out, "String '" + args.in + "' must uppercase to '" + args.out + "'")
            end sub
        )
    end sub)
end function