const overrideUrl = (url) => {
    if (url === "https://www.york.ac.uk/study/undergraduate/courses/bsc-nursing-adult/") {
        return "https://www.york.ac.uk/study/undergraduate/subjects/nursing/";
    }
    return url;
};

module.exports = { overrideUrl };
