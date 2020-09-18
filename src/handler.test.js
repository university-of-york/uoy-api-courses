const {courses} = require('./handler');
const fetch = require('jest-fetch-mock');

beforeEach(() => {
    fetch.resetMocks();
})

test('Simple query calls Funnelback', async () => {
    const event = {
        queryStringParameters: {
            search: 'maths'
        }
    };

    fetch.mockResponse(JSON.stringify({results: []}));

    await courses(event);

    const expectedUrl = "https://www.york.ac.uk/search/?collection=york-uni-courses&form=course-search&profile=_default&query=maths"

    expect(fetch.mock.calls[0][0]).toEqual(expectedUrl);
    expect(fetch.mock.calls[0][1].method).toEqual("GET");
});

test('Request with max parameter correctly calls Funnelback', async () => {
    const event = {
        queryStringParameters: {
            search: 'biology',
            max: 5
        }
    };

    fetch.mockResponse(JSON.stringify({results: []}));

    await courses(event);

    const expectedUrl = "https://www.york.ac.uk/search/?collection=york-uni-courses&form=course-search&profile=_default&query=biology&num_ranks=5"

    expect(fetch.mock.calls[0][0]).toEqual(expectedUrl);
    expect(fetch.mock.calls[0][1].method).toEqual("GET");
});

test('Request with offset parameter correctly calls Funnelback', async () => {
    const event = {
        queryStringParameters: {
            search: 'chemistry',
            offset: 10
        }
    };

    fetch.mockResponse(JSON.stringify({results: []}));

    await courses(event);

    const expectedUrl = "https://www.york.ac.uk/search/?collection=york-uni-courses&form=course-search&profile=_default&query=chemistry&start_rank=10"

    expect(fetch.mock.calls[0][0]).toEqual(expectedUrl);
    expect(fetch.mock.calls[0][1].method).toEqual("GET");
});

test('Request with max & offset parameters correctly calls Funnelback', async () => {
    const event = {
        queryStringParameters: {
            search: 'english',
            max: 10,
            offset: 12
        }
    };

    fetch.mockResponse(JSON.stringify({results: []}));

    await courses(event);

    const expectedUrl = "https://www.york.ac.uk/search/?collection=york-uni-courses&form=course-search&profile=_default&query=english&num_ranks=10&start_rank=12"

    expect(fetch.mock.calls[0][0]).toEqual(expectedUrl);
    expect(fetch.mock.calls[0][1].method).toEqual("GET");
});

test('Response with 200 code is returned correctly', async () => {
    const event = {
        queryStringParameters: {
            search: 'physics',
        }
    };

    fetch.mockResponse(JSON.stringify({results: []}), {status: 200});

    const result = await courses(event);

    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual('{"results":[]}');
});

test('Request without any parameters returns an appropriate error', async () => {
    const result = await courses({});

    expect(result.statusCode).toBe(400);
    expect(result.body).toContain('\"status\":400');
    expect(result.body).toContain('\"error\":\"Bad Request\"');
    expect(result.body).toContain('\"message\":\"The search parameter is required.\"');
    expect(result.body).toContain('\"timestamp\":');
});

test('Response with 400 code returns an error', async () => {
    const event = {
        queryStringParameters: {
            search: 'physics',
        }
    };

    fetch.mockResponse(JSON.stringify({results: []}), {status: 400});

    const result = await courses(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toContain('\"status\":400');
    expect(result.body).toContain('\"error\":\"Bad Request\"');
    expect(result.body).toContain('\"message\":\"An error has occurred.\"');
    expect(result.body).toContain('\"timestamp\":');
});

test('Response with 500 code returns an error', async () => {
    const event = {
        queryStringParameters: {
            search: 'physics',
        }
    };

    fetch.mockResponse(JSON.stringify({results: []}), {status: 500});

    const result = await courses(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toContain('\"status\":500');
    expect(result.body).toContain('\"error\":\"Internal Server Error\"');
    expect(result.body).toContain('\"message\":\"An error has occurred.\"');
    expect(result.body).toContain('\"timestamp\":');
});

test('Response with malformed JSON returns an error', async () => {
    const event = {
        queryStringParameters: {
            search: 'physics',
        }
    };

    fetch.mockResponse('{"results": [', {status: 200});

    const result = await courses(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toContain('\"status\":500');
    expect(result.body).toContain('\"error\":\"Internal Server Error\"');
    expect(result.body).toContain('\"message\":\"An error has occurred.\"');
    expect(result.body).toContain('\"timestamp\":');
});
