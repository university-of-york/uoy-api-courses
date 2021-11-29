class NoQueryGivenError extends Error {
    constructor(message, details) {
        super(message);
        this.type = "NoQueryGivenError";
        this.details = details;
    }
}

class FunnelbackError extends Error {
    constructor(message, details) {
        super(message);
        this.type = "FunnelbackError";
        this.details = details;
    }
}

module.exports = { NoQueryGivenError, FunnelbackError };
