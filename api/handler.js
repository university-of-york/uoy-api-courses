'use strict';
const fetch = require('node-fetch');
const generateUrl = require('utils/generateUrl');
const formatError = require('utils/formatError');
const ClientError = require('error/ClientError');

module.exports.courses = async event => {
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

    return {
      statusCode: 200,
      body: JSON.stringify(body)
    }
  } catch (e) {
    if (e instanceof ClientError) {
      return formatError(e.message, 400, 'Bad Request', event.path);
    } else {
      return formatError('An error has occurred.', 500, 'Internal Server Error', event.path);
    }
  }
};

const checkResponse = response => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
};
