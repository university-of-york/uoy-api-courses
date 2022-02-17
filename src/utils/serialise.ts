import { APIGatewayProxyResult } from "aws-lambda";
import { HTTP_CODES } from "../constants/constants";

export const serialiseSuccess = (body: unknown): Promise<APIGatewayProxyResult> => {
    return Promise.resolve({
        statusCode: HTTP_CODES.OK,
        body: JSON.stringify(body),
    });
};

export const serialiseError = (
    message: string,
    status: number,
    // Because it serialises anything as an error, and the function is used when we're catching unknowns
    error: unknown,
    path: string
): Promise<APIGatewayProxyResult> => {
    return Promise.reject({
        statusCode: status,
        body: JSON.stringify({
            timestamp: new Date().toISOString(),
            status,
            error,
            message,
            path,
        }),
    });
};
