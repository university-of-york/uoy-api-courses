import MockDate from "mockdate";
import { FunnelbackError, NoQueryGivenError } from "../constants/errors";

const { logEntry } = require("./logEntry");
const { HTTP_CODES } = require("../constants/constants.js");

test("Required data added to log when supplied in event object", () => {
    MockDate.set(new Date());
    const event = {
        resource: "/courses",
        path: "/courses",
        httpMethod: "GET",
        headers: {
            Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
            "CloudFront-Forwarded-Proto": "https",
            "CloudFront-Is-Desktop-Viewer": "true",
            "CloudFront-Is-Mobile-Viewer": "false",
            "CloudFront-Is-SmartTV-Viewer": "false",
            "CloudFront-Is-Tablet-Viewer": "false",
            "CloudFront-Viewer-Country": "GB",
            Host: "k0fqbcuftg.execute-api.eu-west-1.amazonaws.com",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
            Via: "2.0 bf4a364e1dd23fe6634f1bf013457c5c.cloudfront.net (CloudFront)",
            "X-Amz-Cf-Id": "7Px4kURZfIuh4B09Wv6vM5cSpbVXaOv1pW6h0eBMnHPpsJVQ19QtuA==",
            "X-Amzn-Trace-Id": "Root=1-60a6734a-06f7e1dd276e8dc64be2d129",
            "X-Forwarded-For": "144.32.90.155, 130.176.97.157",
            "X-Forwarded-Port": "443",
            "X-Forwarded-Proto": "https",
        },
        queryStringParameters: {
            search: "biology",
        },
        requestContext: {
            identity: {
                sourceIp: "144.32.90.155",
            },
            apiId: "theApiId",
        },
    };

    expect(logEntry(event, { numberOfMatches: 66 })).toEqual({
        details: {
            parameters: {
                search: "biology",
            },
            numberOfMatches: 66,
            clientIp: "144.32.90.155",
            application: "uoy-api-courses",
        },
    });
});

test("Client IP is returned as null instead of skipped when undefined", () => {
    const event = {
        queryStringParameters: {
            search: "biology",
        },
    };

    const result = logEntry(event, null);

    expect(result.details.clientIp).toBeNull();
});

test("No search results error log is correct", () => {
    const event = {
        resource: "/courses",
        path: "/courses",
        httpMethod: "GET",
        headers: {
            "X-Forwarded-For": "130.176.97.157",
            "X-Forwarded-Port": "443",
        },
        queryStringParameters: {},
        requestContext: {
            identity: {
                sourceIp: "144.32.90.155",
            },
            apiId: "theApiId",
        },
    };

    const errDetails = {
        funnelBackUrl: null,
        status: HTTP_CODES.BAD_REQUEST,
        statusText: "Bad Request",
    };

    const log = logEntry(event, null, new NoQueryGivenError("The search parameter is required.", errDetails));

    expect(log).toEqual({
        details: {
            clientIp: "144.32.90.155",
            parameters: {},
            application: "uoy-api-courses",
            statusCode: 400,
            statusText: "Bad Request",
        },
        error: new NoQueryGivenError("The search parameter is required."),
    });
    expect(log.error.details).toEqual({
        funnelBackUrl: null,
        status: 400,
        statusText: "Bad Request",
    });
});

test("Funnelback error log is correct", () => {
    const event = {
        resource: "/courses",
        path: "/courses",
        httpMethod: "GET",
        headers: {
            "X-Forwarded-For": "130.176.97.157",
            "X-Forwarded-Port": "443",
        },
        queryStringParameters: {
            search: "maths",
        },
        requestContext: {
            identity: {
                sourceIp: "144.32.90.155",
            },
            apiId: "theApiId",
        },
    };

    const searchUrl =
        `${process.env.BASE_URL}?collection=${process.env.COLLECTION}&form=${process.env.FORM}&profile=${process.env.PROFILE}&smeta_contentType=${process.env.SMETA_CONTENT_TYPE}` +
        "&query=maths";

    const errorDetails = {
        funnelBackUrl: searchUrl,
        status: 500,
        statusText: "Internal Server Error",
    };

    const log = logEntry(
        event,
        null,
        new FunnelbackError("There is a problem with the Funnelback search.", errorDetails)
    );

    expect(log).toEqual({
        details: {
            clientIp: "144.32.90.155",
            parameters: {
                search: "maths",
            },
            application: "uoy-api-courses",
            statusCode: 500,
            statusText: "Internal Server Error",
        },
        error: new FunnelbackError("There is a problem with the Funnelback search."),
    });
    expect(log.error.details).toEqual({
        funnelBackUrl: searchUrl,
        status: 500,
        statusText: "Internal Server Error",
    });
});

test("Generic error log is correct", () => {
    const event = {
        queryStringParameters: {
            search: "biology",
        },
        requestContext: {
            identity: {
                sourceIp: "144.32.100.16",
            },
            apiId: "theApiId",
        },
    };

    const error = new Error("test error");

    const result = logEntry(event, null, error);

    expect(result.error).toBe(error);
});

test("the error.details status and statusText is copied to the log details", () => {
    const event = {
        queryStringParameters: {
            search: "biology",
        },
        requestContext: {
            identity: {
                sourceIp: "144.32.100.16",
            },
            apiId: "theApiId",
        },
    };

    const error = new Error("test error");
    error.details = {
        status: 418,
        statusText: "I'm a teapot",
    };

    const result = logEntry(event, null, error);

    expect(result.error).toEqual(new Error("test error"));

    expect(result.error.details).toEqual({
        status: 418,
        statusText: "I'm a teapot",
    });
});

test("when no parameters are set in details, it will try to get them from the event", () => {
    const event = {
        queryStringParameters: {
            search: "electronic engineering",
        },
        requestContext: {
            identity: {
                sourceIp: "144.32.100.16",
            },
            apiId: "theApiId",
        },
    };

    const result = logEntry(event, null);

    expect(result.details.parameters).toEqual({
        search: "electronic engineering",
    });
});

test("don't use parameters from the event object when they have been passed in through the details object", () => {
    const event = {
        queryStringParameters: {},
        requestContext: {
            identity: {
                sourceIp: "144.32.100.16",
            },
            apiId: "theApiId",
        },
    };

    const result = logEntry(event, { parameters: { foo: "bar" } });

    expect(result.details.parameters).toEqual({
        foo: "bar",
    });
});

class DemoError extends Error {
    constructor(message) {
        super(message);
        this.name = "DemoError";
    }
}

test.each([
    [new Error("Test Generic Error"), "Error"],
    [new SyntaxError("Test Syntax Error"), "SyntaxError"],
    [new DemoError("Test Demo Error"), "DemoError"],
])("when the error type is not present, use the error name", (error, expectedType) => {
    const event = {
        queryStringParameters: {
            search: "physics",
        },
    };

    const result = logEntry(event, null, error);

    expect(result.error.type).toEqual(expectedType);
});
