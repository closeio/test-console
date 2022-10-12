# test-console

A flexible framework for managing console messages in your tests.

## Use Case
## Install

```bash
yarn add -D @closeio/test-console
```

```bash
npm i --save-dev @closeio/test-console
```

## Usage

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
    { matcher: 'Each child in a list should have a unique "key" prop', level: 'ERROR' },
    { matcher: /warning: an update to .* inside a test was not wrapped in act/i, level: 'CRITICAL' },
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
