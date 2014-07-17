'use strict';

var _s = require('underscore.string');
var parseURL = require('url').parse;
var formatURL = require('url').format;

/**
 * Expose module.
 */

exports.getResourceURL= getResourceURL;
exports.parseExpand = parseExpand;

/**
 * Takes an absolute url and return one split from the start
 * up to the provided resourceName, including trailing slash.
 *
 * @param {string} url the absolute url to split
 * @param {string} resourceName the name where to split
 * @returns {string}
 * @example
 * getResourceURL('http://test.fr/authors/1?name=test', 'authors')
 * // 'http://test.fr/authors/'
 */

function getResourceURL(url, resourceName) {
  resourceName = _s.dasherize(resourceName);

  var parsedURL = parseURL(url);

  var splitPath = parsedURL
  .pathname.split('/')

  //reconstruct url up to the name of the resource,
  //ignore the rest of the url
  .reduce(function (splitPath, split) {
    if (splitPath.indexOf(resourceName) === -1) splitPath.push(split);
    return splitPath;
  }, []);

  parsedURL.pathname = splitPath.join('/');
  parsedURL.search = null;

  return formatURL(parsedURL);
}

/**
 * Parse resource to expand, which
 * are represented as a comma separated list
 * in the URL.
 *
 * @param {string} expand
 * @returns {string}
 */
function parseExpand(expand) {
  return decodeURIComponent(expand).split(',');
}
