module.exports.success = (body) => {
    return {
        statusCode: 200,
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
