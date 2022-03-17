import path from "path";
import { spawn } from "child_process";

// See also: https://github.com/jest-community/jest-extended/pull/164 for the regex origin
const regexIso8601Timestamp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3])(:[0-5]\d){2}\.\d{3}Z$/;

describe("Logger", () => {
    it("outputs in JSON", async () => {
        const result = await invokeDemoLoggerGetResult();

        expect(result).toEqual(expect.anything());
        expect(() => JSON.parse(result)).not.toThrow();
    });
    it("has output level as a string", async () => {
        const result = await invokeDemoLoggerGetResult();

        const resJSON = JSON.parse(result);
        expect(resJSON.level).toBe("info");
    });
    it("has timestamp is the ISO8601 format", async () => {
        const result = await invokeDemoLoggerGetResult();

        const resJSON = JSON.parse(result);
        expect(regexIso8601Timestamp.test(resJSON.timestamp)).toBe(true);
    });
});

const invokeDemoLoggerGetResult = async () => {
    // eslint-disable-next-line unicorn/prefer-module
    const testAppFilePath = path.join(__dirname, "./demoLogger.js");
    const testApp = spawn("node", [testAppFilePath]);

    let result;

    const promise = new Promise((resolve) => {
        testApp.stdout.on("data", (data) => {
            testApp.kill("SIGINT");
            result = data.toString();
            resolve();
        });
    });

    await promise;

    return result;
};
