const path = require("path");
const { spawn } = require("child_process");

// See also: https://github.com/jest-community/jest-extended/pull/164 for the regex origin
const regexIso8601Timestamp = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3])(:[0-5]\d){2}\.\d{3}Z$/;

describe("Logger behaviour", () => {
    it("Output in JSON", async () => {
        const res = await invokeDemoLoggerGetResult();
        expect(res).toEqual(expect.anything());
        expect(() => JSON.parse(res)).not.toThrow();
    });
    it("IP fields are present", async () => {
        const res = await invokeDemoLoggerGetResult();
        const resJSON = JSON.parse(res);
        expect(resJSON["ip.client"]).toBeDefined();
        expect(resJSON["ip.source"]).toBeDefined();
        expect(resJSON["ip.sourcePort"]).toBeDefined();
    });
    it("Request fields are present", async () => {
        const res = await invokeDemoLoggerGetResult();
        const resJSON = JSON.parse(res);
        expect(resJSON["req.user"]).toBeDefined();
        expect(resJSON["req.service"]).toEqual("uoy-app-course-search");
    });
    it("Self fields are present", async () => {
        const res = await invokeDemoLoggerGetResult();
        const resJSON = JSON.parse(res);
        expect(resJSON["self.application"]).toEqual("uoy-api-courses");
        expect(resJSON["self.type"]).toBeDefined();
        expect(resJSON["self.statusCode"]).toBeDefined();
        expect(resJSON["self.version"]).toEqual("v1");
    });
    it("Miscellaneous fields are present", async () => {
        const res = await invokeDemoLoggerGetResult();
        const resJSON = JSON.parse(res);
        expect(resJSON.correlationId).toBeDefined();
        expect(resJSON.sensitive).toBeDefined();
        expect(resJSON.schemaURI).toEqual("https://university-of-york.github.io/uoy-api-courses/");
        expect(resJSON.type).toBeDefined();
    });
    it("Output level as a string", async () => {
        const res = await invokeDemoLoggerGetResult();
        const resJSON = JSON.parse(res);
        expect(resJSON.level).toBe("info");
    });
    it("Timestamp is in ISO8601 format", async () => {
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
