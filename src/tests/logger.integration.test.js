const path = require("path");
const { spawn } = require("child_process");

describe("Logger behaviour", () => {
    it("Output in JSON", async () => {
        const res = await invokeDemoLoggerGetResult();
        expect(res).toEqual(expect.anything());
        expect(() => JSON.parse(res)).not.toThrow();
    });
    it("Output level as a string", async () => {
        const res = await invokeDemoLoggerGetResult();
        const resJSON = JSON.parse(res);
        expect(resJSON.level).toBe("info");
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
