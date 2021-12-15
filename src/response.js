const { HTTP_CODES } = require("./constants/constants.js");

module.exports.success = (body) => {
    return {
        statusCode: HTTP_CODES.OK,
        body: JSON.stringify(body),
    };
};

module.exports.error = (message, status, error, path) => {
    return {
        statusCode: status,
        body: JSON.stringify({
            timestamp: new Date().toISOString(),
            status,
            error,
            message,
            path,
        }),
    };
};
