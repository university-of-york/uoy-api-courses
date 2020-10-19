const { courses } = require("./handler");
const fetch = require("jest-fetch-mock");
const { BASE_URL, COLLECTION, FORM, PROFILE, SMETA_CONTENT_TYPE } = require("./constants/UrlAndParameters");

const constantPartOfSearchUrl = `${BASE_URL}?collection=${COLLECTION}&form=${FORM}&profile=${PROFILE}&smeta_contentType=${SMETA_CONTENT_TYPE}`;

beforeEach(() => {
    fetch.resetMocks();
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

    fetch.mockResponse(JSON.stringify({ results: [] }), { status: 200 });

    const result = await courses(event);

    expect(result.statusCode).toBe(200);
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

    fetch.mockResponse(JSON.stringify(searchResults), { status: 200 });

    const result = await courses(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(expectedResult));
});

test("Request without any parameters returns an appropriate error", async () => {
    const result = await courses({});

    expect(result.statusCode).toBe(400);
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

    fetch.mockResponse(JSON.stringify({ results: [] }), { status: 400 });

    const result = await courses(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toContain('"status":400');
    expect(result.body).toContain('"error":"Bad Request"');
    expect(result.body).toContain('"message":"An error has occurred."');
    expect(result.body).toContain('"timestamp":');
});

test("Response with 500 code returns an error", async () => {
    const event = {
        queryStringParameters: {
            search: "physics",
        },
    };

    fetch.mockResponse(JSON.stringify({ results: [] }), { status: 500 });

    const result = await courses(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toContain('"status":500');
    expect(result.body).toContain('"error":"Internal Server Error"');
    expect(result.body).toContain('"message":"An error has occurred."');
    expect(result.body).toContain('"timestamp":');
});

test("Response with malformed JSON returns an error", async () => {
    const event = {
        queryStringParameters: {
            search: "physics",
        },
    };

    fetch.mockResponse('{"results": [', { status: 200 });

    const result = await courses(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toContain('"status":500');
    expect(result.body).toContain('"error":"Internal Server Error"');
    expect(result.body).toContain('"message":"An error has occurred."');
    expect(result.body).toContain('"timestamp":');
});
