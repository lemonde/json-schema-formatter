'use strict';

var _ = require('lodash');
var format = require('./formatter').format;
var parseExpand = require('./url-utils').parseExpand;

/**
 * Middleware to format resources into JSON SCHEMA
 *
 * @param {string} options.domain the url request domain
 * @param {string} options.name the name of the resource to format
 * @param {Object[]} options.withRelated names and base url of
 * related resource contained in the body to also format into JSON SCHEMA
 */
module.exports = function (options) {
  return function (req, res, next) {

    //add flag to expend related resource chosed by the client
    var withRelated = expendWithRelated(options.name, req.query.expend, options.withRelated);

    res.set('Content-Type', 'application/json; charset=utf-8');
    format({
      url: options.domain + req.originalUrl,
      name: options.name,
      withRelated: withRelated,
      body: res.body,
      metadata: res.metadata
    }, function (err, resource) {
      if (err) return next(err);

      res.send(resource);
    });
  };
};

/**
 * Add a flag to every related resource the client wants
 * to get as an expanded resource
 *
 * @param {string} resource the name of the main resource
 * @param {string} expend the expend query param
 * @param {Object} withRelated the related resource to add to the response
 */
function expendWithRelated(resource, expend, withRelated) {

  //no resource to expend
  if (! expend) return withRelated;

  return withRelated.map(function (relatedResource) {
    if (_.contains(parseExpand(expend), resource + '.' + relatedResource.name))
      relatedResource.expend = true;

    return relatedResource;
  });
}
