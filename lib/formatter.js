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
 * @returns {Object} JSON Schema object
 */

function format(options) {
  if (! Array.isArray(options.body)) options.body = [options.body];

  var data = options.body.map(function(resource) {
    resource.href = url + '/' + resource.id;
    return resource;
  });

  var json = {
    metas: {
      self: {
        href: options.url
      }
    }
  };

  jsonAPI[options.name] = data;

  return json;
}