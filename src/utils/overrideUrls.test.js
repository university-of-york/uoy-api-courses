const { overrideUrl } = require("./overrideUrls");

describe("overrideUrls", () => {
    it("does an override", () => {

        const liveUrl = "https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-adult/";
        const expectedUrl = "https://www.york.ac.uk/study/undergraduate/subjects/nursing/";

        expect(overrideUrl(liveUrl)).toEqual(expectedUrl);
    });
});
