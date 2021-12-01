const logEntry = (event, details, error) => {
    const entry = {
        details,
    };

    if (!entry.details) entry.details = {};

    entry.details.application = "uoy-api-courses";

    if (!entry.details.parameters) entry.details.parameters = event.queryStringParameters;
    entry.details.clientIp = event?.requestContext?.identity?.sourceIp || null;

    if (error) {
        entry.error = error;
        if (error.details && error.details.status) {
            entry.details.statusCode = error.details.status;
            entry.details.statusText = error.details.statusText;
        }
        if (!entry.error.type) entry.error.type = entry.error.name;
    }

    return entry;
};

module.exports = { logEntry };
