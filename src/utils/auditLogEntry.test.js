import MockDate from "mockdate";
const { auditLogEntry } = require("./auditLogEntry");

test("can extract data from event object", () => {
    MockDate.set(new Date());
    const event = JSON.parse(
        "{\n" +
            '        "resource": "/courses",\n' +
            '        "path": "/courses",\n' +
            '        "httpMethod": "GET",\n' +
            '        "headers": {\n' +
            '            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",\n' +
            '            "Accept-Encoding": "gzip, deflate, br",\n' +
            '            "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",\n' +
            '            "CloudFront-Forwarded-Proto": "https",\n' +
            '            "CloudFront-Is-Desktop-Viewer": "true",\n' +
            '            "CloudFront-Is-Mobile-Viewer": "false",\n' +
            '            "CloudFront-Is-SmartTV-Viewer": "false",\n' +
            '            "CloudFront-Is-Tablet-Viewer": "false",\n' +
            '            "CloudFront-Viewer-Country": "GB",\n' +
            '            "Host": "k0fqbcuftg.execute-api.eu-west-1.amazonaws.com",\n' +
            '            "sec-ch-ua-mobile": "?0",\n' +
            '            "sec-fetch-dest": "document",\n' +
            '            "sec-fetch-mode": "navigate",\n' +
            '            "sec-fetch-site": "none",\n' +
            '            "sec-fetch-user": "?1",\n' +
            '            "upgrade-insecure-requests": "1",\n' +
            '            "User-Agent":\n' +
            '                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",\n' +
            '            "Via": "2.0 bf4a364e1dd23fe6634f1bf013457c5c.cloudfront.net (CloudFront)",\n' +
            '            "X-Amz-Cf-Id": "7Px4kURZfIuh4B09Wv6vM5cSpbVXaOv1pW6h0eBMnHPpsJVQ19QtuA==",\n' +
            '            "X-Amzn-Trace-Id": "Root=1-60a6734a-06f7e1dd276e8dc64be2d129",\n' +
            '            "X-Forwarded-For": "144.32.90.155, 130.176.97.157",\n' +
            '            "X-Forwarded-Port": "443",\n' +
            '            "X-Forwarded-Proto": "https"\n' +
            "        },\n" +
            '        "queryStringParameters": {\n' +
            '            "search": "biology"\n' +
            "        },\n" +
            '        "requestContext": {\n' +
            '            "identity": {\n' +
            '                "sourceIp": "144.32.90.155"\n' +
            "            },\n" +
            '            "apiId": "theApiId"\n' +
            "        }\n" +
            "    }"
    );

    expect(auditLogEntry(event, 200)).toEqual(
        JSON.stringify({
            timestamp: new Date().toISOString(),
            ip: {
                client: "144.32.90.155",
                source: "144.32.90.155, 130.176.97.157",
                sourcePort: "443",
            },
            req: {
                user: null,
                service: "uoy-api-courses",
            },
            correlationId: "theApiId",
            self: {
                application: "uoy-api-courses",
                type: "GET",
                statusCode: 200,
                version: "v1",
            },
            sensitive: false,
            schemaURI: "https://github.com/university-of-york/uoy-api-courses/README.md",
            type: "audit",
            queryStringParameters: {
                search: "biology",
            },
        })
    );
});
