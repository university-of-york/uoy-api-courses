const { URLSearchParams } = require("url");
const ClientError = require("../errors/ClientError");
const { BASE_URL, COLLECTION, FORM, PROFILE, SMETA_CONTENT_TYPE } = require("../constants/UrlAndParameters");

module.exports.coursesUrl = (parameters) => {
    if (!parameters || !parameters.search) {
        throw new ClientError("The search parameter is required.");
    }

    const queryParams = new URLSearchParams();

    queryParams.append("collection", COLLECTION);
    queryParams.append("form", FORM);
    queryParams.append("profile", PROFILE);
    queryParams.append("smeta_contentType", SMETA_CONTENT_TYPE);
    queryParams.append("query", parameters.search);

    if (parameters.max) {
        queryParams.append("num_ranks", parameters.max);
    }

    if (parameters.offset) {
        queryParams.append("start_rank", parameters.offset);
    }

    return `${BASE_URL}?${queryParams.toString()}`;
};
