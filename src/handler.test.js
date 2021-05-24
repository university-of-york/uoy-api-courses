const { courses } = require("./handler");
const fetch = require("jest-fetch-mock");

const constantPartOfSearchUrl = `${process.env.BASE_URL}?collection=${process.env.COLLECTION}&form=${process.env.FORM}&profile=${process.env.PROFILE}&smeta_contentType=${process.env.SMETA_CONTENT_TYPE}`;

beforeEach(() => {
    fetch.resetMocks();
});

test("Simple query calls Funnelback", async () => {
    const event = {
        headers: {},
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
        headers: {},
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
        headers: {},
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
        headers: {},
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
        headers: {},
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
        headers: {},
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

test("Response results from Funnelback with missing metadata are returned OK", async () => {
    const event = {
        headers: {},
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

    fetch.mockResponse(JSON.stringify(searchResults), { status: 200 });

    const result = await courses(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(expectedResult));
});

test("Multiple response results are transformed and returned OK", async () => {
    const event = {
        headers: {},
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
        headers: {},
        queryStringParameters: {
            search: "physics",
        },
    };

    fetch.mockResponse(JSON.stringify({ results: [] }), { status: 400 });

    const result = await courses(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toContain('"status":400');
    expect(result.body).toContain('"error":"Bad Request"');
    expect(result.body).toContain('"message":"There is a problem with the Funnelback search."');
    expect(result.body).toContain('"timestamp":');
});

test("Response with 500 code returns an error", async () => {
    const event = {
        headers: {},
        queryStringParameters: {
            search: "physics",
        },
    };

    fetch.mockResponse(JSON.stringify({ results: [] }), { status: 500 });

    const result = await courses(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toContain('"status":500');
    expect(result.body).toContain('"error":"Internal Server Error"');
    expect(result.body).toContain('"message":"There is a problem with the Funnelback search."');
    expect(result.body).toContain('"timestamp":');
});

test("Response with malformed JSON returns an error", async () => {
    const event = {
        headers: {},
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

test("the numberOfMatches value is returned", async () => {
    const event = {
        headers: {},
        queryStringParameters: {
            search: "physics",
        },
    };
    const searchResults = {
        numberOfMatches: 3,
        results: [],
    };

    fetch.mockResponse(JSON.stringify(searchResults), { status: 200 });
    const result = await courses(event);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body).numberOfMatches).toEqual(3);
});
