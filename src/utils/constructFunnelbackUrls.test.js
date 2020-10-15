const { coursesUrl } = require("./constructFunnelbackUrls");
const ClientError = require("../errors/ClientError");
const { COLLECTION, FORM, PROFILE } = require("../constants/UrlParameters");

const constantPartOfSearchUrl = `collection=${COLLECTION}&form=${FORM}&profile=${PROFILE}`;

test("Call without parameters throws ClientError", async () => {
    expect(() => {
        coursesUrl();
    }).toThrow(ClientError);

    expect(() => {
        coursesUrl();
    }).toThrow("The search parameter is required.");
});

test("Call without search parameter throws ClientError", async () => {
    const parameters = {
        max: 5,
    };

    expect(() => {
        coursesUrl(parameters);
    }).toThrow(ClientError);

    expect(() => {
        coursesUrl(parameters);
    }).toThrow("The search parameter is required.");
});

test("Call with search parameter returns correct URL", async () => {
    const parameters = {
        search: "Maths",
    };

    const expectedUrl = "https://www.york.ac.uk/search/?" + constantPartOfSearchUrl + "&query=Maths";

    expect(coursesUrl(parameters)).toEqual(expectedUrl);
});

test("Call with search & max parameters returns correct URL", async () => {
    const parameters = {
        search: "Maths",
        max: 12,
    };

    const expectedUrl = "https://www.york.ac.uk/search/?" + constantPartOfSearchUrl + "&query=Maths&num_ranks=12";

    expect(coursesUrl(parameters)).toEqual(expectedUrl);
});

test("Call with search & offset parameters returns correct URL", async () => {
    const parameters = {
        search: "Maths",
        offset: 25,
    };

    const expectedUrl = "https://www.york.ac.uk/search/?" + constantPartOfSearchUrl + "&query=Maths&start_rank=25";

    expect(coursesUrl(parameters)).toEqual(expectedUrl);
});

test("Call with search, max & offset parameters returns correct URL", async () => {
    const parameters = {
        search: "Maths",
        max: 18,
        offset: 15,
    };

    const expectedUrl =
        "https://www.york.ac.uk/search/?" + constantPartOfSearchUrl + "&query=Maths&num_ranks=18&start_rank=15";

    expect(coursesUrl(parameters)).toEqual(expectedUrl);
});
