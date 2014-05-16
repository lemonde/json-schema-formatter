'use strict';

var format = require('./formatter').format;

/**
 * Middleware to format resources into JSON SCHEMA
 *
 * @param {string} options.domain the url request domain
 * @param {string} options.name the name of the resource to format
 */
module.exports = function (options) {
  return function (req, res, next) {
    res.set('Content-Type', 'application/json; charset=utf-8');
    format({
      url: options.domain + req.originalUrl,
      name: options.name,
      body: res.body,
      metadata: res.metadata
    }, function (err, resource) {
      if (err) return next(err);

      res.send(resource);
    });
  };
};
