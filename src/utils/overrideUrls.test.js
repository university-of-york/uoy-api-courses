const { overrideUrl } = require("./overrideUrls");

describe("overrideUrls", () => {

    const data = [
        ["https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-adult/"],
        ["https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-child/"],
        ["https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-mental-health/"],
        ["https://www.york.ac.uk/study/undergraduate/courses/mnurs-nursing-adult/"],
        ["https://www.york.ac.uk/study/undergraduate/courses/mnurs-nursing-child/"],
        ["https://www.york.ac.uk/study/undergraduate/courses/mnurs-nursing-mental-health/"],
    ];

    it.each(data)(
        "overrides %s",
        (url) => {
            const expectedUrl = "https://www.york.ac.uk/study/undergraduate/subjects/nursing/";

            expect(overrideUrl(url)).toEqual(expectedUrl);
        }
    )

    it("doesn't override a URL that shouldn't be overridden", () => {
        const liveUrl = "https://www.york.ac.uk/study/undergraduate/courses/bsc-physics/";
        const expectedUrl = "https://www.york.ac.uk/study/undergraduate/courses/bsc-physics/";

        expect(overrideUrl(liveUrl)).toEqual(expectedUrl);
    });
});
