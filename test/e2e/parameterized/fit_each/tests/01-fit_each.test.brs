function main(args as object) as object
    return roca(args).fdescribe("root", sub()
        m.fit_each([
                { name: "case 1", in: "lorem", out: "LOREM" },
                { name: "case 2", in: "iPsUm", out: "IPSUM" },
                { name: "case 3", in: "DoLoR", out: "DOLOR" }
            ], function(args) : return args.name : end function,
            sub (args)
                m.assert.equal(ucase(args.in), args.out, "String '" + args.in + "' must uppercase to '" + args.out + "'")
            end sub
        )

        m.it_each([
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