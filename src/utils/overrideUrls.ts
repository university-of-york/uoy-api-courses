import { APICourse } from "../types/courses";
import { OVERRIDES } from "../constants/urlOverrides";

const overrideUrl = (url: string) => {
    const relevantOverride = OVERRIDES.find((override) => override.courseUrl === url);

    return relevantOverride ? relevantOverride.overrideUrl : url;
};

export const overrideUrls = (courses: APICourse[]): APICourse[] => {
    return courses.map((course) => {
        course.liveUrl = overrideUrl(course.liveUrl);
        return course;
    });
};
