const { logger } = require("./logger");

describe("logger", () => {
    it("No exception is thrown when it can be invoked", () => {
        expect(() => logger.info("test")).not.toThrow();
    });
});
