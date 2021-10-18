const { logger } = require("./logger");

describe("logger", () => {
    it("Is a Pino class", () => {
        expect(logger.constructor.name).toEqual("Pino");
    });
    it("No exception is thrown when it can be invoked", () => {
        expect(() => logger.info("test")).not.toThrow();
    });
});
