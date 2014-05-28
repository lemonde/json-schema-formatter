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
 * @param {Object} options.name the name of the formatted
 * resources (examples: 'authors', 'articles')
 * @param {Object} options.body
 * @param {Object} options.metadata
 * @param {string} options.url the absolute full request url
 * @param {string[]} options.withRelated the names of resources
 * associated with the response which also needs formatting
 * @param {function} callback called once JSON is ready,
 * or if there was as error
 */

function format(options, callback) {

  options.body = options.body || [];
  options.withRelated = options.withRelated || [];

  //merge default and provided metadata
  var formatedResources = formatMetadata(options.url, options.metadata);

  //add resources by name
  formatedResources[options.name] = formatResource(options.name,
                                                   options.url,
                                                   options.body,
                                                   options.withRelated);

  process.nextTick(callback.bind(null, null, JSON.stringify(formatedResources)));
}


/**
 * format JSON Schema resource recursively
 */

function formatResource(name, url, body, withRelated) {

  //single resources are normalized as arrays
  if (! Array.isArray(body)) body = [body];

  //for each resource, attach the url used to fetch it
  return body.map(function(resource) {
    resource.href = getResourceURL(url, name) + '/' + resource.id;

    //format linked resources
    var links = formatRelatedResource(resource, withRelated);

    if (! _.isEmpty(links))
      resource.links = links;

    return resource;
  });
}


/**
 * format related resources into a links object
 */

function formatRelatedResource(resource, withRelated) {
    return withRelated.reduce(function (links, relatedResource) {
      if (_.has(resource, relatedResource.name)) {
        links[relatedResource.name] = formatResource(relatedResource.name,
                                                       relatedResource.url,
                                                       resource[relatedResource.name],
                                                       withRelated);
        delete resource[relatedResource.name];
        return links;
      }
    }, {});
}

/**
 * format JSON Schema metadata
 */

function formatMetadata(url, metadata) {
  return _.merge({}, {
    metas: {
      self: {
        href: url
      }
    }
  }, { metas: metadata });
}
