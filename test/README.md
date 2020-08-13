# Testing Approach
Rather than writing tests for `@hulu/roca` that run in `@hulu/roca` (sometimes known as "[self-hosting](https://en.wikipedia.org/wiki/Self-hosting_(compilers))"), `@hulu/roca` is tested in an "end-to-end" fashion.  Each directory in this `test/` tree contains a set of related micro-projects that each exercise a specific piece of `roca` functionality.  These must be working integrations with `@hulu/roca`, including a `tests/` directory with one or more `.test.brs` files to be executed.  Each micro-project is executed in JavaScript (via the JavaScript interface to `roca`), with tests orchestrated by [jest](https://jestjs.io).

This approach enables each of the top-level directories within `test/` to be executed in parallel, and allows the individual micro-projects to also be used as samples for consumers.

# Running
## Everything
To run all tests, use `npm run test` as you would for a normal JavaScript project.

## Specific Test Groups
To run a specific test group (i.e. a top-level directory), use `npm run test -- /path/to/that/directory`.

## Specific Micro-Projects
To run a specific micro-project, you'll need to replace its `it()` call in `/path/to/group/group.test.js` as `fit()` or `it.only()`.

# Debugging Tests
For any of the commands above, replace `npm run test` with `npm run test:debug` to pause execution (awaiting an attached debugger), allowing you to attach the debugger of your choice to whatever testing configuration you've chosen.