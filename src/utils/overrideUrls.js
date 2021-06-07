const { URLS_TO_OVERRIDE } = require("../constants/nursingOverrides");

const overrideUrl = (url) => {
    if (URLS_TO_OVERRIDE.includes(url)) {
        return "https://www.york.ac.uk/study/undergraduate/subjects/nursing/";
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
