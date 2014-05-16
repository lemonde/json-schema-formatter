'use strict';

var getResourceURL = require('./url-utils').getResourceURL;
var _ = require('lodash');

/**
 * Expose module.
 */

exports.format = format;

/**
 * Format body, metadata and url into JSON Schema.
 *
 * @param {Object} options
 * @param {Object} options.body
 * @param {Object} options.metadata
 * @param {string} options.url
 * @param {function} callback called once JSON is ready,
 * or if there was as error
 */

function format(options, callback) {

  //single resources are normalized as arrays
  if (! Array.isArray(options.body)) options.body = [options.body];

  //for each resource, attach the url used to fetch it
  var resources = options.body.map(function(resource) {
    resource.href = getResourceURL(options.url, options.name) + '/' + resource.id;
    return resource;
  });

  //merge default and provided metadata
  var formatedResources = _.merge({}, {
    metas: {
      self: {
        href: options.url
      }
    }
  }, { metas: options.metadata });

  //add resources by name
  formatedResources[options.name] = resources;

  process.nextTick(callback.bind(null, null, JSON.stringify(formatedResources)));
}
