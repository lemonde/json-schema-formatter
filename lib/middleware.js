'use strict';

var _ = require('lodash');
var format = require('./formatter').format;
var parseExpand = require('./url-utils').parseExpand;

/**
 * Middleware to format resources into JSON SCHEMA.
 *
 * @param {string} options.domain the url request domain
 * @param {string} options.name the name of the resource to format
 * @param {object[]} options.withRelated names and base url of
 * related resource contained in the body to also format into JSON SCHEMA
 * @returns {function}
 */

module.exports = function (options) {
  return function (req, res, next) {

    //add flag to expand related resource chosed by the client
    var withRelated = expandWithRelated(options.name, req.query.expand, options.withRelated);

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
 * to get as an expanded resource.
 *
 * @param {string} resource the name of the main resource
 * @param {string} expand the expand query param
 * @param {object} withRelated the related resource to add to the response
 * @returns {object}
 */

function expandWithRelated(resource, expand, withRelated) {

  //no resource to expand
  if (! expand) return withRelated;

  return withRelated.map(function (relatedResource) {
    if (_.contains(parseExpand(expand), resource + '.' + relatedResource.name))
      relatedResource.expand = true;

    return relatedResource;
  });
}
