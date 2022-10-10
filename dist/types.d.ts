export declare type LogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";
export declare type Matcher = string | RegExp;
export declare type ConsoleArgs = any[];
export interface LogTest {
    matcher: Matcher;
    level: LogLevel;
}
export declare type ConsoleMethod = (args: ConsoleArgs) => void;
export declare type ConsoleMethods = {
    debug?: ConsoleMethod;
    log?: ConsoleMethod;
    info?: ConsoleMethod;
    warn?: ConsoleMethod;
    error?: ConsoleMethod;
};
//# sourceMappingURL=types.d.ts.map