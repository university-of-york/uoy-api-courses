import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters } from "aws-lambda";

interface log {
    details: details;
    error: unknown;
}

interface details {
    application: string;
    parameters: APIGatewayProxyEventQueryStringParameters | null;
    clientIp: string | null;
    [key: string]: unknown;
}

interface entryDetails {
    [key: string]: unknown;
}

export const logEntry = (event: APIGatewayProxyEvent, details?: entryDetails, error?: unknown): log => {
    return {
        details: {
            application: "uoy-api-courses",
            parameters: event.queryStringParameters,
            clientIp: event?.requestContext?.identity?.sourceIp || null,
            ...details,
        },
        error,
    };
};
