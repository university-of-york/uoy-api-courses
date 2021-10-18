const path = require("path");
const { spawn } = require("child_process");

describe("logger behaviour", () => {
    it("logs out in JSON", () => {
        invokeDemoLoggerGetResult().then((res) => {
            expect(res).anything();
            expect(() => JSON.parse(res)).not.toThrow();
        });
    });
    it("Logs out the level as a string", () => {
        invokeDemoLoggerGetResult().then((res) => {
            const resJSON = JSON.parse(res);
            expect(() => resJSON.level).toBe("info");
        });
    });
});

const invokeDemoLoggerGetResult = () => {
    const testAppFilePath = path.join(__dirname, "./demoLogger.js");
    const testApp = spawn("node", [testAppFilePath]);

    return new Promise((resolve) => {
        let logResult = null;

        testApp.stdout.on("data", (data) => {
            logResult = data.toString();
            testApp.kill("SIGINT");
        });
        testApp.on("close", () => {
            resolve(logResult);
        });
    });
};
