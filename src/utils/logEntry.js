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

    return JSON.stringify({
        timestamp: new Date().toISOString(),
        ip: {
            client: event?.requestContext?.identity?.sourceIp || null,
            source: headers.source || null,
            sourcePort: headers.sourcePort || null,
        },
        req: {
            user: null,
            service: "uoy-api-courses",
        },
        correlationId: event?.requestContext?.apiId || null,
        self: {
            application: "uoy-api-courses",
            type: event?.httpMethod || null,
            statusCode: statuscode,
            version: "v1",
        },
        sensitive: false,
        schemaURI: "https://university-of-york.github.io/uoy-api-courses/",
        type: logType,
        queryStringParameters: event.queryStringParameters,
        additionalDetails,
    });
};
