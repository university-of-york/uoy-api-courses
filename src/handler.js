("use strict");
const fetch = require("node-fetch");
const { coursesUrl } = require("./utils/constructFunnelbackUrls");
const { logEntry, errorEntry } = require("./utils/logEntry");
const { success, error } = require("./utils/format");
const { transformResponse } = require("./utils/transformResponse");
const { overrideUrls } = require("./utils/overrideUrls");
const { LOG_TYPES, HTTP_CODES } = require("./constants/constants");
const { logger } = require("./utils/logger");
const { NoQueryGivenError, FunnelbackError } = require("./constants/errors");

module.exports.courses = async (event) => {
    try {
        const requestParams = event.queryStringParameters;

        if (!requestParams || !requestParams.search) {
            const errDetails = { 
                status: HTTP_CODES.BAD_REQUEST,
                statusText: "Bad Request",
            };
            const err = new NoQueryGivenError("The search parameter is required.", errDetails)
            logger.info(errorEntry(event, err, null));
            return error(err.message, err.details.status, err.details.statusText, event.path);
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

        const additionalDetails = { numberOfMatches };
        logger.info(logEntry(event, searchResponse.status, LOG_TYPES.AUDIT, additionalDetails));

        return success({ numberOfMatches, results });
    } catch (err) {
        logger.error(errorEntry(event, err, null));
        return error(err.message, err.details.status, err.details.statusText, event.path);
    }
};
