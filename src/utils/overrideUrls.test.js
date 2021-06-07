const { overrideUrl } = require("./overrideUrls");

describe("overrideUrls", () => {
    it("overrides a URL that should be overridden", () => {
        const liveUrl = "https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-adult/";
        const expectedUrl = "https://www.york.ac.uk/study/undergraduate/subjects/nursing/";

        expect(overrideUrl(liveUrl)).toEqual(expectedUrl);
    });

    it("doesn't override a URL that shouldn't be overridden", () => {
        const liveUrl = "https://www.york.ac.uk/study/undergraduate/courses/bsc-physics/";
        const expectedUrl = "https://www.york.ac.uk/study/undergraduate/courses/bsc-physics/";

        expect(overrideUrl(liveUrl)).toEqual(expectedUrl);
    });
});
