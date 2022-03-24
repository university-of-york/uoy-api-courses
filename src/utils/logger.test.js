import { logger } from "./logger.js";

describe("logger", () => {
    it("No exception is thrown when it can be invoked", () => {
        expect(() => logger.info("test")).not.toThrow();
    });
});
