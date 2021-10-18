const pino = require("pino");

module.exports.logger = pino({
    level: "info",
    formatters: {
        // If we don't override the default formatter for level
        // it will display a numeric value of the level instead
        level(label) {
            return { level: label };
        },
    },
    // Base controls what fields are included in the JSON
    // object, by default Pino includes fields like pid which
    // are not very relevant in a serverless context
    base: {
        "ip.client": null,
        "ip.source": null,
        "ip.sourcePort": null,
        "req.user": null,
        "req.service": "uoy-app-course-search",
        correlationId: null,
        "self.application": "uoy-api-courses",
        "self.type": null,
        "self.statusCode": null,
        "self.version": "v1",
        sensitive: false,
        schemaURI: "https://university-of-york.github.io/uoy-api-courses/",
        type: null,
    },
    // Whilst we could use `pino.stdTimeFunctions.isoTime`, it doesn't
    // have a key of `timestamp` which our AWS policy requires
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
});
