'use strict';
const fetch = require('node-fetch');
const generateUrl = require('./utils/generateUrl');
const {success, error} = require('./utils/format');
const ClientError = require('./errors/ClientError');

module.exports.courses = async event => {
  try {
    const url = generateUrl(event.queryStringParameters);

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
    if (e instanceof ClientError) {
      return error(e.message, 400, 'Bad Request', event.path);
    } else {
      return error('An error has occurred.', 500, 'Internal Server Error', event.path);
    }
  }
};



