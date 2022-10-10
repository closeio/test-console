import { LogLevel, LogTest, ConsoleMethods } from "./types";
export interface PatchConsoleMethodsOptions {
    filenameRegex?: RegExp;
    getTestName?: () => string;
    threshold?: LogLevel;
}
declare const patchConsoleMethods: (methods: (keyof ConsoleMethods)[], tests: LogTest[], { filenameRegex, getTestName, threshold, }: PatchConsoleMethodsOptions) => void;
export { patchConsoleMethods, LogLevel, LogTest };
//# sourceMappingURL=index.d.ts.map