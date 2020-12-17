# Testing Approach
Rather than writing tests for `@hulu/roca` that run in `@hulu/roca` (sometimes known as "[self-hosting](https://en.wikipedia.org/wiki/Self-hosting_(compilers))"), `@hulu/roca` is tested in an "end-to-end" fashion.  Each directory in this `test/` tree contains a set of related micro-projects that each exercise a specific piece of `roca` functionality.  These must be working integrations with `@hulu/roca`, including a `tests/` directory with one or more `.test.brs` files to be executed.  Each micro-project is executed in JavaScript (via the JavaScript interface to `roca`), with tests orchestrated by [jest](https://jestjs.io).

This approach enables each of the top-level directories within `test/` to be executed in parallel, and allows the individual micro-projects to also be used as samples for consumers.

# Running

## The build-test-clean dance
### Build
This project is written in TypeScript, so it needs to be compiled before it can be executed.  `npm run build` compiles files in `src/` into JavaScript and TypeScript declarations, and puts them in `lib/` and `types/` respectively.

```shell
$ npm run build

$ ls lib/
index.js (and friends)

$ ls types/
index.d.ts (and friends)
```

Alternatively, you can run the build step in "watch" mode. This will run `npm run build` for you automatically, every time it detects source file changes:
```shell
$ npm run watch
```
This is often useful for testing that local changes work in your BrightScript project, without having to run `npm run build` over and over.

### Testing
Tests are written in plain-old JavaScript with [Facebook's Jest](http://facebook.github.io/jest/), and can be run with the `test` target:

```shell
$ npm run test

# tests start running
```

Note that only test files ending in `.test.js` will be executed by `npm run test`.

### Cleaning
Compiled output in `lib/` and `types/` can be removed with the `clean` target:

```shell
$ npm run clean

$ ls lib/
ls: cannot access 'lib': No such file or directory

$ ls types/
ls: cannot access 'types': No such file or directory
```

### All Together
Thanks to the [npm-run-all](https://www.npmjs.com/package/npm-run-all) package, it's trivially easy to combine these into a sequence of tasks without relying on shell semantics:

```shell
$ npm run run-s clean build test
```

## Everything
To run all tests, use `npm run test` as you would for a normal JavaScript project.

## Specific Test Groups
To run a specific test group (i.e. a top-level directory), use `npm run test -- /path/to/that/directory`.

## Specific Micro-Projects
To run a specific micro-project, you'll need to replace its `it()` call in `/path/to/group/group.test.js` as `fit()` or `it.only()`.

# Debugging Tests
For any of the commands above, replace `npm run test` with `npm run test:debug` to pause execution (awaiting an attached debugger), allowing you to attach the debugger of your choice to whatever testing configuration you've chosen.
