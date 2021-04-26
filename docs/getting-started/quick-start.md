# Quick start

This page is intended to get you up and running as fast as possible. If you want to play around with the framework, check out the [sandbox](getting-started/code-sandbox.md). For more examples and documentation, see the [API](api/reference/) and [Guides](guides/) sections.

## Installation
 _Note: All examples use `npm`, but these steps should be easily adapted to [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.js.org/), and many other JavaScript package managers._

Roca requires the [brs](https://github.com/sjbarag/brs/) runtime, which runs on [node.js](https://nodejs.org/en/). If needed, initialize an NPM project with:

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

_Note: `roca` should be called from the same directory as your `manifest` file.  If you keep your entire source tree in a subdirectory, you'll want to `cd` into that before executing `roca`._

Create a folder called `tests` as a sibling to your `source/` and `components/` folder, and create a file inside it called `helloWorld.test.brs`.

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

In your terminal, run the command `npm test`.

Congrats! You just wrote and ran your first passing test case! :tada:

## Running from the command line

You can also run `roca` directly from the CLI (note: `roca` will need to be on your `PATH`, either via a global install, e.g. `yarn global add roca`/`npm install -g roca`, or by using [npx](https://docs.npmjs.com/cli/v7/commands/npx)).

We use a similar file matching rules as [Jest](https://jestjs.io/docs/getting-started#running-from-command-line). Here's an example showing how to run `roca` on files matching `foo`, given this structure:

```
my-brightscript-project/
  |__ test/
    |__ fly-you-fools.test.brs
    |__ foo/
      |__ bar.test.brs
      |__ another-bar.test.brs
```
_(["Fly, you fools"](https://lotr.fandom.com/wiki/Gandalf#Fall_in_Mines_of_Moria))_

We could then run:
```shell
$ roca foo     # if roca is globally installed
$ npx roca foo # if roca is locally installed
```

And `roca` will run:
- `bar.test.brs` and `another-bar.test.brs` because they're in a folder (`foo/`) that contains the string `foo`
- `fly-you-fools.test.brs` because `foo` is part of the file name

Here are some examples of other subsets we could run:

```shell
$ roca bar              # runs: bar.test.brs, another-bar.test.brs
$ roca bar.test.brs     # runs: bar.test.brs, another-bar.test.brs
$ roca foo/bar.test.brs # runs: bar.test.brs
$ roca another fly      # runs: another-bar.test.brs, fly-you-fools.test.brs
$ roca foo/             # runs: everything in foo/ (i.e. bar.test.brs and another-bar.test.brs)
```
