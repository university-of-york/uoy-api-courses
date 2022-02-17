import pino from "pino";

export const logger = pino({
    level: "info",
    formatters: {
        // If we don't override the default formatter for level
        // it will display a numeric value of the level instead
        level(label: string) {
            return { level: label };
        },
    },
    // Serializers parse a certain field returning a JSONifiable object
    //
    // By default Pino will serialize the `err` field for errors but we
    // want to move that functionality to the `error` field instead
    serializers: {
        error: pino.stdSerializers.err,
    },
    // Base controls what fields are included in the JSON
    // object, by default Pino includes fields like pid which
    // are not very relevant in a serverless context
    base: {},
    // Whilst we could use `pino.stdTimeFunctions.isoTime`, it doesn't
    // have a key of `timestamp` which our AWS policy requires
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    // Whenever a string is given alongside an object to the logger it's the message.
    // We're updating it from `msg` to `message` to match our AWS standard
    messageKey: "message",
});
