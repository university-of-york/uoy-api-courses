module.exports.logEntry = (event, statuscode) => {
    return {
        body: JSON.stringify({
            timestamp: new Date().toISOString(),
            req: {
                user: null,
                service: "uoy-api-courses",
            },
            correlationId: event.apiId,
            self: {
                application: "uoy-api-courses",
                type: event.httpMethod,
            },
            statusCode: statuscode,
            resourceId: null,
            version: "v1",
            sensitive: false,
            schemaURI: "https://github.com/university-of-york/uoy-api-courses/README.md",
            type: "app",
        }),
    };
};
