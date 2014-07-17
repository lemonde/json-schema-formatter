'use strict';

var _ = require('lodash');
var parse = require('./parser');

/**
 * Middleware to format JSON SCHEMA resources into JavaScript object
 *
 * @param {string} options.name the name of the resource to format
 * @returns {function}
 */

module.exports = function (options) {
  return function (req, res, next) {
    parse({
      name: options.name,
      body: res.body
    }, function (err, resource) {
      res.body = resource;
      next(err);
    });
  };
};
