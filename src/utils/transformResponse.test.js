const { transformResponse } = require("./transformResponse");

describe("transformer", () => {
    it("transforms the distanceLearning property of a single result", () => {
        const apiResponse = [
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
        ];

        const transformedResponse = transformResponse(apiResponse);

        expect(transformedResponse[0].distanceLearning).toBe(false);
    });

    it("converts Yes and No to Booleans for distanceLearning", () => {
        const negativeInput = [{ distanceLearning: "No" }];
        const positiveInput = [{ distanceLearning: "Yes" }];

        expect(transformResponse(negativeInput)[0].distanceLearning).toBe(false);
        expect(transformResponse(positiveInput)[0].distanceLearning).toBe(true);
    });

    it("returns false for distanceLearning if the result is not expected", () => {
        const weirdInputs = [
            { distanceLearning: "Maybe, maybe not" },
            { distanceLearning: 53478 },
            { distanceLearning: "I am distanceLearning" },
        ];

        const result = transformResponse(weirdInputs);

        expect(result[0].distanceLearning).toBe(false);
        expect(result[1].distanceLearning).toBe(false);
        expect(result[2].distanceLearning).toBe(false);
    });

    it("splits multiple departments into an array", () => {
        const multiDepartmentResponse = [{ department: "Department of Computer Science, Department of Mathematics" }];

        expect(transformResponse(multiDepartmentResponse)[0].department).toStrictEqual([
            "Department of Computer Science",
            "Department of Mathematics",
        ]);
    });

    it("converts a single department into an array", () => {
        const singleDepartmentResponse = [{ department: "Department of Computer Science" }];

        expect(transformResponse(singleDepartmentResponse)[0].department).toStrictEqual([
            "Department of Computer Science",
        ]);
    });
});
