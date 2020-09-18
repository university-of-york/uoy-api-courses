class ClientError extends Error {
    constructor(message) {
        super(message);
    }
}

module.exports = ClientError;
