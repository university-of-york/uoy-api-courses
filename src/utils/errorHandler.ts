import { NoQueryGivenError, FunnelbackError, CustomError } from "../types/errors";
import { APIGatewayProxyEvent } from "aws-lambda";
import { logger } from "./logger";
import { logEntry } from "../utils/logEntry";
import { serialiseError } from "../utils/serialise";
import { HTTP_CODES } from "../constants/constants";

export const isCustomError = (error: unknown): error is CustomError => {
    return error instanceof NoQueryGivenError || error instanceof FunnelbackError;
};

export const isStandardError = (error: unknown): error is Error => {
    return error instanceof Error;
};

export const wrapError = (error: Error): CustomError => {
    // When there is an unknown error it is likely there is no error details passed, so
    // we are initialising an empty error details
    const wrappedError: CustomError = {
        type: error.name,
        details: {
            funnelBackUrl: null,
            statusCode: HTTP_CODES.INTERNAL_SERVER_ERROR,
            statusText: "Internal Server Error",
        },
        ...error,
    };
    return wrappedError;
};

export const customErrorHandler = (error: CustomError, event: APIGatewayProxyEvent) => {
    if (!error.details) {
        error.details = {
            funnelBackUrl: null,
            statusCode: HTTP_CODES.INTERNAL_SERVER_ERROR,
            statusText: "Internal Server Error",
        };
    }
    if (error instanceof NoQueryGivenError) {
        // User error, only an info severity
        logger.info(logEntry(event, undefined, error), "No query given");
    } else {
        // Server error, error severity
        logger.error(logEntry(event, undefined, error), error.message);
    }
    return serialiseError(error.message, error.details.statusCode, error.details.statusText, event.path);
};
