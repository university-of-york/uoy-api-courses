import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import fetch from "node-fetch";
import { coursesUrl } from "./utils/constructFunnelbackUrls";
import { logEntry } from "./utils/logEntry";
import { serialiseSuccess, serialiseError } from "./utils/serialise";
import { transformResponse } from "./utils/transformResponse";
import { overrideUrls } from "./utils/overrideUrls";
import { HTTP_CODES } from "./constants/constants";
import { logger } from "./utils/logger";
import { NoQueryGivenError, FunnelbackError } from "./types/errors";
import { FunnelbackResponse } from "./types/courses";
import { customErrorHandler, isCustomError, isStandardError, wrapError } from "./utils/errorHandler";

export const courses = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const requestParams = event.queryStringParameters;

        if (!requestParams || !requestParams.search) {
            const errorDetails = {
                funnelBackUrl: null,
                statusCode: HTTP_CODES.BAD_REQUEST,
                statusText: "Bad Request",
            };
            throw new NoQueryGivenError("The search parameter is required.", errorDetails);
        }

        const url = coursesUrl(requestParams);

        const searchResponse = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!searchResponse.ok) {
            const errorDetails = {
                funnelBackUrl: url,
                statusCode: searchResponse.status,
                statusText: searchResponse.statusText,
            };
            throw new FunnelbackError("There is a problem with the Funnelback search.", errorDetails);
        }

        const { results, numberOfMatches } = (await searchResponse.json()) as FunnelbackResponse;
        const response = overrideUrls(transformResponse(results));

        logger.info(logEntry(event, { numberOfMatches, statusCode: searchResponse.status }), "Course search conducted");
        return serialiseSuccess({ numberOfMatches, response });
    } catch (error: unknown) {
        if (isCustomError(error)) {
            return customErrorHandler(error, event);
        }
        if (isStandardError(error)) {
            return customErrorHandler(wrapError(error), event);
        }
        // We have been thrown something that is not an error
        logger.error(logEntry(event, undefined, error), "Unknown object thrown");
        return serialiseError("Unknown object thrown", 500, error, event.path);
    }
};
