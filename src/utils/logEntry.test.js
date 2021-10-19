import MockDate from "mockdate";

const { logEntry } = require("./logEntry");
const { LOG_TYPES, HTTP_CODES } = require("../constants/constants.js");

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

    expect(logEntry(event, HTTP_CODES.OK, LOG_TYPES.AUDIT, { numberOfMatches: 66 })).toEqual({
        "ip.client": "144.32.90.155",
        "ip.source": "144.32.90.155, 130.176.97.157",
        "ip.sourcePort": "443",
        correlationId: "theApiId",
        "self.type": "GET",
        "self.statusCode": 200,
        type: "audit",
        queryStringParameters: {
            search: "biology",
        },
        additionalDetails: {
            numberOfMatches: 66,
        },
    });
});

test("Nonexistent fields are returned as null instead of skipped", () => {
    const event = {
        queryStringParameters: {
            search: "biology",
        },
    };

    const result = logEntry(event, HTTP_CODES.OK, LOG_TYPES.AUDIT);

    expect(result["ip.client"]).toBeNull();
    expect(result["ip.source"]).toBeNull();
    expect(result["ip.sourcePort"]).toBeNull();
    expect(result.correlationId).toBeNull();
    expect(result["self.type"]).toBeNull();
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

    expect(
        logEntry(event, HTTP_CODES.BAD_REQUEST, LOG_TYPES.ERROR, { message: "The search parameter is required." })
    ).toEqual({
        "ip.client": "144.32.90.155",
        "ip.source": "130.176.97.157",
        "ip.sourcePort": "443",
        correlationId: "theApiId",
        "self.type": "GET",
        "self.statusCode": 400,
        type: "error",
        queryStringParameters: {},
        additionalDetails: {
            message: "The search parameter is required.",
        },
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

    expect(
        logEntry(event, 500, LOG_TYPES.ERROR, {
            message: "Funnelback search problem",
            funnelBackUrl: searchUrl,
            statusText: "Internal Server Error",
        })
    ).toEqual({
        "ip.client": "144.32.90.155",
        "ip.source": "130.176.97.157",
        "ip.sourcePort": "443",
        correlationId: "theApiId",
        "self.type": "GET",
        "self.statusCode": 500,
        type: "error",
        queryStringParameters: {
            search: "maths",
        },
        additionalDetails: {
            message: "Funnelback search problem",
            funnelBackUrl: searchUrl,
            statusText: "Internal Server Error",
        },
    });
});
