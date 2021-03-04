
## How do I test functions that are in the `source/` directory?

All code that lives in the `source/` directory is automatically pulled in-scope when you're executing code in any of the tests. So if you're testing functions from `source/`, then you can just call them directly from the test case.

<br />

--------------

## Why didn't my tests finish running?

If your tests stopped partway through without finishing, this generally indicates that there was a runtime error in your code. There should be a readable error printed out to the console that looks something like this:

```
/path/to/project/source/foo/bar.brs(5,42-43): 'baz' is not a function and cannot be called.
```

Once you fix the runtime errors, your tests should run without issue. If you're having trouble figuring out what's going on, it may be helpful to add a call to [`_brs_.getStackTrace()`](api/reference/test-utilities?id=_brs_getstacktracenumframes-10-excludepatterns-) in your code.
