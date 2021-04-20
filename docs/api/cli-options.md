# `roca` CLI

## Reporting

Roca exclusively reports its state via the [Test Anything Protocol](http://testanything.org/), and defaults to a Mocha-like "spec" output.  Failed tests cause the `roca` CLI to return a non-zero exit code, which allows most continuous integration systems to automatically detect pass/fail states.

Other output formats are available!  See `roca --help` for more details.

## Usage

```shell
roca [options] [file names and/or patterns]
```

For more information, see [Running from the command line](getting-started/quick-start#running-from-the-command-line).

## Options

| Option                  | Description       |
| ------------------------|----------------|
| `-h`/`--help`           | The help menu. |
| `-s`/`--source`         | Path to brs files (if different from `source/`) |
| `-R`/`--reporter`       | The reporter to use. In addition to all of [the `mocha` reporters](https://mochajs.org/#reporters), we also offer a [Jest-style reporter](https://jestjs.io/). _Note: we use the [`tap-mocha-reporter`](https://github.com/tapjs/tap-mocha-reporter) NPM package for Mocha reporters._  |
| `-r`/`--require` | Path to a required setup file. This file will be run before unit tests. See [the `--require` section](#-r-require) for more details.|
| `-f`/`--forbid-focused` | Fails if focused test or suite is detected. Useful for use on CI systems to prevent focused tests from being merged. |
| `-c`/`--coverage-reporters` | The `istanbul` coverage reporters to use. Passing in reporter(s) will enable coverage collection and reporting. Otherwise, it is disabled. See `--help` for options, and [`istanbul`'s docs](https://istanbul.js.org/docs/advanced/alternative-reporters/) for descriptions of the reporters. |

### -r/--require
In order to enable custom unit test helper functions and/or unit test setup code, you can create a BrightScript file that will be run before any of your unit tests. 

#### Usage
If you wanted to define a helper function that you could call in any of your unit tests:
```brightscript
' inside myProject/tests/MySetupFile.brs
function callMeAnywhere()
  return 123
end function
```

Then in your code, you'd have:
```brightscript
' inside myProject/tests/MyTestFile.test.brs
...
m.it("calls a globally-defined test function", sub()
    print callMeAnywhere() ' => 123
end sub)
```

And then you'd tell to `roca` to use the setup file:
```bash
roca -r "tests/MySetupFile.brs"
```
