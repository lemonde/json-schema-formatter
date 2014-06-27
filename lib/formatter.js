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

  //the root resource is always returned in its expended form
  options.expend = true;

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
 * format JSON Schema resource recursively
 *
 * @param {string} options.name name of the resource to format, used as key for
 * its object
 * @param {string} options.url url used to fetch the resource
 * @param {Object} options.body content of the resource
 * @param {Object} options.withRelated related resources to format recursively
 * @param {boolean} options.expend wheter to return the expended form of the resource,
 * or to only return its ids.
 */

function formatResource(options) {
  options.expend = options.expend || false;

  //single resources are normalized as arrays
  if (! Array.isArray(options.body)) options.body = [options.body];

  //format each resource, either in its condensed or exposed form
  return options.body.map(function(resource) {
    if (!options.expend) return resource.id;
    return formatExpendedResource(resource, options);
  });
}

/**
 * Format the expended form of a resource, and format related resources
 * recursively
 */

function formatExpendedResource(resource, options) {
    resource.href = getResourceURL(options.url, options.name) + '/' + resource.id;

    //format linked resources
    var links = formatRelatedResource(resource, options.withRelated);

    if (! _.isEmpty(links))
      resource.links = links;

    return resource;
}

/**
 * format the links object which contains url templates
 * for the related resources
 */

function formatLinksTemplate(resource, withRelated) {
  return withRelated.reduce(function (links, relatedResource) {
    var id = resource + '.' + relatedResource.name;
    links[id] = relatedResource.url + '{' + id + '}';
    return links;
  }, {});
}


/**
 * format related resources into a links object
 */

function formatRelatedResource(resource, withRelated) {
    return withRelated.reduce(function (links, relatedResource) {
      if (_.has(resource, relatedResource.name)) {
        links[relatedResource.name] = formatResource({
          name: relatedResource.name,
          url: relatedResource.url,
          body: resource[relatedResource.name],
          withRelated: withRelated
        });
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
