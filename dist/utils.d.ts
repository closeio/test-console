import { ConsoleArgs, LogTest, LogLevel } from "./types";
export interface GetTestLocationArgs {
    filenameRegex?: RegExp;
    getTestName?: () => string;
}
export declare const getTestLocation: ({ filenameRegex, getTestName, }?: GetTestLocationArgs) => string;
export declare const getLogLevel: (tests: LogTest[], consoleArgs: ConsoleArgs) => LogLevel | null;
export declare const toString: (val: any) => string;
//# sourceMappingURL=utils.d.ts.map