const { URLSearchParams } = require("url");
const { BASE_URL, COLLECTION, FORM, PROFILE, SMETA_CONTENT_TYPE } = require("../constants/UrlAndParameters");

module.exports.coursesUrl = (parameters) => {
    const queryParams = new URLSearchParams();

    queryParams.append("collection", COLLECTION);
    queryParams.append("form", FORM);
    queryParams.append("profile", PROFILE);
    queryParams.append("smeta_contentType", SMETA_CONTENT_TYPE);

    if (parameters.search) {
        queryParams.append("query", parameters.search);
    }

    if (parameters.max) {
        queryParams.append("num_ranks", parameters.max);
    }

    if (parameters.offset) {
        queryParams.append("start_rank", parameters.offset);
    }

    return `${BASE_URL}?${queryParams.toString()}`;
};
