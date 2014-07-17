'use strict';

module.exports = parse;

/**
 * Remove all JSON Schema specific fields from
 * the provided JSON Schema string
 *
 * @param {string} options.body the JSON Schema JSON string
 * to parse into a JavaScript Object
 * @param {string} options.name the name of the main resource
 * of the JSON Schema string
 * @param {function} callback called once parsing is complete
 */
function parse(options, callback) {
  var body = JSON.parse(options.body);
  process.nextTick(callback.bind(null, null, body[options.name]));
}

