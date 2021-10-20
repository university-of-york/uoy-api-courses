const { HTTP_CODES, LOG_TYPES } = require("../constants/constants");

const logEntry = (event, statuscode, logType, additionalDetails) => {
    const getHeaderInfo = () => {
        const requestHeaders = event?.headers;

        const source = requestHeaders ? requestHeaders["X-Forwarded-For"] : null;
        const sourcePort = requestHeaders ? requestHeaders["X-Forwarded-Port"] : null;
        return {
            source,
            sourcePort,
        };
    };

    const headers = getHeaderInfo();

    return {
        "ip.client": event?.requestContext?.identity?.sourceIp || null,
        "ip.source": headers.source || null,
        "ip.sourcePort": headers.sourcePort || null,
        correlationId: event?.requestContext?.apiId || null,
        "self.type": event?.httpMethod || null,
        "self.statusCode": statuscode,
        type: logType,
        queryStringParameters: event.queryStringParameters,
        additionalDetails,
    };
};

// In order for Pino to serialise errors correctly it either needs to be passed the error
// directly or it needs to be under the key `err`
const errorEntry = (event, additionalDetails, error) => {
    const logMessage = logEntry(event, HTTP_CODES.INTERNAL_SERVER_ERROR, LOG_TYPES.AUDIT, additionalDetails);
    logMessage.err = error;
    return logMessage;
};

module.exports = { logEntry, errorEntry };
