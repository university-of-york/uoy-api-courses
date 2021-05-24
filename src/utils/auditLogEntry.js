module.exports.auditLogEntry = (event, statuscode) => {
    const getHeaderInfo = () => {
        const source = event.headers["X-Forwarded-For"];
        const sourcePort = event.headers["X-Forwarded-Port"];
        return {
            source,
            sourcePort,
        };
    };

    const headers = getHeaderInfo();

    return JSON.stringify({
        timestamp: new Date().toISOString(),
        ip: {
            client: event?.requestContext?.identity?.sourceIp ? event?.requestContext?.identity?.sourceIp : null,
            source: headers.source ? headers.source : null,
            sourcePort: headers.sourcePort ? headers.sourcePort : null,
        },
        req: {
            user: null,
            service: "uoy-api-courses",
        },
        correlationId: event?.requestContext?.apiId ? event.requestContext.apiId : null,
        self: {
            application: "uoy-api-courses",
            type: event?.httpMethod ? event.httpMethod : null,
            statusCode: statuscode,
            version: "v1",
        },
        sensitive: false,
        schemaURI: "https://github.com/university-of-york/uoy-api-courses/README.md",
        type: "audit",
        queryStringParameters: event.queryStringParameters,
    });
};
