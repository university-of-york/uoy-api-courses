'use strict';
const COURSES = require("./courses.snapshot.js");

module.exports.courses = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      COURSES,
      null,
      2
    ),
  };
};
