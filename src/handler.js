("use strict");
const fetch = require("node-fetch");
const { coursesUrl } = require("./utils/constructFunnelbackUrls");
const { logEntry } = require("./utils/logEntry");
const { success, error } = require("./utils/format");
const { transformResponse } = require("./utils/transformResponse");
const { overrideUrls } = require("./utils/overrideUrls");
const { HTTP_CODES } = require("./constants/constants");
const { logger } = require("./utils/logger");
const { NoQueryGivenError, FunnelbackError } = require("./constants/errors");

module.exports.courses = async (event) => {
    try {
        const requestParams = event.queryStringParameters;

        if (!requestParams || !requestParams.search) {
            const errorDetails = {
                funnelBackUrl: null,
                status: HTTP_CODES.BAD_REQUEST,
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
                status: searchResponse.status,
                statusText: searchResponse.statusText,
            };
            throw new FunnelbackError("There is a problem with the Funnelback search.", errorDetails);
        }

        const body = await searchResponse.json();
        const numberOfMatches = body.numberOfMatches;
        let results = transformResponse(body.results);
        results = overrideUrls(results);

        logger.info(logEntry(event, { numberOfMatches, statusCode: searchResponse.status }), "Course search conducted");

        return success({ numberOfMatches, results });
    } catch (err) {
        // When there is an unknown error it is likely there is no error details passed, so
        // we are initialising an empty error details
        if (!err.details)
            err.details = {
                funnelBackUrl: null,
                status: HTTP_CODES.INTERNAL_SERVER_ERROR,
                statusText: "Internal Server Error",
            };

        if (err.type === "NoQueryGivenError") {
            // User error, only an info severity
            logger.info(logEntry(event, null, err), "No query given");
        } else {
            // Server error, error severity
            logger.error(logEntry(event, null, err), "Internal Server Error");
        }

        return error(err.message, err.details.status, err.details.statusText, event.path);
    }
};
