'use strict';
const fetch = require('node-fetch');
const {coursesUrl} = require('./utils/constructFunnelbackUrls');
const {success, error} = require('./utils/format');
const ClientError = require('./errors/ClientError');
const {transformResponse} = require('./utils/transformResponse');

module.exports.courses = async event => {
  try {
    const url = coursesUrl(event.queryStringParameters);

    const searchResponse = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!searchResponse.ok) {
      return error('An error has occurred.', searchResponse.status, searchResponse.statusText, event.path);
    }

    const body = await searchResponse.json();
    const results = transformResponse(body.results);

    return success({results: results});

  } catch (e) {
    switch (e.constructor.name) {
      case ClientError.name:
        return error(e.message, 400, 'Bad Request', event.path);
      default:
        return error('An error has occurred.', 500, 'Internal Server Error', event.path);
    }
  }
};

