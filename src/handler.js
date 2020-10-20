"use strict";
const fetch = require("node-fetch");
const { coursesUrl } = require("./utils/constructFunnelbackUrls");
const { success, error } = require("./utils/format");
const { transformResponse } = require("./utils/transformResponse");

module.exports.courses = async (event) => {
    try {
        if (!event.queryStringParameters || !event.queryStringParameters.search) {
            return error("The search parameter is required.", 400, "Bad Request", event.path);
        }

        const url = coursesUrl(event.queryStringParameters);

        const searchResponse = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!searchResponse.ok) {
            console.error("Funnelback search problem");
            console.error(url);
            console.error(searchResponse.statusText);
            return error(
                "There is a problem with the Funnelback search.",
                searchResponse.status,
                searchResponse.statusText,
                event.path
            );
        }

        const body = await searchResponse.json();
        const results = transformResponse(body.results);

        return success({ results });
    } catch (e) {
        console.error(e);
        switch (e.constructor.name) {
            default:
                return error("An error has occurred.", 500, "Internal Server Error", event.path);
        }
    }
};
