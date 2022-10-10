"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.patchConsoleMethods = void 0;
var utils_1 = require("./utils");
var consts_1 = require("./consts");
var originalConsoleMethods = {};
var patchConsoleMethods = function (methods, tests, _a) {
    var filenameRegex = _a.filenameRegex, getTestName = _a.getTestName, _b = _a.threshold, threshold = _b === void 0 ? "ERROR" : _b;
    var thresholdValue = consts_1.levels[threshold];
    methods.forEach(function (consoleMethod) {
        var originalMethod = global.console[consoleMethod];
        originalConsoleMethods[consoleMethod] = originalMethod;
        global.console[consoleMethod] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            try {
                var logLevel = (0, utils_1.getLogLevel)(tests, args);
                if (logLevel === null || consts_1.levels[logLevel] >= thresholdValue) {
                    originalMethod.apply(void 0, __spreadArray(__spreadArray([], args, false), [(0, utils_1.getTestLocation)({ filenameRegex: filenameRegex, getTestName: getTestName })], false));
                }
            }
            catch (ex) {
                originalMethod.apply(void 0, __spreadArray(__spreadArray([], args, false), [(0, utils_1.getTestLocation)({ filenameRegex: filenameRegex, getTestName: getTestName })], false));
            }
        };
    });
};
exports.patchConsoleMethods = patchConsoleMethods;
