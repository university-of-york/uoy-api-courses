'use strict';
const fetch = require('node-fetch');
const {URLSearchParams} = require('url');
const BASE_URL = 'https://www.york.ac.uk/search/';

module.exports.courses = async event => {
  let result = {statusCode: 200, body: null};

  try {
    const url = generateUrl(event.queryStringParameters);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    checkResponse(response);

    const body = await response.json();

    result.body = JSON.stringify(body);
  } catch (e) {
    result.statusCode = 500;
    result.body = JSON.stringify({
        error: 'An error has occurred.'
    });
  }

  return result;
};

const generateUrl = parameters => {
  if (!parameters || !parameters.search) {
    throw Error();
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

const checkResponse = response => {
  if (!response.ok) {
    throw Error(response.statusText);
  }S
};
