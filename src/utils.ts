import { ConsoleArgs, Matcher, LogTest, LogLevel } from './types';
import { format } from 'util';

interface GetTestLocationArgs {
  filenameRegex?: RegExp;
  getTestName?: () => string;
}

// Returns a string with information about where the function was called from
//
// getTestName - should return the name of the current test. For instance with
//   expect this should be `() => expect.getState().currentTestName`
// filenameRegex - will pull lines out of the stack trace that match the
//   regeexp. For instance `/\.test\.[jt]sx/` to match test files with a
//   .test.ts suffix.
export const getTestLocation = ({
  filenameRegex,
  getTestName,
}: GetTestLocationArgs = {}) => {
  const testLines = getTestFileStackTraceLines(filenameRegex);

  if (getTestName) {
    let location = `In Test [${getTestName()}]`;

    if (testLines.length) {
      location += '\n' + testLines.join('\n');
    }

    return location;
  }

  return testLines.join('\n');
};

// Given a list of test and the args passed to a console method, returns the
// LogLevel of the first test that matches the args. Or returns null if no
// tests match the args.
export const getLogLevel = (
  tests: LogTest[],
  consoleArgs: ConsoleArgs,
): LogLevel | null => {
  const args = prepareArgs(consoleArgs);

  const matchingTest = tests.find(({ matcher }) => argsMatch(matcher, args));

  if (matchingTest) {
    return matchingTest.level;
  }

  return null;
};

// Prepares console.log (and friends) args to be tested against string
// and RegExp matchers.
//
// Console.log (and friends) can take format strings and args, such as:
// console.log('Warning: Failed %s type: %s', 'prop', 'The prop ...')
//
// This method uses the same format method as the console methods and
// attempts to interpret the args as a foramt string and args. If it
// does, the formatted string is returned.
//
// If the first arg cannot be interpreted as a format string, all args
// are stringified and the resulting string array is returned.
const prepareArgs = (args: ConsoleArgs): string[] => {
  const [formatString] = args;

  if (typeof formatString === 'string') {
    const formatted = format(...args);

    if (formatted !== formatString) {
      return [formatted];
    }
  }

  return args.map(toString);
};

// Checks to see if a matcher matches any of the given args.
const argsMatch = (matcher: Matcher, args: string[]) =>
  args.some((arg) => argMatches(matcher, arg));

// Checks to see if a matcher matches a specific arg.
const argMatches = (matcher: Matcher, arg: string) => {
  if (typeof matcher === 'string') {
    return arg.includes(matcher);
  }
  return matcher.test(arg);
};

// Gets the current stack trace and returns an array of lines that match the
// given RegExp
const getTestFileStackTraceLines = (
  filenameRegex = /\.test\.[jt]sx?/i,
): string[] => {
  /* c8 ignore next */
  const stack = Error().stack || '';

  const stackLines = stack.split('\n');
  return stackLines.filter((line) => filenameRegex.test(line));
};

// Attempt to convert any kind of value into a string.
const toString = (val: any): string => {
  // Try a simple null/undefined-safe toString
  const str = `${val}`;

  // That won't work for some kinds of objects, in that situation, JSON.stringify
  if (str === '[object Object]') {
    const stringified = JSON.stringify(val);

    // Some things will return undefined from stringify (such as functions) so we'll fallback
    // to the string representation in those instances. However, functions work properly with
    // the toString method above, so this should never happens.
    /* c8 ignore next */
    return stringified || str;
  }

  return str;
};
