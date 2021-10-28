const path = require("path");
const { spawn } = require("child_process");

// See also: https://github.com/jest-community/jest-extended/pull/164 for the regex origin
const regexIso8601Timestamp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3])(:[0-5]\d){2}\.\d{3}Z$/;

describe("Logger", () => {
    it("outputs in JSON", async () => {
        const res = await invokeDemoLoggerGetResult();
        expect(res).toEqual(expect.anything());
        expect(() => JSON.parse(res)).not.toThrow();
    });
    it("has IP fields", async () => {
        const res = await invokeDemoLoggerGetResult();
        const resJSON = JSON.parse(res);
        expect(resJSON["ip.client"]).toBeDefined();
        expect(resJSON["ip.source"]).toBeDefined();
        expect(resJSON["ip.sourcePort"]).toBeDefined();
    });
    it("has request fields", async () => {
        const res = await invokeDemoLoggerGetResult();
        const resJSON = JSON.parse(res);
        expect(resJSON["req.user"]).toBeDefined();
        expect(resJSON["req.service"]).toEqual("uoy-app-course-search");
    });
    it("has self fields", async () => {
        const res = await invokeDemoLoggerGetResult();
        const resJSON = JSON.parse(res);
        expect(resJSON["self.application"]).toEqual("uoy-api-courses");
        expect(resJSON["self.type"]).toBeDefined();
        expect(resJSON["self.statusCode"]).toBeDefined();
        expect(resJSON["self.version"]).toEqual("v1");
    });
    it("has miscellaneous fields", async () => {
        const res = await invokeDemoLoggerGetResult();
        const resJSON = JSON.parse(res);
        expect(resJSON.correlationId).toBeDefined();
        expect(resJSON.sensitive).toBeDefined();
        expect(resJSON.schemaURI).toEqual("https://university-of-york.github.io/uoy-api-courses/");
        expect(resJSON.type).toBeDefined();
    });
    it("has output level as a string", async () => {
        const res = await invokeDemoLoggerGetResult();
        const resJSON = JSON.parse(res);
        expect(resJSON.level).toBe("info");
    });
    it("has timestamp is the ISO8601 format", async () => {
        const res = await invokeDemoLoggerGetResult();
        const resJSON = JSON.parse(res);
        expect(regexIso8601Timestamp.test(resJSON.timestamp)).toBe(true);
    });
});

const invokeDemoLoggerGetResult = () => {
    const testAppFilePath = path.join(__dirname, "./demoLogger.js");
    const testApp = spawn("node", [testAppFilePath]);

    return new Promise((resolve) => {
        testApp.stdout.on("data", (data) => {
            testApp.kill("SIGINT");
            resolve(data.toString());
        });
    });
};
