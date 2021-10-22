const { courses } = require("./handler");
const { HTTP_CODES } = require("./constants/constants.js");
const fetch = require("jest-fetch-mock");
const { logger } = require("./utils/logger");

jest.mock("./utils/logger");

const constantPartOfSearchUrl = `${process.env.BASE_URL}?collection=${process.env.COLLECTION}&form=${process.env.FORM}&profile=${process.env.PROFILE}&smeta_contentType=${process.env.SMETA_CONTENT_TYPE}`;

beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
});

test("Simple query calls Funnelback", async () => {
    const event = {
        queryStringParameters: {
            search: "maths",
        },
    };

    fetch.mockResponse(JSON.stringify({ results: [] }));

    await courses(event);

    const expectedUrl = constantPartOfSearchUrl + "&query=maths";

    expect(fetch.mock.calls[0][0]).toEqual(expectedUrl);
    expect(fetch.mock.calls[0][1].method).toEqual("GET");
});

test("Request with max parameter correctly calls Funnelback", async () => {
    const event = {
        queryStringParameters: {
            search: "biology",
            max: 5,
        },
    };

    fetch.mockResponse(JSON.stringify({ results: [] }));

    await courses(event);

    const expectedUrl = constantPartOfSearchUrl + "&query=biology&num_ranks=5";

    expect(fetch.mock.calls[0][0]).toEqual(expectedUrl);
    expect(fetch.mock.calls[0][1].method).toEqual("GET");
});

test("Request with offset parameter correctly calls Funnelback", async () => {
    const event = {
        queryStringParameters: {
            search: "chemistry",
            offset: 10,
        },
    };

    fetch.mockResponse(JSON.stringify({ results: [] }));

    await courses(event);

    const expectedUrl = constantPartOfSearchUrl + "&query=chemistry&start_rank=10";

    expect(fetch.mock.calls[0][0]).toEqual(expectedUrl);
    expect(fetch.mock.calls[0][1].method).toEqual("GET");
});

test("Request with max & offset parameters correctly calls Funnelback", async () => {
    const event = {
        queryStringParameters: {
            search: "english",
            max: 10,
            offset: 12,
        },
    };

    fetch.mockResponse(JSON.stringify({ results: [] }));

    await courses(event);

    const expectedUrl = constantPartOfSearchUrl + "&query=english&num_ranks=10&start_rank=12";

    expect(fetch.mock.calls[0][0]).toEqual(expectedUrl);
    expect(fetch.mock.calls[0][1].method).toEqual("GET");
});

test("Response with 200 code is returned correctly", async () => {
    const event = {
        queryStringParameters: {
            search: "physics",
        },
    };

    fetch.mockResponse(JSON.stringify({ results: [] }), { status: HTTP_CODES.OK });

    const result = await courses(event);

    expect(result.statusCode).toBe(HTTP_CODES.OK);
    expect(result.body).toEqual('{"results":[]}');
});

test("Response results are transformed to match openAPI spec", async () => {
    const event = {
        queryStringParameters: {
            search: "physics",
        },
    };
    const searchResults = {
        results: [
            {
                title: "Maths and Computer Science",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/courses/mmath-mathematics-computer-science/",
                award: "MMath (Hons)",
                department: "Department of Computer Science, Department of Mathematics",
                level: "undergraduate",
                length: "4 years full-time",
                typicalOffer: "AAA-AAB",
                yearOfEntry: "2021/22",
                distanceLearning: "No",
                summary:
                    "Study complementary subjects to become fluent in both.|Study complementary subjects to become fluent in both.",
                imageUrl:
                    "https://www.york.ac.uk/media/study/courses/undergraduate/computerscience/mmath-maths-cs-banner.jpg|https://www.york.ac.uk/media/study/courses/undergraduate/computerscience/mmath-maths-cs-banner.jpg",
                ucasCode: "GG14",
            },
        ],
    };

    const expectedResult = {
        results: [
            {
                title: "Maths and Computer Science",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/courses/mmath-mathematics-computer-science/",
                award: "MMath (Hons)",
                department: ["Department of Computer Science", "Department of Mathematics"],
                level: "undergraduate",
                length: "4 years full-time",
                typicalOffer: "AAA-AAB",
                yearOfEntry: "2021/22",
                distanceLearning: false,
                summary:
                    "Study complementary subjects to become fluent in both.|Study complementary subjects to become fluent in both.",
                imageUrl:
                    "https://www.york.ac.uk/media/study/courses/undergraduate/computerscience/mmath-maths-cs-banner.jpg|https://www.york.ac.uk/media/study/courses/undergraduate/computerscience/mmath-maths-cs-banner.jpg",
                ucasCode: "GG14",
            },
        ],
    };

    fetch.mockResponse(JSON.stringify(searchResults), { status: HTTP_CODES.OK });

    const result = await courses(event);

    expect(result.statusCode).toBe(HTTP_CODES.OK);
    expect(result.body).toEqual(JSON.stringify(expectedResult));
});

