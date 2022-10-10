"use strict";
exports.__esModule = true;
exports.toString = exports.getLogLevel = exports.getTestLocation = void 0;
var util_1 = require("util");
// Returns a string with the test name and the lines in the stack trace that are in test files.
var getTestLocation = function (_a) {
    var _b = _a === void 0 ? {} : _a, filenameRegex = _b.filenameRegex, getTestName = _b.getTestName;
    var testLines = getTestFileStackTraceLines(filenameRegex);
    if (getTestName) {
        var location_1 = "In Test [".concat(getTestName(), "]");
        if (testLines.length) {
            location_1 += "\n" + testLines.join("\n");
        }
        return location_1;
    }
    return testLines.join("\n");
};
exports.getTestLocation = getTestLocation;
var getLogLevel = function (tests, consoleArgs) {
    var args = prepareArgs(consoleArgs);
    var matchingTest = tests.find(function (_a) {
        var matcher = _a.matcher;
        return argsMatch(matcher, args);
    });
    if (matchingTest) {
        return matchingTest.level;
    }
    return null;
};
exports.getLogLevel = getLogLevel;
// console.log (and friends) can take format strings and args, such as:
// console.log('Warning: Failed %s type: %s', 'prop', 'The prop ...')
// This method uses the same format method as the console methods and
// attempts to interpret the args as a foramt string and args. If it
// does, the formatted string (what is actually printed out) is passed
// to the level checker.
var prepareArgs = function (args) {
    var formatString = args[0];
    if (typeof formatString === "string") {
        var formatted = util_1.format.apply(void 0, args);
        if (formatted !== formatString) {
            return [formatted];
        }
    }
    return args.map(exports.toString);
};
var argsMatch = function (matcher, args) { return args.some; };
var argMatches = function (matcher, arg) {
    if (typeof matcher === "string") {
        return arg.includes(matcher);
    }
    return matcher.test(arg);
};
// Look at the current stack trace and return any lines that are from a test file, this is to
// help identify which tests log messages are coming from. If a log message is triggered by
// something async, it may not have a a test file in its stack trace.
var getTestFileStackTraceLines = function (filenameRegex) {
    if (filenameRegex === void 0) { filenameRegex = /\.test\.[jt]sx?/i; }
    var stack = Error().stack;
    if (!stack) {
        return [];
    }
    var stackLines = stack.split("\n");
    return stackLines.filter(function (line) { return filenameRegex.test(line); });
};
// Convert any kind of console.log arg to a string that can then be matched against.
var toString = function (val) {
    // Try a simple null/undefined-safe toString
    var str = "".concat(val);
    // That won't work for some kinds of objects, in that situation, JSON.stringify
    if (str === "[object Object]") {
        var stringified = JSON.stringify(val);
        // Some things will return undefined from stringify (such as functions) so we'll fallback
        // to the string representation in those instances. However, functions work properly with
        // the toString method above, so hopefully this never happens.
        return stringified || str;
    }
    return str;
};
exports.toString = toString;
