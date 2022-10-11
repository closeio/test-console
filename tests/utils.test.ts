import { getTestLocation, getLogLevel } from "../src/utils";
import { LogTest } from "../src/types";

describe("utils", () => {
  describe("getTestLocation", () => {
    describe("with test name", () => {
      it("gives the right output", () => {
        const testLocation = getTestLocation({
          filenameRegex: /\.test\.[tj]sx?/i,
          getTestName: () => expect.getState().currentTestName,
        });

        expect(testLocation).toMatch(
          /^In Test \[utils getTestLocation with test name gives the right output\]/
        );
        expect(testLocation).toMatch(/at.*tests\/utils.test.ts:\d+:\d+\)$/);
      });
    });

    describe("without test name", () => {
      it("gives the right output", () => {
        const testLocation = getTestLocation({
          filenameRegex: /\.test\.[tj]sx?/i,
        });

        expect(testLocation).not.toMatch(/^In Test \[/);
        expect(testLocation).toMatch(/at.*tests\/utils.test.ts:\d+:\d+\)$/);
      });
    });

    describe("with no matching test ", () => {
      it("gives the right output", () => {
        const testLocation = getTestLocation({
          filenameRegex: /\.spec\.[tj]sx?/i,
          getTestName: () => expect.getState().currentTestName,
        });

        expect(testLocation).toMatch(/^In Test \[/);
        expect(testLocation).not.toMatch(/at.*tests\/utils.test.ts:\d+:\d+\)$/);
      });
    });

    describe("with no test name or matching test ", () => {
      it("gives the right output", () => {
        const testLocation = getTestLocation({
          filenameRegex: /\.spec\.[tj]sx?/i,
        });

        expect(testLocation).toBe("");
      });
    });
  });

  describe("getLogLevel", () => {
    const tests: LogTest[] = [
      { matcher: "is info", level: "INFO" },
      { matcher: /is warn/i, level: "WARNING" },
    ];

    it("matches string", () => {
      expect(getLogLevel(tests, ["is info"])).toBe("INFO");
    });

    it("matches format string", () => {
      expect(getLogLevel(tests, ["is %s", "info"])).toBe("INFO");
    });

    it("matches regexp", () => {
      expect(getLogLevel(tests, ["is warning"])).toBe("WARNING");
    });

    it("matches format regexp", () => {
      expect(getLogLevel(tests, ["is %s", "warning"])).toBe("WARNING");
    });

    it("returns null when there is no match", () => {
      expect(getLogLevel(tests, ["is a critical thing"])).toBe(null);
    });

    it("matches aganist objects", () => {
      expect(getLogLevel(tests, [{ status: "is warning" }])).toBe("WARNING");
    });
  });
});
