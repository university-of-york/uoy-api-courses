class NoQueryGivenError extends Error {
    constructor(message, details) {
        super(message);
        this.name = "NoQueryGivenError";
        this.details = details;
    }
}

class FunnelbackError extends Error {
    constructor(message, details) {
        super(message);
        this.name = "FunnelbackError";
        this.details = details;
    }
}


module.exports = { NoQueryGivenError, FunnelbackError };
