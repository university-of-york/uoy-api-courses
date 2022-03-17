import { OVERRIDES } from "../constants/urlOverrides";

const overrideUrl = (url) => {
    const relevantOverride = OVERRIDES.find((override) => override.courseUrl === url);

    return relevantOverride ? relevantOverride.overrideUrl : url;
};

const overrideUrls = (courses) =>
    courses.map((course) => {
        course.liveUrl = overrideUrl(course.liveUrl);
        return course;
    });

export { overrideUrls };
