const {courses} = require('./handler');
const fetch = require('jest-fetch-mock');

beforeEach(() => {
    fetch.resetMocks();
})

test('Simple query calls Funnelback', async () => {
    const event = {
        queryStringParameters: {
            query: 'maths'
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
            query: 'biology',
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
            query: 'chemistry',
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
            query: 'english',
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
