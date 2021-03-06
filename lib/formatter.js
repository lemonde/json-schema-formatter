'use strict';

var _ = require('lodash');
var getResourceURL = require('./url-utils').getResourceURL;

/**
 * Expose module.
 */

exports.format = format;

/**
 * Format body, metadata and url into JSON Schema.
 *
 * @param {object} options.name the name of the formatted
 * resources (examples: 'authors', 'articles')
 * @param {object} options.body
 * @param {object} options.metadata
 * @param {string} options.url the absolute full request url
 * @param {string[]} options.withRelated the names of resources
 * associated with the response which also needs formatting
 * @param {function} callback called once JSON is ready,
 * or if there was as error
 */

function format(options, callback) {
  options.body = options.body || [];
  options.withRelated = options.withRelated || [];

  //the root resource is always returned in its expanded form
  options.expand = true;

  //merge default and provided metadata
  var formatedResources = formatMetadata(options.url, options.metadata);

  //add links url templates
  var linksTemplates = formatLinksTemplate(options.name, options.withRelated);

  if (! _.isEmpty(linksTemplates))
    formatedResources.links = linksTemplates;

  //add resources by name
  formatedResources[options.name] = formatResource(options);

  process.nextTick(callback.bind(null, null, JSON.stringify(formatedResources)));
}


/**
 * Format JSON Schema resource recursively.
 *
 * @param {string} options.name name of the resource to format, used as key for
 * its object
 * @param {string} options.url url used to fetch the resource
 * @param {object} options.body content of the resource
 * @param {object} options.withRelated related resources to format recursively
 * @param {boolean} options.expand wheter to return the expanded form of the resource,
 * or to only return its ids.
 * @returns {object}
 */

function formatResource(options) {
  options.expand = options.expand || false;

  //single resources are normalized as arrays
  if (! Array.isArray(options.body)) options.body = [options.body];

  //format each resource, either in its condensed or exposed form
  return options.body.map(function(resource) {
    if (!options.expand) return resource.id;
    return formatexpandedResource(resource, options);
  });
}

/**
 * Format the expanded form of a resource, and format related resources
 * recursively.
 *
 * @param {object} resource
 * @param {object} options
 * @returns {object}
 */

function formatexpandedResource(resource, options) {
  resource.href = getResourceURL(options.url, options.name) + '/' + resource.id;

  //format linked resources
  var links = formatRelatedResource(resource, options.withRelated);

  if (! _.isEmpty(links))
    resource.links = links;

  return resource;
}

/**
 * Format the links object which contains url templates
 * for the related resources.
 *
 * @param {object} resource
 * @param {object[]} withRelated
 * @returns {object}
 */

function formatLinksTemplate(resource, withRelated) {
  return withRelated.reduce(function (links, relatedResource) {
    var id = resource + '.' + relatedResource.name;
    links[id] = {
      href: relatedResource.url + '{' + id + '}'
    };
    return links;
  }, {});
}


/**
 * Format related resources into a links object.
 *
 * @param {object} resource
 * @param {object[]} withRelated
 * @returns {object}
 */

function formatRelatedResource(resource, withRelated) {
  return withRelated.reduce(function (links, relatedResource) {
    if (_.has(resource, relatedResource.name)) {
      links[relatedResource.name] = formatResource({
        name: relatedResource.name,
        url: relatedResource.url,
        body: resource[relatedResource.name],
        expand: relatedResource.expand,
        withRelated: withRelated
      });
      delete resource[relatedResource.name];
      return links;
    }
  }, {});
}

/**
 * Format JSON Schema metadata.
 *
 * @param {string} url
 * @param {object} metatada
 * @returns {object}
 */

function formatMetadata(url, metadata) {
  return _.merge({}, {
    metas: {
      self: {
        href: decodeURIComponent(url)
      }
    }
  }, { metas: metadata });
}
