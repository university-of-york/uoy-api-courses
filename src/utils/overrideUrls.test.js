const { overrideUrls } = require("./overrideUrls");

describe("overrideUrls", () => {
    it.each`
        inputUrl                                                                   | expectedUrl
        ${"https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-adult/"} | ${"https://www.york.ac.uk/study/undergraduate/subjects/nursing/"}
        ${"https://www.york.ac.uk/study/undergraduate/courses/bsc-physics/"}       | ${"https://www.york.ac.uk/study/undergraduate/courses/bsc-physics/"}
    `("overrides the URL for a course when appropriate (%s)", ({ inputUrl, expectedUrl }) => {
        const courses = [
            {
                liveUrl: inputUrl,
            },
        ];

        const expectedCourses = [
            {
                liveUrl: expectedUrl,
            },
        ];

        expect(overrideUrls(courses)).toEqual(expectedCourses);
    });
});
