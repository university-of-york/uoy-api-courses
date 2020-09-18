'use strict';
const fetch = require('node-fetch');
const {coursesUrl} = require('./utils/constructFunnelbackUrls');
const {success, error} = require('./utils/format');
const ClientError = require('./errors/ClientError');

module.exports.courses = async event => {
  try {
    const url = coursesUrl(event.queryStringParameters);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return error('An error has occurred.', response.status, response.statusText, event.path);
    }

    const body = await response.json();

    return success(body);
  } catch (e) {
    switch (e.constructor.name) {
      case ClientError.name:
        return error(e.message, 400, 'Bad Request', event.path);
      default:
        return error('An error has occurred.', 500, 'Internal Server Error', event.path);
    }
  }
};



