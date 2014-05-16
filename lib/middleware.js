'use strict';

var format = require('./formatter').format;

/**
 * Middleware to format resources into JSON SCHEMA
 *
 * @param {string} options.domain the url request domain
 * @param {string} options.name the name of the resource to format
 */
module.exports = function (options) {
  return function (req, res) {
    res.contentType('application/json');
    res.send(format({
      url: options.domain + req.url,
      name: options.name,
      body: res.body,
      metadata: res.metadata
    }));
  };
};
