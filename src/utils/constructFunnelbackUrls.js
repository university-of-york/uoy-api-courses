const { URLSearchParams } = require("url");
const ClientError = require("../errors/ClientError");
const BASE_URL = "https://www.york.ac.uk/search/";

module.exports.coursesUrl = (parameters) => {
    if (!parameters || !parameters.search) {
        throw new ClientError("The search parameter is required.");
    }

    const queryParams = new URLSearchParams();

    queryParams.append("collection", "york-uni-courses");
    queryParams.append("form", "course-search");
    queryParams.append("profile", "_default");
    queryParams.append("query", parameters.search);

    if (parameters.max) {
        queryParams.append("num_ranks", parameters.max);
    }
    if (parameters.offset) {
        queryParams.append("start_rank", parameters.offset);
    }

    return `${BASE_URL}?${queryParams.toString()}`;
};
