'use strict';
const fetch = require('node-fetch');
const BASE_URL = 'https://www.york.ac.uk/search/?collection=york-uni-courses&form=course-search&profile=_default&query=';

module.exports.courses = async event => {

  const {query, max, offset} = event.queryStringParameters;

  let url = `${BASE_URL}${query}`;

  if (max) {
    url += `&num_ranks=${max}`;
  }
  if (offset) {
    url += `&start_rank=${offset}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const json = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(json),
  };
};

