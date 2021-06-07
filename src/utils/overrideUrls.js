const { URLS_TO_OVERRIDE, OVERRIDE_URL } = require("../constants/nursingOverrides");

const overrideUrl = (url) => {
    if (URLS_TO_OVERRIDE.includes(url)) {
        return OVERRIDE_URL;
    }
    return url;
};

const overrideUrls = (courses) => {
    return courses.map((course) => {
        course.liveUrl = overrideUrl(course.liveUrl);
        return course;
    });
};

module.exports = { overrideUrls };
