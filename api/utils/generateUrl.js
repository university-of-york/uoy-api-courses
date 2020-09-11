const {URLSearchParams} = require('url');
const ClientError = require('../errors/ClientError');
const BASE_URL = 'https://www.york.ac.uk/search/';

module.exports = parameters => {
    if (!parameters || !parameters.search) {
        throw new ClientError('The search parameter is required.');
    }

    const queryParams = new URLSearchParams("collection=york-uni-courses&form=course-search&profile=_default");

    queryParams.append("query", parameters.search);

    if (parameters.max) {
        queryParams.append("num_ranks", parameters.max);
    }
    if (parameters.offset) {
        queryParams.append("start_rank", parameters.offset);
    }

    return `${BASE_URL}?${queryParams.toString()}`;
};
