("use strict");
const fetch = require("node-fetch");
const { coursesUrl } = require("./utils/constructFunnelbackUrls");
const { logEntry } = require("./utils/logEntry");
const { success, error } = require("./utils/format");
const { transformResponse } = require("./utils/transformResponse");
const { LOG_TYPES } = require("./constants/constants.js");

module.exports.courses = async (event) => {
    try {
        const requestParams = event.queryStringParameters;

        if (!requestParams || !requestParams.search) {
            const errorDetails = { message: "The search parameter is required." };
            console.error(logEntry(event, 400, LOG_TYPES.ERROR, errorDetails));
            return error(errorDetails.message, 400, "Bad Request", event.path);
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
                message: "Funnelback search problem",
                funnelBackUrl: url,
                statusText: searchResponse.statusText,
            };
            console.error(logEntry(event, searchResponse.status, LOG_TYPES.ERROR, errorDetails));
            return error(
                "There is a problem with the Funnelback search.",
                searchResponse.status,
                searchResponse.statusText,
                event.path
            );
        }

        const body = await searchResponse.json();
        const numberOfMatches = body.numberOfMatches;
        const results = transformResponse(body.results);
        const additionalDetails = { numberOfMatches };
        console.info(logEntry(event, searchResponse.status, LOG_TYPES.AUDIT, additionalDetails));

        return success({ numberOfMatches, results });
    } catch (e) {
        console.error(e);
        return error("An error has occurred.", 500, "Internal Server Error", event.path);
    }
};
