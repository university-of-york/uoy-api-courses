'use strict';
const fetch = require('node-fetch');
const BASE_URL = 'https://www.york.ac.uk/search/?collection=york-uni-courses&form=course-search&profile=_default&query=';

module.exports.courses = async event => {

  let params = event.queryStringParameters;

  let url = `${BASE_URL}${params.query}`

  let response = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  });

  let json = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(json),
  };
};
