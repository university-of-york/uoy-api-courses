'use strict';
const fetch = require('node-fetch');
const BASE_URL = 'https://www.york.ac.uk/search/?collection=york-uni-courses&form=course-search&profile=_default&query=';

module.exports.courses = async event => {
  let result = {statusCode: 200, body: null};

  if (!event.queryStringParameters) {
    result.body = JSON.stringify({results: []});
    return result;
  }

  const {search, max, offset} = event.queryStringParameters;

  let url = `${BASE_URL}${search}`;

  if (max) {
    url += `&num_ranks=${max}`;
  }
  if (offset) {
    url += `&start_rank=${offset}`;
  }

  try {
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
    })
  }

  return result;
};

const checkResponse = response => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
};