test("Response results from Funnelback with missing metadata are returned OK", async () => {
    const event = {
        queryStringParameters: {
            search: "physics",
        },
    };
    const searchResults = {
        results: [
            {
                title: "Teaching and Learning",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/courses/teaching-learning/",
                award: null,
                department: null,
                level: null,
                length: null,
                typicalOffer: "N/A",
                yearOfEntry: null,
                distanceLearning: null,
                summary: null,
                imageUrl: "https://www.york.ac.uk|https://www.york.ac.uk",
                ucasCode: null,
            },
        ],
    };

    const expectedResult = {
        results: [
            {
                title: "Teaching and Learning",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/courses/teaching-learning/",
                award: null,
                department: [],
                level: null,
                length: null,
                typicalOffer: "N/A",
                yearOfEntry: null,
                distanceLearning: false,
                summary: null,
                imageUrl: "https://www.york.ac.uk|https://www.york.ac.uk",
                ucasCode: null,
            },
        ],
    };

    fetch.mockResponse(JSON.stringify(searchResults), { status: HTTP_CODES.OK });

    const result = await courses(event);

    expect(result.statusCode).toBe(HTTP_CODES.OK);
    expect(result.body).toEqual(JSON.stringify(expectedResult));
});

test("Multiple response results are transformed and returned OK", async () => {
    const event = {
        queryStringParameters: {
            search: "physics",
        },
    };
    const searchResults = {
        results: [
            {
                title: "Maths and Computer Science",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/courses/mmath-mathematics-computer-science/",
                award: "MMath (Hons)",
                department: "Department of Computer Science, Department of Mathematics",
                level: "undergraduate",
                length: "4 years full-time",
                typicalOffer: "AAA-AAB",
                yearOfEntry: "2021/22",
                distanceLearning: "No",
                summary:
                    "Study complementary subjects to become fluent in both.|Study complementary subjects to become fluent in both.",
                imageUrl:
                    "https://www.york.ac.uk/media/study/courses/undergraduate/computerscience/mmath-maths-cs-banner.jpg|https://www.york.ac.uk/media/study/courses/undergraduate/computerscience/mmath-maths-cs-banner.jpg",
                ucasCode: "GG14",
            },
            {
                title: "Teaching and Learning",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/courses/teaching-learning/",
                award: null,
                department: null,
                level: null,
                length: null,
                typicalOffer: "N/A",
                yearOfEntry: null,
                distanceLearning: null,
                summary: null,
                imageUrl: "https://www.york.ac.uk|https://www.york.ac.uk",
                ucasCode: null,
            },
            {
                title: "Physics",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/courses/mphys-physics/",
                award: "MPhys (Hons)",
                department: "Department of Physics",
                level: "undergraduate",
                length: "4 years full-time",
                typicalOffer: "AAA",
                yearOfEntry: "2021/22",
                distanceLearning: "No",
                summary:
                    "Accelerate towards a career as a professional physicist in industry or academia. |Accelerate towards a career as a professional physicist in industry or academia. ",
                imageUrl:
                    "https://www.york.ac.uk/media/study/courses/undergraduate/physics/hero-physics-mphys-1160.jpg|https://www.york.ac.uk/media/study/courses/undergraduate/physics/hero-physics-mphys-1160.jpg",
                ucasCode: "F303",
            },
        ],
    };

    const expectedResult = {
        results: [
            {
                title: "Maths and Computer Science",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/courses/mmath-mathematics-computer-science/",
                award: "MMath (Hons)",
                department: ["Department of Computer Science", "Department of Mathematics"],
                level: "undergraduate",
                length: "4 years full-time",
                typicalOffer: "AAA-AAB",
                yearOfEntry: "2021/22",
                distanceLearning: false,
                summary:
                    "Study complementary subjects to become fluent in both.|Study complementary subjects to become fluent in both.",
                imageUrl:
                    "https://www.york.ac.uk/media/study/courses/undergraduate/computerscience/mmath-maths-cs-banner.jpg|https://www.york.ac.uk/media/study/courses/undergraduate/computerscience/mmath-maths-cs-banner.jpg",
                ucasCode: "GG14",
            },
            {
                title: "Teaching and Learning",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/courses/teaching-learning/",
                award: null,
                department: [],
                level: null,
                length: null,
                typicalOffer: "N/A",
                yearOfEntry: null,
                distanceLearning: false,
                summary: null,
                imageUrl: "https://www.york.ac.uk|https://www.york.ac.uk",
                ucasCode: null,
            },
            {
                title: "Physics",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/courses/mphys-physics/",
                award: "MPhys (Hons)",
                department: ["Department of Physics"],
                level: "undergraduate",
                length: "4 years full-time",
                typicalOffer: "AAA",
                yearOfEntry: "2021/22",
                distanceLearning: false,
                summary:
                    "Accelerate towards a career as a professional physicist in industry or academia. |Accelerate towards a career as a professional physicist in industry or academia. ",
                imageUrl:
                    "https://www.york.ac.uk/media/study/courses/undergraduate/physics/hero-physics-mphys-1160.jpg|https://www.york.ac.uk/media/study/courses/undergraduate/physics/hero-physics-mphys-1160.jpg",
                ucasCode: "F303",
            },
        ],
    };

    fetch.mockResponse(JSON.stringify(searchResults), { status: HTTP_CODES.OK });

    const result = await courses(event);

    expect(result.statusCode).toBe(HTTP_CODES.OK);
    expect(result.body).toEqual(JSON.stringify(expectedResult));
});

