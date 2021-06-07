const { overrideUrls } = require("./overrideUrls");

describe("overrideUrls", () => {
    const data = [
        ["https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-adult/"],
        ["https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-child/"],
        ["https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-mental-health/"],
        ["https://www.york.ac.uk/study/undergraduate/courses/mnurs-nursing-adult/"],
        ["https://www.york.ac.uk/study/undergraduate/courses/mnurs-nursing-child/"],
        ["https://www.york.ac.uk/study/undergraduate/courses/mnurs-nursing-mental-health/"],
    ];

    it.each(data)("overrides the URL for a course when URL is %s", (url) => {
        const courses = [
            {
                title: "Nursing (Adult)",
                liveUrl: url,
                award: "BSc (Hons)",
                department: "Department of Nursing",
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
        ];

        const expectedCourses = [
            {
                title: "Nursing (Adult)",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/subjects/nursing/",
                award: "BSc (Hons)",
                department: "Department of Nursing",
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
        ];

        expect(overrideUrls(courses)).toEqual(expectedCourses);
    });

    it("doesn't override the URL for a course when URL shouldn't be overridden", () => {
        const courses = [
            {
                title: "Nursing (Adult)",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/courses/bsc-physics/",
                award: "BSc (Hons)",
                department: "Department of Nursing",
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
        ];

        const expectedCourses = [
            {
                title: "Nursing (Adult)",
                liveUrl: "https://www.york.ac.uk/study/undergraduate/courses/bsc-physics/",
                award: "BSc (Hons)",
                department: "Department of Nursing",
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
        ];

        expect(overrideUrls(courses)).toEqual(expectedCourses);
    });
});
