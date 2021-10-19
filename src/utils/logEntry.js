module.exports.logEntry = (event, statuscode, logType, additionalDetails) => {
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
