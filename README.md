# test-console

A flexible framework for managing console messages in your tests.

## When to Use This?

Test output can get clutterd with logs and warnings for many reasons:

- You upgraded a library and it started showing warnings where it didn't before. There are many of these and you don't have time to resolve them all right now
- You started using a new testing library and it's showing you output or warnings about many things all at once
- A warning started showing and you just didn't notice at the time, but now you do

Whatever the reason, if you find that there's a lot of noise in the output
of your tests and you'd like to manage that, this library is for you!

## Approach

Our approach is to give you a succinct way to identify output in your tests
and deal with them in a systematic manner.

For instance, at Close we set the test output in our CI system to only show
CRITICAL items. That way we have only the most important information in the
output from our CI system, and if a test fails it's very easy to see why.
While testing in watch mode in our development environment shows everything.

When we want to eliminate a particular warning from our test system, we set
that matcher to be CRITICAL and run our tests with an CRITICAL threshold so
we only see the items we need to fix. This helps us focus on the task at
hand and see clearly when we've reached our goal.

## Install

```bash
yarn add -D @closeio/test-console
```

```bash
npm i --save-dev @closeio/test-console
```

## Usage

In a file that you load before running your tests, you can do something like this:

```typescript
import { patchConsoleMethods } from '@closeio/test-console';

// Make the threshold customizable from the command line
const threshold = process.env.TEST_CONSOLE_LEVEL || 'ERROR';

patchConsoleMethods(
  ['debug', 'info', 'log', 'warn', 'error'], // the console methods to patch
  // A list of tests to compare against logged messages, and their associated
  // log level if matched.
  [
    { matcher: /warning: failed prop type:/i, level: 'WARNING' },
    {
      matcher: 'Each child in a list should have a unique "key" prop',
      level: 'ERROR',
    },
    {
      matcher: /warning: an update to .* inside a test was not wrapped in act/i,
      level: 'CRITICAL',
    },
  ],
  {
    // filenameRegex determines what lines from the stack trace will show when
    // logging out the test location.
    filenameRegex: /\.test\.[jt]sx?/,
    // If given, getTestName will be called when logging out test location, to
    // help you track down where logs are coming from.
    getTestName: () => expect.getState().currentTestName,
    // Log messages whose level is >= the threshold will be shown, along with
    // log messages that didn't match one of the log tests.
    threshold,
  },
);
```

And then you can run your tests with the level you want like:

    TEST_CONSOLE_LEVEL=INFO yarn test
