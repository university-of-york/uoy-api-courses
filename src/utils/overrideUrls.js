const { OVERRIDES } = require("../constants/urlOverrides");

const overrideUrl = (url) => {
    const relevantOverride = OVERRIDES.find((override) => override.courseUrl === url);

    return relevantOverride ? relevantOverride.overrideUrl : url;
};

const overrideUrls = (courses) => {
    return courses.map((course) => {
        course.liveUrl = overrideUrl(course.liveUrl);
        return course;
    });
};

module.exports = { overrideUrls };
