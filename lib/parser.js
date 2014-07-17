'use strict';

module.exports.parse = parse;

/**
 * Remove all JSON Schema specific fields from
 * the provided JSON Schema string
 *
 * @param {string} options.body the JSON Schema JSON string
 * to parse into a JavaScript Object
 * @param {string} options.name the name of the main resource
 * of the JSON Schema string
 */
function parse(options) {
  var body = JSON.parse(options.body);
  return body[options.name];
}

