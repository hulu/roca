# Quick start

This page is intended to get you up and running as fast as possible. For more examples and documentation, see the [API](api/) and [Guides](guides/) sections.

## Installation

Roca requires the [brs](https://github.com/sjbarag/brs/) runtime, which runs on [node.js](https://nodejs.org/en/).  If needed, initialize an NPM project with:

```bash
npm init
```

Then install `@hulu/roca` and `brs` as development dependencies:

```bash
npm install --save-dev @hulu/roca brs
```

Add an NPM hook to your `package.json` file. This will allow you to run your tests with `npm test`:

```jsonc
{
    // ...
    scripts: {
        "test": "roca"
    }
}
```

## Create a test

Create a folder called `tests` as a sibling to your `source/` and `components/` folder, and create a file inside it called `helloWorld.test.brs`. \
_Note: `roca` should be called from the same directory as your `manifest` file.  If you keep your entire source tree in a subdirectory, you'll want to `cd` into that before executing `roca`._

```
.
├── components
│  ├── FooComponent.brs
│  └── FooComponent.xml
├── manifest
├── source
│  ├── main.brs
│  └── util.brs
└── tests
   └── helloWorld.test.brs
```

## Modify channel entry point (if necessary)
Roca only supports a [main channel entry point of `runUserInterface`](https://developer.roku.com/docs/developer-program/getting-started/architecture/dev-environment.md#sub-runuserinterface), which helpfully avoids naming conflicts with the `main` functions used in `roca` and the individual test files.

Luckily `runUserInterface` is supported for all the same use-cases as `main`.


## Write your test
Copy the following into `helloWorld.test.brs`:
```brightscript
function main(args as object) as object
    return roca(args).describe("test suite", sub()
        m.it("has a test case", sub()
            m.pass()
        end sub)
    end sub)
end function
```

## Run it

In your terminal, run the command `npm test`. \

Congrats! You just wrote and ran your first passing test case! :tada:
