const { coursesUrl } = require("./constructFunnelbackUrls");

const constantPartOfSearchUrl = `${process.env.BASE_URL}?collection=${process.env.COLLECTION}&form=${process.env.FORM}&profile=${process.env.PROFILE}&smeta_contentType=${process.env.SMETA_CONTENT_TYPE}`;

test("constructs the Funnelback url with the expected environment variables", () => {
    expect(coursesUrl({})).toEqual(
        "https://www.york.ac.uk/search/?collection=york-uni-courses&form=course-search&profile=_default_preview&smeta_contentType=course"
    );
});

test("No search parameters gives a blank search", () => {
    expect(coursesUrl({})).toEqual(constantPartOfSearchUrl);
});

test("Call with search parameter returns correct URL", () => {
    const parameters = {
        search: "Maths",
    };

    const expectedUrl = constantPartOfSearchUrl + "&query=Maths";

    expect(coursesUrl(parameters)).toEqual(expectedUrl);
});

test("Call with search & max parameters returns correct URL", () => {
    const parameters = {
        search: "Maths",
        max: 12,
    };

    const expectedUrl = constantPartOfSearchUrl + "&query=Maths&num_ranks=12";

    expect(coursesUrl(parameters)).toEqual(expectedUrl);
});

test("Call with search & offset parameters returns correct URL", () => {
    const parameters = {
        search: "Maths",
        offset: 25,
    };

    const expectedUrl = constantPartOfSearchUrl + "&query=Maths&start_rank=25";

    expect(coursesUrl(parameters)).toEqual(expectedUrl);
});

test("Call with search, max & offset parameters returns correct URL", () => {
    const parameters = {
        search: "Maths",
        max: 18,
        offset: 15,
    };

    const expectedUrl = constantPartOfSearchUrl + "&query=Maths&num_ranks=18&start_rank=15";

    expect(coursesUrl(parameters)).toEqual(expectedUrl);
});
