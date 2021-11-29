const logEntry = (event, details, error) => {
    const entry = {
        details,
    };

    if (!entry.details) entry.details = {};

    if (error) {
        entry.error = error;
        if (error.details && error.details.statusCode) {
            entry.details.statusCode = error.details.status;
            entry.details.statusText = error.details.statusText;
        }
    }

    if (!entry.details.parameters) entry.details.parameters = event.queryStringParameters;
    if (!entry.details.application) entry.details.application = "uoy-api-courses";

    entry.details.clientIp = event?.requestContext?.identity?.sourceIp || null;

    return entry;
};

module.exports = { logEntry };
