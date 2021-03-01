# Setting up and cleaning up tests

There are two types of setup: global setup, using [the `--require` CLI option](api/cli-options?id=-r-require), and test case setup, using [`m.beforeEach`](api/reference/test-suites-and-cases?id=mbeforeeachfunc) (and the corresponding [`m.afterEach`](api/reference/test-suites-and-cases?id=maftereachfunc)). The documentation section for global setup using `--require` is detailed and includes examples, so this guide will focus on test case setup.

If you've used [Mocha's `beforeEach` and `afterEach`](https://mochajs.org/#hooks) for JavaScript testing, this should look familiar to you. If not, have no fear -- that's what this guide is for

# Basic usage

## Setup

Often, there is certain functionality that you'd like to run prior to each test -- things like mocks and helper functions. Say, for example, that we want to print out a greeting to the console:

```brightscript
m.describe("my test suite", sub()
    m.beforeEach(sub()
        print "hello there"
    end sub)

    m.it("test case 1", sub()
        print "howdy 1"
        m.pass()
    end sub)
end sub)
```

Here's the order of the output when we run the tests:
```
hello there
howdy 1
```

We can add more test cases, and the `beforeEach` will run prior to each one:
```brightscript
m.describe("my test suite", sub()
    m.beforeEach(sub()
        print "hello there"
    end sub)

    m.it("test case 1", sub()
        print "howdy 1"
        m.pass()
    end sub)

    m.it("test case 2", sub()
        print "howdy 2"
        m.pass()
    end sub)
end sub)
```

Now, we see:
```
hello there
howdy 1
hello there
howdy 2
```

## Clean up

If we want to run code _after_ each test case, we can do that, too. Let's add to our previous example:

```brightscript
m.describe("my test suite", sub()
    m.beforeEach(sub()
        print "hello there"
    end sub)

    ' ------------------
    ' Add this function:
    m.afterEach(sub()
        print "ok, bye"
    end sub)
    ' ------------------

    m.it("test case 1", sub()
        print "howdy 1"
        m.pass()
    end sub)

    m.it("test case 2", sub()
        print "howdy 2"
        m.pass()
    end sub)
end sub)
```

Now, we get:
```
hello there
howdy 1
ok, bye
hello there
howdy 2
ok, bye
```

# Nested calls

If we have nested `m.describe` blocks, then the execution order is: 
```
beforeEach, top to bottom => test case => afterEach, bottom to top 
```

Here's how that would look in code:
```brightscript
m.describe("level 0, suite 1", sub()
    m.beforeEach(sub()
        print "level 0, beforeEach"
    end sub)

    m.afterEach(sub()
        print "level 0, afterEach"
    end sub)

    m.describe("level 1, suite 1", sub()
        m.beforeEach(sub()
            print "level 1, beforeEach"
        end sub)

        m.afterEach(sub()
            print "level 1, afterEach"
        end sub)

        m.describe("level 2, suite 1", sub()
            m.beforeEach(sub()
                print "level 2, beforeEach"
            end sub)

            m.afterEach(sub()
                print "level 2, afterEach"
            end sub)

            m.it("level 2, test 1", sub()
                print "level 2, test"
            end sub)
        end sub)
    end sub)
end sub)
```

Here's our output:
```
level 0, beforeEach
level 1, beforeEach
level 2, beforeEach
level 2, test
level 2, afterEach
level 1, afterEach
level 0, afterEach
```

# Sharing scope

`m.beforeEach` and `m.afterEach` have a **shared `m` scope** with the test case they're running for. What this means is that you can share `m` properties in your setup, test, and clean up. For example:

```brightscript
m.describe("my test suite", sub()
    m.beforeEach(sub()
        m.foo = "bar"
    end sub)

    m.afterEach(sub()
        print m.foo ' => "baz"
    end sub)

    m.it("my test case", sub()
        print m.foo ' => "bar"
        m.foo = "baz"
    end sub)
end sub)
```

However, since each test case runs in its own `m` scope, you can't share properties across the suites:

```brightscript
m.describe("a test suite", sub()
    m.beforeEach(sub()
        print m.foo ' => 1. invalid
                    ' => 2. invalid
    end sub)

    m.afterEach(sub()
        print m.foo ' => 1. "bar"
                    ' => 2. invalid
    end sub)

    m.it("a test case", sub()
        m.foo = "bar"
    end sub)

    m.it("a second test case", sub()
        print m.foo ' => invalid
    end sub)
end sub)
```