test("Request without any parameters returns an appropriate error", async () => {
    const result = await courses({});

    expect(result.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(result.body).toContain('"status":400');
    expect(result.body).toContain('"error":"Bad Request"');
    expect(result.body).toContain('"message":"The search parameter is required."');
    expect(result.body).toContain('"timestamp":');
});

test("Response with 400 code returns an error", async () => {
    const event = {
        queryStringParameters: {
            search: "physics",
        },
    };

    fetch.mockResponse(JSON.stringify({ results: [] }), { status: HTTP_CODES.BAD_REQUEST, statusText: "Bad Request" });

    const result = await courses(event);

    expect(result.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
    expect(result.body).toContain('"status":400');
    expect(result.body).toContain('"error":"Bad Request"');
    expect(result.body).toContain('"message":"There is a problem with the Funnelback search."');
    expect(result.body).toContain('"timestamp":');
});

test("Response with 500 code returns an error", async () => {
    const event = {
        queryStringParameters: {
            search: "physics",
        },
    };

    fetch.mockResponse(JSON.stringify({ results: [] }), {
        status: HTTP_CODES.INTERNAL_SERVER_ERROR,
        statusText: "Internal Server Error",
    });

    const result = await courses(event);

    expect(result.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
    expect(result.body).toContain('"status":500');
    expect(result.body).toContain('"error":"Internal Server Error"');
    expect(result.body).toContain('"message":"There is a problem with the Funnelback search."');
    expect(result.body).toContain('"timestamp":');
});

test("Response with malformed JSON returns an error", async () => {
    const event = {
        queryStringParameters: {
            search: "physics",
        },
    };

    fetch.mockResponse('{"results": [', { status: HTTP_CODES.OK });

    const result = await courses(event);

    expect(result.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
    expect(result.body).toContain('"status":500');
    expect(result.body).toContain('"error":"Internal Server Error"');
    expect(result.body).toContain('"message":"An error has occurred."');
    expect(result.body).toContain('"timestamp":');
});

test("the numberOfMatches value is returned", async () => {
    const event = {
        queryStringParameters: {
            search: "physics",
        },
    };
    const searchResults = {
        numberOfMatches: 3,
        results: [],
    };

    fetch.mockResponse(JSON.stringify(searchResults), { status: HTTP_CODES.OK });
    const result = await courses(event);
    expect(result.statusCode).toBe(HTTP_CODES.OK);
    expect(JSON.parse(result.body).numberOfMatches).toEqual(3);
});

test.each([
    ["https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-adult/"],
    ["https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-child/"],
    ["https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-mental-health/"],
    ["https://www.york.ac.uk/study/undergraduate/courses/mnurs-nursing-adult/"],
    ["https://www.york.ac.uk/study/undergraduate/courses/mnurs-nursing-child/"],
    ["https://www.york.ac.uk/study/undergraduate/courses/mnurs-nursing-mental-health/"],
])("Nursing results with specified overrides are returned with an altered URL (%s)", async (url) => {
    const event = {
        queryStringParameters: {
            search: "nursing",
        },
    };

    const searchResults = {
        results: [
            {
                liveUrl: url,
            },
        ],
    };

    const expectedResult = {
        results: [
            {
                liveUrl: "https://www.york.ac.uk/study/undergraduate/subjects/nursing/",
                distanceLearning: false,
                department: [],
            },
        ],
    };

    fetch.mockResponse(JSON.stringify(searchResults), { status: 200 });

    const result = await courses(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(expectedResult));
});

describe("Logger output", () => {
    it("logs a single info log given a response with 200 code", async () => {
        const event = {
            queryStringParameters: {
                search: "physics",
            },
        };

        fetch.mockResponse(JSON.stringify({ results: [] }), { status: HTTP_CODES.OK });

        await courses(event);

        expect(logger.error).toBeCalledTimes(0);
        expect(logger.warn).toBeCalledTimes(0);
        expect(logger.info).toBeCalledTimes(1);
        expect(logger.info).toBeCalledWith({
            "ip.client": null,
            "ip.source": null,
            "ip.sourcePort": null,
            correlationId: null,
            "self.type": null,
            "self.statusCode": 200,
            type: "audit",
            queryStringParameters: { search: "physics" },
            additionalDetails: { numberOfMatches: undefined },
        });
    });

    it("logs a single warning if there are no search parameters given", async () => {
        const event = {
            queryStringParameters: {},
        };

        await courses(event);

        expect(logger.error).toBeCalledTimes(0);
        expect(logger.warn).toBeCalledTimes(1);
        expect(logger.info).toBeCalledTimes(0);
        expect(logger.warn).toBeCalledWith({
            "ip.client": null,
            "ip.source": null,
            "ip.sourcePort": null,
            correlationId: null,
            "self.type": null,
            "self.statusCode": 400,
            type: "audit",
            queryStringParameters: {},
            additionalDetails: { message: "The search parameter is required." },
        });
    });

    it("logs a single error when there is a funnelback problem", async () => {
        const event = {
            queryStringParameters: {
                search: "physics",
            },
        };

        fetch.mockResponse(JSON.stringify({ results: [] }), {
            status: HTTP_CODES.BAD_REQUEST,
            statusText: "Bad Request",
        });

        await courses(event);

        expect(logger.error).toBeCalledTimes(1);
        expect(logger.warn).toBeCalledTimes(0);
        expect(logger.info).toBeCalledTimes(0);
        expect(logger.error).toBeCalledWith({
            "ip.client": null,
            "ip.source": null,
            "ip.sourcePort": null,
            correlationId: null,
            "self.type": null,
            "self.statusCode": 400,
            type: "audit",
            queryStringParameters: { search: "physics" },
            additionalDetails: {
                message: "Funnelback search problem",
                funnelBackUrl:
                    "https://www.york.ac.uk/search/?collection=courses&form=course-search&profile=_default_preview&smeta_contentType=course&query=physics",
                statusText: "Bad Request",
            },
        });
    });

    it("return only an error log when catching a malformed JSON", async () => {
        const event = {
            queryStringParameters: {
                search: "physics",
            },
        };

        fetch.mockResponse('{"results": [', { status: HTTP_CODES.OK });

        await courses(event);

        expect(logger.error).toBeCalledTimes(1);
        expect(logger.warn).toBeCalledTimes(0);
        expect(logger.info).toBeCalledTimes(0);
        expect(logger.error).toBeCalledWith({
            "ip.client": null,
            "ip.source": null,
            "ip.sourcePort": null,
            correlationId: null,
            "self.type": null,
            "self.statusCode": 500,
            type: "audit",
            queryStringParameters: { search: "physics" },
            additionalDetails: null,
            err: {
                message: "invalid json response body at  reason: Unexpected end of JSON input",
                type: "invalid-json",
            },
        });
    });
});
